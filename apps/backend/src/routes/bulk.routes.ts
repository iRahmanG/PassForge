import { Router, Request, Response } from 'express';
import { bulkService } from '../modules/bulk/bulk.service.js';
import { bulkGenerateRequestSchema } from '@passforge/shared';
import { bulkJobLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();

/**
 * POST /api/bulk/generate
 * Enqueue bulk ticket generation for selected attendees and formats
 */
router.post('/generate', bulkJobLimiter, async (req: Request, res: Response) => {
  try {
    const parseResult = bulkGenerateRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed for bulk generation request',
        details: parseResult.error.format(),
      });
    }

    const { attendeeIds, formats, designId } = parseResult.data;

    const job = await bulkService.createJob({
      attendeeIds,
      formats,
      designId,
    });

    return res.status(202).json({
      success: true,
      jobId: job.jobId,
      status: job.status,
      totalTasks: job.totalTasks,
      selectedAttendeeCount: job.attendeeIds.length,
      selectedFormats: job.formats,
      message: `Enqueued ${job.totalTasks} ticket generation tasks across ${job.attendeeIds.length} attendees and ${job.formats.length} formats.`,
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      error: err.message || 'Failed to initiate bulk ticket generation',
    });
  }
});

/**
 * GET /api/bulk/:jobId
 * Poll progress and results for a bulk generation job
 */
router.get('/:jobId', (req: Request, res: Response) => {
  const jobId = String(req.params.jobId);
  const job = bulkService.getJob(jobId);

  if (!job) {
    return res.status(404).json({
      success: false,
      error: `Bulk generation job not found: "${jobId}"`,
    });
  }

  const isTerminal =
    job.status === 'COMPLETED' ||
    job.status === 'COMPLETED_WITH_ERRORS' ||
    job.status === 'FAILED' ||
    job.status === 'CANCELLED';

  const failedTasks = job.tasks.filter((t) => t.status === 'FAILED');

  return res.json({
    success: true,
    jobId: job.jobId,
    status: job.status,
    totalTasks: job.totalTasks,
    completedTasks: job.completedTasks,
    failedTasks: job.failedTasks,
    pendingTasks: job.pendingTasks,
    progressPercent: job.progressPercent,
    createdAt: job.createdAt,
    completedAt: job.completedAt,
    tasks: job.tasks,
    failedTaskList: failedTasks,
    isTerminal,
  });
});

/**
 * POST /api/bulk/:jobId/retry
 * Retry only failed tasks for a completed/partially failed job
 */
router.post('/:jobId/retry', bulkJobLimiter, async (req: Request, res: Response) => {
  const jobId = String(req.params.jobId);
  try {
    const job = await bulkService.retryJob(jobId);
    return res.json({
      success: true,
      jobId: job.jobId,
      status: job.status,
      totalTasks: job.totalTasks,
      completedTasks: job.completedTasks,
      failedTasks: job.failedTasks,
      pendingTasks: job.pendingTasks,
      progressPercent: job.progressPercent,
      message: `Retrying ${job.pendingTasks} failed tasks.`,
    });
  } catch (err: any) {
    const status = err.message.includes('not found') ? 404 : 400;
    return res.status(status).json({
      success: false,
      error: err.message,
    });
  }
});

/**
 * POST /api/bulk/:jobId/cancel
 * Safely cancel an in-flight bulk generation job
 */
router.post('/:jobId/cancel', (req: Request, res: Response) => {
  const jobId = String(req.params.jobId);
  try {
    const job = bulkService.cancelJob(jobId);
    return res.json({
      success: true,
      jobId: job.jobId,
      status: job.status,
      message: 'Job cancelled by organizer',
    });
  } catch (err: any) {
    return res.status(404).json({
      success: false,
      error: err.message,
    });
  }
});

/**
 * GET /api/bulk/:jobId/download
 * Download a valid ZIP archive of all successful tickets
 */
router.get('/:jobId/download', async (req: Request, res: Response) => {
  const jobId = String(req.params.jobId);
  try {
    await bulkService.streamZip(jobId, res);
  } catch (err: any) {
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        error: err.message || 'Failed to stream ZIP archive',
      });
    }
  }
});

export default router;
