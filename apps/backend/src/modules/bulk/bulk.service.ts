import fs from 'node:fs';
import path from 'node:path';
import { Response } from 'express';
import { ZipArchive } from 'archiver';
import {
  OutputFormat,
  BulkJob,
  BulkTask,
  BulkJobStatus,
  TicketDesignId,
  BrandingConfig,
  TicketData,
} from '@passforge/shared';
import { OUTPUT_DIR } from '../../config/constants.js';
import { attendeeService } from '../attendee/attendee.service.js';
import { eventService } from '../event/event.service.js';
import { designService } from '../design/design.service.js';
import { ticketService } from '../ticket/ticket.service.js';
import { ticketRenderer } from '../../services/rendering/ticketRenderer.service.js';

export const JOB_RETENTION_MS = 2 * 60 * 60 * 1000; // 2 hours retention period
export const BULK_DIR_PREFIX = 'bulk_';

export class BulkService {
  private jobs: Map<string, BulkJob> = new Map();
  private concurrency = 3;
  private activeWorkers: Map<string, number> = new Map();
  private activeDownloads: Map<string, number> = new Map();
  private cleanupTimer: NodeJS.Timeout | null = null;

  /**
   * Configure worker concurrency limit (default: 3)
   */
  setConcurrency(limit: number) {
    if (limit > 0 && limit <= 10) {
      this.concurrency = limit;
    }
  }

  getConcurrency(): number {
    return this.concurrency;
  }

  /**
   * Sanitize an attendee name for safe filesystem and ZIP archive storage
   */
  sanitizeFilename(name: string, attendeeId: string, ext: string): string {
    const safeName = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9_-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 48) || 'attendee';
    
    // Prevent collision on duplicate attendee names by appending attendee ID suffix
    const safeId = attendeeId.replace(/[^a-z0-9_-]/gi, '-');
    return `${safeName}-${safeId}.${ext}`;
  }

  /**
   * Create and enqueue a new bulk generation job
   */
  async createJob(params: {
    attendeeIds: string[];
    formats: OutputFormat[];
    designId?: TicketDesignId;
  }): Promise<BulkJob> {
    const { formats, designId } = params;

    // Deduplicate attendee IDs
    const rawIds = Array.from(new Set(params.attendeeIds));
    if (rawIds.length === 0) {
      throw new Error('At least one attendee must be selected');
    }

    if (!formats || formats.length === 0) {
      throw new Error('At least one output format must be selected');
    }

    const validFormats: OutputFormat[] = ['email', 'page', 'pdf', 'png'];
    for (const f of formats) {
      if (!validFormats.includes(f)) {
        throw new Error(`Unsupported output format: "${f}"`);
      }
    }

    // Validate attendees exist in attendeeService
    const allAttendees = attendeeService.getAllAttendees();
    const attendeeMap = new Map(allAttendees.map((a) => [a.id, a]));

    const validAttendees: typeof allAttendees = [];
    for (const id of rawIds) {
      const att = attendeeMap.get(id);
      if (!att) {
        throw new Error(`Attendee not found with ID: "${id}"`);
      }
      validAttendees.push(att);
    }

    const currentConfig = designService.getCurrentConfig();
    const effectiveDesignId = designId || currentConfig.designId;
    const effectiveBranding = currentConfig.branding;

    const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const outputDir = path.join(OUTPUT_DIR, `${BULK_DIR_PREFIX}${jobId}`);
    fs.mkdirSync(outputDir, { recursive: true });

    // Create subdirectories for selected formats only
    for (const fmt of formats) {
      const folderName = fmt;
      fs.mkdirSync(path.join(outputDir, folderName), { recursive: true });
    }

    // Build individual attendee-format tasks
    const tasks: BulkTask[] = [];
    for (const att of validAttendees) {
      const safeAttId = att.id || 'attendee';
      for (const fmt of formats) {
        const taskId = `${jobId}_${safeAttId}_${fmt}`;
        tasks.push({
          taskId,
          jobId,
          attendeeId: safeAttId,
          attendeeName: att.name,
          format: fmt,
          status: 'PENDING',
        });
      }
    }

    const job: BulkJob = {
      jobId,
      status: 'QUEUED',
      designId: effectiveDesignId,
      branding: effectiveBranding,
      attendeeIds: validAttendees.map((a) => a.id || 'attendee'),
      formats,
      totalTasks: tasks.length,
      completedTasks: 0,
      failedTasks: 0,
      pendingTasks: tasks.length,
      progressPercent: 0,
      createdAt: new Date().toISOString(),
      tasks,
      outputDir,
    };

    this.jobs.set(jobId, job);

    // Start processing in background with bounded concurrency
    setImmediate(() => {
      this.processJob(jobId);
    });

    return job;
  }

  /**
   * Process pending tasks for a job using controlled concurrency
   */
  async processJob(jobId: string): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job || job.status === 'CANCELLED') return;

    job.status = 'PROCESSING';
    this.activeWorkers.set(jobId, 0);

    const pendingTasks = job.tasks.filter((t) => t.status === 'PENDING');
    if (pendingTasks.length === 0) {
      this.finalizeJob(job);
      return;
    }

    let nextTaskIndex = 0;
    const isJobCancelled = () => (job.status as BulkJobStatus) === 'CANCELLED';

    const executeNext = async (): Promise<void> => {
      while (nextTaskIndex < pendingTasks.length) {
        if (isJobCancelled()) break;

        const task = pendingTasks[nextTaskIndex++];
        if (!task || task.status !== 'PENDING') continue;
        if (isJobCancelled()) break;

        task.status = 'PROCESSING';
        const start = performance.now();

        try {
          await this.renderTask(job, task);
          if (isJobCancelled()) {
            task.status = 'FAILED';
            task.error = 'Job cancelled by organizer';
            task.durationMs = Math.round(performance.now() - start);
          } else {
            task.status = 'COMPLETED';
            task.durationMs = Math.round(performance.now() - start);
            job.completedTasks++;
          }
        } catch (err: any) {
          task.status = 'FAILED';
          task.error = isJobCancelled()
            ? 'Job cancelled by organizer'
            : err.message || 'Rendering error occurred';
          task.durationMs = Math.round(performance.now() - start);
          if (!isJobCancelled()) {
            job.failedTasks++;
          }
        } finally {
          if (!isJobCancelled()) {
            job.pendingTasks = Math.max(0, job.totalTasks - job.completedTasks - job.failedTasks);
            job.progressPercent = Math.round(
              ((job.completedTasks + job.failedTasks) / job.totalTasks) * 100
            );
          }
        }
      }
    };

    // Spawn workers up to configured concurrency limit
    const workerCount = Math.min(this.concurrency, pendingTasks.length);
    const workerPromises: Promise<void>[] = [];

    for (let i = 0; i < workerCount; i++) {
      workerPromises.push(executeNext());
    }

    await Promise.all(workerPromises);
    this.finalizeJob(job);
  }

  /**
   * Render an individual attendee-format task and write output to disk
   */
  private async renderTask(job: BulkJob, task: BulkTask): Promise<void> {
    const attendee = attendeeService.getAttendeeById(task.attendeeId);
    if (!attendee) {
      throw new Error(`Attendee ${task.attendeeId} not found`);
    }

    const ticket: TicketData = await ticketService.createTicketData(attendee);
    const renderOpts = {
      designId: job.designId,
      branding: job.branding,
    };

    const folderName = task.format;
    const ext = task.format === 'email' || task.format === 'page' ? 'html' : task.format;
    const fileName = this.sanitizeFilename(attendee.name, attendee.id || 'attendee', ext);
    const outputPath = path.join(job.outputDir, folderName, fileName);

    switch (task.format) {
      case 'email': {
        const { html } = await ticketRenderer.renderEmail(ticket, renderOpts);
        fs.writeFileSync(outputPath, html, 'utf-8');
        task.outputPath = outputPath;
        task.fileName = fileName;
        task.sizeBytes = Buffer.byteLength(html, 'utf-8');
        break;
      }
      case 'page': {
        const { html } = await ticketRenderer.renderPage(ticket, renderOpts);
        fs.writeFileSync(outputPath, html, 'utf-8');
        task.outputPath = outputPath;
        task.fileName = fileName;
        task.sizeBytes = Buffer.byteLength(html, 'utf-8');
        break;
      }
      case 'pdf': {
        const { pdf } = await ticketRenderer.renderPdf(ticket, renderOpts);
        fs.writeFileSync(outputPath, Buffer.from(pdf));
        task.outputPath = outputPath;
        task.fileName = fileName;
        task.sizeBytes = pdf.length;
        break;
      }
      case 'png': {
        const { image } = await ticketRenderer.renderCanvas(ticket, renderOpts);
        fs.writeFileSync(outputPath, Buffer.from(image));
        task.outputPath = outputPath;
        task.fileName = fileName;
        task.sizeBytes = image.length;
        break;
      }
      default:
        throw new Error(`Unknown format ${task.format}`);
    }
  }

  /**
   * Finalize job state counters and terminal status
   */
  private finalizeJob(job: BulkJob) {
    job.completedAt = new Date().toISOString();
    job.pendingTasks = 0;
    job.progressPercent = 100;

    // A cancelled job must remain CANCELLED permanently
    if (job.status === 'CANCELLED') {
      return;
    }

    if (job.failedTasks === 0) {
      job.status = 'COMPLETED';
    } else if (job.completedTasks > 0) {
      job.status = 'COMPLETED_WITH_ERRORS';
    } else {
      job.status = 'FAILED';
    }
  }

  /**
   * Get job progress and metadata
   */
  getJob(jobId: string): BulkJob | undefined {
    return this.jobs.get(jobId);
  }

  /**
   * Retry only failed tasks for an existing job without re-rendering completed ones
   */
  async retryJob(jobId: string): Promise<BulkJob> {
    const job = this.jobs.get(jobId);
    if (!job) {
      throw new Error(`Bulk job not found: "${jobId}"`);
    }

    if (job.status === 'CANCELLED') {
      throw new Error('Cannot retry a cancelled job');
    }

    if (job.status === 'PROCESSING') {
      throw new Error('Cannot retry a job that is currently processing');
    }

    const failedTasks = job.tasks.filter((t) => t.status === 'FAILED');
    if (failedTasks.length === 0) {
      throw new Error('No failed tasks found to retry');
    }

    // Reset only failed tasks to PENDING
    for (const t of failedTasks) {
      t.status = 'PENDING';
      t.error = undefined;
    }

    job.failedTasks = 0;
    job.pendingTasks = failedTasks.length;
    job.status = 'PROCESSING';
    job.progressPercent = Math.round(
      (job.completedTasks / job.totalTasks) * 100
    );

    // Resume queue processing
    setImmediate(() => {
      this.processJob(jobId);
    });

    return job;
  }

  /**
   * Safely cancel an in-flight job
   */
  cancelJob(jobId: string): BulkJob {
    const job = this.jobs.get(jobId);
    if (!job) {
      throw new Error(`Bulk job not found: "${jobId}"`);
    }

    // Idempotent: return directly if already cancelled or in terminal completed/failed state
    if (job.status === 'CANCELLED' || job.status === 'COMPLETED' || job.status === 'FAILED') {
      return job;
    }

    job.status = 'CANCELLED';
    for (const t of job.tasks) {
      if (t.status === 'PENDING' || t.status === 'PROCESSING') {
        t.status = 'FAILED';
        t.error = 'Job cancelled by organizer';
      }
    }
    job.failedTasks = job.totalTasks - job.completedTasks;
    job.pendingTasks = 0;
    job.progressPercent = 100;
    job.completedAt = new Date().toISOString();
    return job;
  }

  /**
   * Stream a valid ZIP archive containing all successful ticket outputs and manifest.json
   */
  async streamZip(jobId: string, res: Response): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job) {
      res.status(404).json({ success: false, error: `Bulk job "${jobId}" not found` });
      return;
    }

    const completedTasks = job.tasks.filter(
      (t) => t.status === 'COMPLETED' && t.outputPath && fs.existsSync(t.outputPath)
    );

    if (completedTasks.length === 0) {
      res.status(400).json({
        success: false,
        error: 'No successful ticket outputs available to download in ZIP archive',
      });
      return;
    }

    const currentEvent = eventService.getCurrentEvent();

    // Prepare safe manifest metadata without private attendee PII
    const manifest = {
      eventName: currentEvent.name,
      eventDate: currentEvent.date,
      venue: currentEvent.venue,
      jobId: job.jobId,
      designId: job.designId,
      generatedAt: new Date().toISOString(),
      selectedFormats: job.formats,
      totalRequestedOutputs: job.totalTasks,
      successfulOutputs: completedTasks.length,
      failedOutputs: job.failedTasks,
      files: completedTasks.map((t) => ({
        format: t.format,
        fileName: t.fileName,
        sizeBytes: t.sizeBytes,
      })),
    };

    const zipFilename = `passforge-tickets-${job.jobId}.zip`;

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${zipFilename}"`);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    this.activeDownloads.set(job.jobId, (this.activeDownloads.get(job.jobId) || 0) + 1);

    try {
      const archive = new ZipArchive();

      archive.on('error', (err) => {
        if (!res.headersSent) {
          res.status(500).json({ success: false, error: 'ZIP archive streaming failed: ' + err.message });
        }
      });

      archive.pipe(res);

      // 1. Add manifest.json at root of ZIP
      archive.append(JSON.stringify(manifest, null, 2), { name: 'manifest.json' });

      // 2. Add each successful file into its respective format folder
      for (const t of completedTasks) {
        if (t.outputPath && fs.existsSync(t.outputPath)) {
          const folderName = t.format;
          const entryName = `${folderName}/${t.fileName}`;
          archive.file(t.outputPath, { name: entryName });
        }
      }

      await archive.finalize();
    } finally {
      const active = (this.activeDownloads.get(job.jobId) || 1) - 1;
      if (active <= 0) {
        this.activeDownloads.delete(job.jobId);
      } else {
        this.activeDownloads.set(job.jobId, active);
      }
    }
  }

  /**
   * Delete temporary files associated with a job
   */
  deleteJob(jobId: string): boolean {
    const job = this.jobs.get(jobId);
    if (!job) return false;

    try {
      if (fs.existsSync(job.outputDir)) {
        fs.rmSync(job.outputDir, { recursive: true, force: true });
      }
      this.jobs.delete(jobId);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Clean up jobs older than retention period (default: 2 hours).
   * Semantics:
   * 1. Preserves non-terminal jobs (QUEUED, PROCESSING) regardless of age.
   * 2. Retention window starts from completedAt (terminal timestamp), falling back to createdAt.
   * 3. Preserves jobs currently being downloaded (active streaming).
   * 4. Removes both the in-memory entry and disk directory.
   */
  cleanupExpiredJobs(maxAgeMs: number = JOB_RETENTION_MS): { cleanedCount: number; remainingCount: number } {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [jobId, job] of this.jobs.entries()) {
      // 1. Preserve active/in-flight jobs regardless of age
      const isTerminal =
        job.status === 'COMPLETED' ||
        job.status === 'COMPLETED_WITH_ERRORS' ||
        job.status === 'FAILED' ||
        job.status === 'CANCELLED';
      if (!isTerminal) {
        continue;
      }

      // 2. Safe download check: Do not delete if an active client download is in progress
      if ((this.activeDownloads.get(jobId) || 0) > 0) {
        continue;
      }

      // 3. Retention period begins from completedAt (or createdAt as fallback)
      const terminalTimestamp = job.completedAt
        ? new Date(job.completedAt).getTime()
        : new Date(job.createdAt).getTime();

      if (now - terminalTimestamp > maxAgeMs) {
        try {
          if (fs.existsSync(job.outputDir)) {
            fs.rmSync(job.outputDir, { recursive: true, force: true });
          }
        } catch (err: any) {
          console.warn(`Failed to remove output dir for expired job "${jobId}":`, err.message);
        }
        this.jobs.delete(jobId);
        cleanedCount++;
      }
    }

    return { cleanedCount, remainingCount: this.jobs.size };
  }

  /**
   * Start periodic background cleanup for expired jobs (default: every 15 minutes)
   * Guaranteed to be started exactly once.
   */
  startPeriodicCleanup(intervalMs: number = 15 * 60 * 1000, maxAgeMs: number = JOB_RETENTION_MS): void {
    if (this.cleanupTimer) return;

    this.cleanupTimer = setInterval(() => {
      try {
        this.cleanupExpiredJobs(maxAgeMs);
      } catch (err: any) {
        console.warn('⚠️ Non-fatal: Periodic expired job cleanup error:', err.message);
      }
    }, intervalMs);

    this.cleanupTimer.unref();
  }

  /**
   * Safely stop periodic background cleanup timer
   */
  stopPeriodicCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }

  isCleanupTimerActive(): boolean {
    return this.cleanupTimer !== null;
  }

  /**
   * Clean up orphaned bulk_* directories on server startup
   * Strictly targets directories matching BULK_DIR_PREFIX without touching other outputs
   */
  cleanupOrphanedDirs(outputDir: string = OUTPUT_DIR): { removedDirs: string[]; errors: string[] } {
    const removedDirs: string[] = [];
    const errors: string[] = [];

    if (!fs.existsSync(outputDir)) {
      return { removedDirs, errors };
    }

    try {
      const entries = fs.readdirSync(outputDir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory() && entry.name.startsWith(BULK_DIR_PREFIX)) {
          // If job is actively registered in memory, do not remove
          const jobId = entry.name.slice(BULK_DIR_PREFIX.length);
          if (this.jobs.has(jobId)) continue;

          const fullPath = path.join(outputDir, entry.name);
          try {
            fs.rmSync(fullPath, { recursive: true, force: true });
            removedDirs.push(entry.name);
          } catch (err: any) {
            errors.push(`Failed to remove ${entry.name}: ${err.message}`);
          }
        }
      }
    } catch (err: any) {
      errors.push(`Failed to read output directory: ${err.message}`);
    }

    return { removedDirs, errors };
  }
}

export const bulkService = new BulkService();
