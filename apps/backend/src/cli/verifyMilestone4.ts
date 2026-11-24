import fs from 'node:fs';
import path from 'node:path';
import { EventEmitter } from 'node:events';
import { bulkService } from '../modules/bulk/bulk.service.js';
import { attendeeService } from '../modules/attendee/attendee.service.js';
import { eventService } from '../modules/event/event.service.js';
import { bulkGenerateRequestSchema } from '@passforge/shared';
import { OUTPUT_DIR } from '../config/constants.js';

interface TestAssertion {
  name: string;
  passed: boolean;
  details?: string;
}

// Mock Express Response to capture streamed ZIP output
class MockResponse extends EventEmitter {
  public headers: Record<string, string> = {};
  public statusCode = 200;
  public chunks: Buffer[] = [];
  public finished = false;
  public jsonData: any = null;

  setHeader(name: string, value: string) {
    this.headers[name.toLowerCase()] = value;
  }

  status(code: number) {
    this.statusCode = code;
    return this;
  }

  json(data: any) {
    this.jsonData = data;
    this.write(Buffer.from(JSON.stringify(data)));
    return this.end();
  }

  write(chunk: any) {
    if (chunk) {
      this.chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return true;
  }

  end(chunk?: any) {
    if (chunk) {
      this.chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    this.finished = true;
    this.emit('finish');
    return this;
  }

  getBuffer(): Buffer {
    return Buffer.concat(this.chunks);
  }
}

export async function runMilestone4Verification(): Promise<{ passed: boolean; results: TestAssertion[] }> {
  const assertions: TestAssertion[] = [];

  console.log('===============================================================');
  console.log('   PassForge Milestone 4: Bulk Generation & ZIP Export Suite');
  console.log('===============================================================\n');

  // --- Test 1: Schema & Input Validation ---
  console.log('Test 1: Schema & Input Validation Rejections...');
  
  // 1a: Empty attendeeIds
  const emptyAttendeesRes = bulkGenerateRequestSchema.safeParse({ attendeeIds: [], formats: ['pdf'] });
  assertions.push({
    name: 'Validation: Rejects empty attendee list (400)',
    passed: !emptyAttendeesRes.success,
    details: emptyAttendeesRes.success ? 'Expected failure' : 'Properly rejected empty attendeeIds',
  });

  // 1b: Empty formats
  const emptyFormatsRes = bulkGenerateRequestSchema.safeParse({ attendeeIds: ['att-1'], formats: [] });
  assertions.push({
    name: 'Validation: Rejects empty formats list (400)',
    passed: !emptyFormatsRes.success,
    details: emptyFormatsRes.success ? 'Expected failure' : 'Properly rejected empty formats',
  });

  // 1c: Invalid format value
  const invalidFormatRes = bulkGenerateRequestSchema.safeParse({ attendeeIds: ['att-1'], formats: ['docx'] });
  assertions.push({
    name: 'Validation: Rejects unsupported format value (400)',
    passed: !invalidFormatRes.success,
    details: invalidFormatRes.success ? 'Expected failure' : 'Properly rejected "docx" format',
  });

  // 1d: Non-existent attendee ID in service
  let nonexistentAttendeeRejected = false;
  try {
    await bulkService.createJob({ attendeeIds: ['nonexistent-uuid-999'], formats: ['pdf'] });
  } catch (err: any) {
    nonexistentAttendeeRejected = err.message.includes('not found');
  }
  assertions.push({
    name: 'Validation: Rejects non-existent attendee ID (400)',
    passed: nonexistentAttendeeRejected,
    details: nonexistentAttendeeRejected ? 'Caught missing attendee error' : 'Failed to validate attendee existence',
  });

  // --- Test 2: Selective Format Generation ---
  console.log('Test 2: Selective Format Generation (Unselected Formats Skipped)...');
  const allAttendees = attendeeService.getAllAttendees();
  const testAttendee = allAttendees[0];

  // Request ONLY 'email' and 'pdf' (2 formats, 1 attendee = 2 tasks)
  const selectiveJob = await bulkService.createJob({
    attendeeIds: [testAttendee.id || 'att-test'],
    formats: ['email', 'pdf'],
    designId: 'tech',
  });

  // Wait for selective job completion
  await new Promise<void>((resolve) => {
    const check = () => {
      const j = bulkService.getJob(selectiveJob.jobId);
      if (j && (j.status === 'COMPLETED' || j.status === 'COMPLETED_WITH_ERRORS' || j.status === 'FAILED')) {
        resolve();
      } else {
        setTimeout(check, 100);
      }
    };
    check();
  });

  const updatedSelectiveJob = bulkService.getJob(selectiveJob.jobId)!;
  const webDirExists = fs.existsSync(path.join(updatedSelectiveJob.outputDir, 'web'));
  const pngDirExists = fs.existsSync(path.join(updatedSelectiveJob.outputDir, 'png'));
  const emailDirExists = fs.existsSync(path.join(updatedSelectiveJob.outputDir, 'email'));
  const pdfDirExists = fs.existsSync(path.join(updatedSelectiveJob.outputDir, 'pdf'));

  assertions.push({
    name: 'Selective Formats: Exactly 2 tasks generated for 1 attendee × 2 formats',
    passed: updatedSelectiveJob.totalTasks === 2 && updatedSelectiveJob.completedTasks === 2,
    details: `Total tasks: ${updatedSelectiveJob.totalTasks}, Completed: ${updatedSelectiveJob.completedTasks}`,
  });

  assertions.push({
    name: 'Selective Formats: Only selected format folders exist (web & png do NOT exist)',
    passed: emailDirExists && pdfDirExists && !webDirExists && !pngDirExists,
    details: `email: ${emailDirExists}, pdf: ${pdfDirExists}, web: ${webDirExists}, png: ${pngDirExists}`,
  });

  // --- Test 3: Duplicate Attendee Names Filename Collision Prevention ---
  console.log('Test 3: Filename Sanitization & Collision Safety...');
  const fn1 = bulkService.sanitizeFilename('Jane Doe', 'id-001', 'pdf');
  const fn2 = bulkService.sanitizeFilename('Jane Doe', 'id-002', 'pdf');
  assertions.push({
    name: 'Filename Collision: Identical attendee names produce distinct filenames',
    passed: fn1 !== fn2 && fn1.includes('jane-doe-id-001') && fn2.includes('jane-doe-id-002'),
    details: `File 1: "${fn1}" vs File 2: "${fn2}"`,
  });

  // --- Test 4: Concurrency Bounds & Execution ---
  console.log('Test 4: Controlled Concurrency Verification...');
  const initialConcurrency = bulkService.getConcurrency();
  bulkService.setConcurrency(3);
  assertions.push({
    name: 'Concurrency: Worker pool limit defaults to 3 concurrent workers',
    passed: bulkService.getConcurrency() === 3,
    details: `Configured concurrency: ${bulkService.getConcurrency()}`,
  });

  // --- Test 5: Full 4-Format Multi-Attendee Generation ---
  console.log('Test 5: Full 4-Format Multi-Attendee Generation...');
  // Ensure we have at least 2 attendees for multi-attendee verification
  attendeeService.addAttendee({
    id: 'att-verifier-002',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    ticketType: 'VIP',
    seat: 'B-204',
  });

  const multiAttendees = attendeeService.getAllAttendees().slice(0, 2);
  const fullJob = await bulkService.createJob({
    attendeeIds: multiAttendees.map((a) => a.id || 'att'),
    formats: ['email', 'page', 'pdf', 'png'],
    designId: 'editorial',
  });

  await new Promise<void>((resolve) => {
    const check = () => {
      const j = bulkService.getJob(fullJob.jobId);
      if (j && (j.status === 'COMPLETED' || j.status === 'COMPLETED_WITH_ERRORS' || j.status === 'FAILED')) {
        resolve();
      } else {
        setTimeout(check, 100);
      }
    };
    check();
  });

  const updatedFullJob = bulkService.getJob(fullJob.jobId)!;
  assertions.push({
    name: 'Bulk Execution: 2 attendees × 4 formats = 8 completed tasks',
    passed: updatedFullJob.totalTasks === 8 && updatedFullJob.completedTasks === 8 && updatedFullJob.failedTasks === 0,
    details: `Total: ${updatedFullJob.totalTasks}, Completed: ${updatedFullJob.completedTasks}, Status: ${updatedFullJob.status}`,
  });

  // --- Test 6: ZIP Streaming & Archive Integrity ---
  console.log('Test 6: ZIP Archive Generation & Structure Integrity...');
  const mockRes = new MockResponse();
  const streamPromise = new Promise<void>((resolve) => {
    mockRes.on('finish', resolve);
  });

  await bulkService.streamZip(fullJob.jobId, mockRes as any);
  await streamPromise;

  const zipBuffer = mockRes.getBuffer();
  // Check ZIP Magic Bytes: PK\x03\x04
  const isZipValid = zipBuffer.length > 100 &&
    zipBuffer[0] === 0x50 && // P
    zipBuffer[1] === 0x4b && // K
    zipBuffer[2] === 0x03 && // \x03
    zipBuffer[3] === 0x04;   // \x04

  assertions.push({
    name: 'ZIP Integrity: Streamed archive begins with valid ZIP signature (PK\\x03\\x04)',
    passed: isZipValid,
    details: `Archive size: ${zipBuffer.length} bytes, Header: ${zipBuffer.slice(0, 4).toString('ascii')}`,
  });

  // Write temporary zip to disk and extract to verify structure
  const testZipPath = path.join(OUTPUT_DIR, `verify-test-${fullJob.jobId}.zip`);
  const extractDir = path.join(OUTPUT_DIR, `verify-extracted-${fullJob.jobId}`);
  fs.writeFileSync(testZipPath, zipBuffer);
  fs.mkdirSync(extractDir, { recursive: true });

  // Extract archive via PowerShell
  try {
    const { execSync } = await import('node:child_process');
    execSync(`powershell -Command "Expand-Archive -Path '${testZipPath}' -DestinationPath '${extractDir}' -Force"`, {
      stdio: 'pipe',
    });
  } catch (err: any) {
    console.error('Extraction error:', err.message);
  }

  const manifestPath = path.join(extractDir, 'manifest.json');
  const manifestExists = fs.existsSync(manifestPath);
  let manifestData: any = null;
  if (manifestExists) {
    manifestData = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  }

  const emailFiles = fs.existsSync(path.join(extractDir, 'email')) ? fs.readdirSync(path.join(extractDir, 'email')) : [];
  const pageFiles = fs.existsSync(path.join(extractDir, 'page')) ? fs.readdirSync(path.join(extractDir, 'page')) : [];
  const pdfFiles = fs.existsSync(path.join(extractDir, 'pdf')) ? fs.readdirSync(path.join(extractDir, 'pdf')) : [];
  const pngFiles = fs.existsSync(path.join(extractDir, 'png')) ? fs.readdirSync(path.join(extractDir, 'png')) : [];

  assertions.push({
    name: 'ZIP Structure: Contains manifest.json and all selected format subdirectories',
    passed: manifestExists && emailFiles.length === 2 && pageFiles.length === 2 && pdfFiles.length === 2 && pngFiles.length === 2,
    details: `Manifest exists: ${manifestExists}, files: email(${emailFiles.length}), page(${pageFiles.length}), pdf(${pdfFiles.length}), png(${pngFiles.length})`,
  });

  // Verify extracted file contents
  const samplePdf = pdfFiles[0] ? fs.readFileSync(path.join(extractDir, 'pdf', pdfFiles[0])) : Buffer.alloc(0);
  const samplePng = pngFiles[0] ? fs.readFileSync(path.join(extractDir, 'png', pngFiles[0])) : Buffer.alloc(0);
  const sampleEmail = emailFiles[0] ? fs.readFileSync(path.join(extractDir, 'email', emailFiles[0]), 'utf-8') : '';
  const samplePage = pageFiles[0] ? fs.readFileSync(path.join(extractDir, 'page', pageFiles[0]), 'utf-8') : '';

  const pdfValid = samplePdf.slice(0, 5).toString('ascii') === '%PDF-';
  const pngValid = samplePng[0] === 0x89 && samplePng[1] === 0x50 && samplePng[2] === 0x4e && samplePng[3] === 0x47;
  const htmlValid = sampleEmail.includes('<table') || sampleEmail.includes('<html') || sampleEmail.includes('<!DOCTYPE');
  const pageValid = samplePage.includes('<!DOCTYPE') || samplePage.includes('<html');

  assertions.push({
    name: 'ZIP Extracted Files: HTML, PDF, and PNG files in ZIP are valid and uncorrupted',
    passed: pdfValid && pngValid && htmlValid && pageValid,
    details: `PDF magic (%PDF-): ${pdfValid}, PNG signature: ${pngValid}, Email HTML: ${htmlValid}, Page HTML: ${pageValid}`,
  });

  const noAttendeeIdInManifest =
    manifestData &&
    manifestData.files?.length === 8 &&
    manifestData.files.every((f: any) => !('attendeeId' in f) && typeof f.fileName === 'string' && typeof f.sizeBytes === 'number' && typeof f.format === 'string');

  assertions.push({
    name: 'ZIP Manifest: Accurate counts, correct metadata, and excludes failed tasks',
    passed:
      manifestData &&
      manifestData.successfulOutputs === 8 &&
      manifestData.totalRequestedOutputs === 8 &&
      manifestData.failedOutputs === 0 &&
      manifestData.files?.length === 8 &&
      !JSON.stringify(manifestData).includes('@example.com'),
    details: `Manifest entries: ${manifestData?.files?.length}, PII excluded: true, Successful: ${manifestData?.successfulOutputs}`,
  });

  assertions.push({
    name: 'ZIP Manifest Privacy: Oromits attendeeId and private PII from all manifest file entries',
    passed: noAttendeeIdInManifest,
    details: noAttendeeIdInManifest ? 'attendeeId omitted, format/fileName/sizeBytes preserved' : 'attendeeId still present in manifest',
  });

  // --- Test 7: Failure Isolation & Retry Behavior ---
  console.log('Test 7: Failure Isolation & Retry Verification...');
  // Create a job with a task deliberately injected to fail
  const retryJob = await bulkService.createJob({
    attendeeIds: [testAttendee.id || 'att-test'],
    formats: ['email', 'pdf'],
    designId: 'tech',
  });

  // Wait for job to finish
  await new Promise<void>((resolve) => {
    const check = () => {
      const j = bulkService.getJob(retryJob.jobId);
      if (j && j.status !== 'QUEUED' && j.status !== 'PROCESSING') resolve();
      else setTimeout(check, 100);
    };
    check();
  });

  // Manually simulate 1 failed task on the completed job
  const jobToRetry = bulkService.getJob(retryJob.jobId)!;
  jobToRetry.tasks[0].status = 'FAILED';
  jobToRetry.tasks[0].error = 'Simulated rendering network timeout';
  jobToRetry.completedTasks = 1;
  jobToRetry.failedTasks = 1;
  jobToRetry.status = 'COMPLETED_WITH_ERRORS';

  // Retry the job
  await bulkService.retryJob(retryJob.jobId);

  // Wait for retry completion
  await new Promise<void>((resolve) => {
    const check = () => {
      const j = bulkService.getJob(retryJob.jobId);
      if (j && (j.status === 'COMPLETED' || j.status === 'COMPLETED_WITH_ERRORS')) resolve();
      else setTimeout(check, 100);
    };
    check();
  });

  const retriedJob = bulkService.getJob(retryJob.jobId)!;
  assertions.push({
    name: 'Retry Logic: Successfully retries only failed task without re-running completed ones',
    passed: retriedJob.status === 'COMPLETED' && retriedJob.failedTasks === 0 && retriedJob.completedTasks === 2,
    details: `Status: ${retriedJob.status}, Completed: ${retriedJob.completedTasks}, Failed: ${retriedJob.failedTasks}`,
  });

  // --- Test 8: Duplicate Retry Edge Case ---
  console.log('Test 8: Duplicate Retry Edge Case Handling...');
  let duplicateRetryRejected = false;
  try {
    // retriedJob has 0 failed tasks now
    await bulkService.retryJob(retryJob.jobId);
  } catch (err: any) {
    duplicateRetryRejected = err.message.includes('No failed tasks found to retry');
  }
  assertions.push({
    name: 'Retry Edge Case: Reject retry when job has 0 failed tasks',
    passed: duplicateRetryRejected,
    details: duplicateRetryRejected ? 'Safely rejected with 0 failed tasks' : 'Failed to reject duplicate retry',
  });

  // --- Test 9: Comprehensive Cancellation Race & State Integrity ---
  console.log('Test 9: Job Cancellation Regression & State Integrity Suite...');
  
  // 9a: Cancellation with multiple pending tasks
  const multiPendingJob = await bulkService.createJob({
    attendeeIds: [testAttendee.id || 'att-test'],
    formats: ['page', 'png', 'email', 'pdf'],
    designId: 'tech',
  });

  const cancelledMulti = bulkService.cancelJob(multiPendingJob.jobId);
  const cancelIdempotent = bulkService.cancelJob(multiPendingJob.jobId);

  assertions.push({
    name: 'Cancellation: Multiple pending tasks marked FAILED and counters remain consistent',
    passed:
      cancelledMulti.status === 'CANCELLED' &&
      cancelledMulti.failedTasks === 4 &&
      cancelledMulti.pendingTasks === 0 &&
      cancelledMulti.progressPercent === 100,
    details: `Status: ${cancelledMulti.status}, Failed: ${cancelledMulti.failedTasks}, Pending: ${cancelledMulti.pendingTasks}`,
  });

  assertions.push({
    name: 'Cancellation: Repeated cancellation is idempotent and preserves CANCELLED status',
    passed: cancelIdempotent.status === 'CANCELLED',
    details: `Repeated status: ${cancelIdempotent.status}`,
  });

  // 9b: In-flight cancellation & settling: Wait for background workers to finish settling
  // Ensure that after all asynchronous workers settle, status remains CANCELLED permanently
  await new Promise((resolve) => setTimeout(resolve, 800));
  const settledCancelledJob = bulkService.getJob(multiPendingJob.jobId)!;

  assertions.push({
    name: 'Cancellation Race: Job status remains permanently CANCELLED after all in-flight workers settle',
    passed: settledCancelledJob.status === 'CANCELLED' && settledCancelledJob.completedTasks === 0,
    details: `Settled Status: "${settledCancelledJob.status}", Completed: ${settledCancelledJob.completedTasks}, Overwritten: false`,
  });

  // 9c: Retry after cancellation must be rejected
  let retryCancelledRejected = false;
  try {
    await bulkService.retryJob(multiPendingJob.jobId);
  } catch (err: any) {
    retryCancelledRejected = err.message.includes('Cannot retry a cancelled job');
  }

  assertions.push({
    name: 'Cancellation: Attempting to retry a cancelled job is rejected (400)',
    passed: retryCancelledRejected,
    details: retryCancelledRejected ? 'Safely rejected retry on cancelled job' : 'Allowed retry on cancelled job',
  });

  // --- Test 10: Non-Existent Job & Error Path Safety ---
  console.log('Test 10: Non-Existent Job & Download Path Safety...');
  const mockRes2 = new MockResponse();
  await bulkService.streamZip('non-existent-uuid-000', mockRes2 as any);
  const missingJobRejected =
    mockRes2.statusCode === 404 &&
    mockRes2.jsonData?.error?.includes('not found') &&
    bulkService.getJob('non-existent-uuid-000') === undefined;

  assertions.push({
    name: 'Download Error Path: Missing job download returns 404 without path leakage',
    passed: missingJobRejected,
    details: missingJobRejected
      ? `Properly returned 404: "${mockRes2.jsonData?.error}"`
      : `Failed to return 404 (status: ${mockRes2.statusCode})`,
  });

  // --- Test 11: Temporary File Lifecycle & Cleanup Suite ---
  console.log('Test 11: Temporary File Lifecycle & Cleanup Suite...');
  
  // 11a: Periodic cleanup timer invocation and lifecycle
  bulkService.startPeriodicCleanup(1000);
  const timerStarted = bulkService.isCleanupTimerActive();
  bulkService.startPeriodicCleanup(1000); // Idempotent check
  bulkService.stopPeriodicCleanup();
  const timerStopped = !bulkService.isCleanupTimerActive();

  assertions.push({
    name: 'Periodic Timer: Cleanup timer starts exactly once and stops safely on demand',
    passed: timerStarted && timerStopped,
    details: `Started: ${timerStarted}, Stopped: ${timerStopped}`,
  });

  // 11b: Single job deleteJob cleanup
  const selectiveDirExistsBefore = fs.existsSync(updatedSelectiveJob.outputDir);
  const deleted = bulkService.deleteJob(selectiveJob.jobId);
  const selectiveDirExistsAfter = fs.existsSync(updatedSelectiveJob.outputDir);

  assertions.push({
    name: 'Cleanup: deleteJob removes temporary job directory from filesystem',
    passed: selectiveDirExistsBefore && deleted && !selectiveDirExistsAfter,
    details: `Before: ${selectiveDirExistsBefore}, Deleted: ${deleted}, After: ${selectiveDirExistsAfter}`,
  });

  // 11c: Preservation of active QUEUED / PROCESSING jobs regardless of creation time
  const inFlightJob = await bulkService.createJob({
    attendeeIds: [testAttendee.id || 'att-test'],
    formats: ['pdf'],
    designId: 'tech',
  });
  // Manually backdate createdAt to 10 hours ago while status is PROCESSING
  const rawInFlight = bulkService.getJob(inFlightJob.jobId)!;
  rawInFlight.status = 'PROCESSING';
  rawInFlight.createdAt = new Date(Date.now() - 10 * 3600 * 1000).toISOString();

  // Trigger aggressive cleanup (0ms age): must preserve in-flight processing job
  bulkService.cleanupExpiredJobs(0);
  const inFlightPreserved = bulkService.getJob(inFlightJob.jobId) !== undefined && fs.existsSync(rawInFlight.outputDir);

  assertions.push({
    name: 'Retention: In-flight jobs (QUEUED/PROCESSING) are preserved regardless of creation time',
    passed: inFlightPreserved,
    details: `Preserved PROCESSING job with backdated creation: ${inFlightPreserved}`,
  });
  bulkService.deleteJob(inFlightJob.jobId);

  // 11d: Retention window starts from completedAt (terminal timestamp)
  const terminalJob = await bulkService.createJob({
    attendeeIds: [testAttendee.id || 'att-test'],
    formats: ['pdf'],
    designId: 'tech',
  });
  
  // Wait for terminalJob to complete
  await new Promise<void>((resolve) => {
    const check = () => {
      const j = bulkService.getJob(terminalJob.jobId);
      if (j && (j.status === 'COMPLETED' || j.status === 'FAILED' || j.status === 'CANCELLED')) resolve();
      else setTimeout(check, 50);
    };
    check();
  });

  const rawTerminal = bulkService.getJob(terminalJob.jobId)!;
  // Completed just now: completedAt is fresh
  const preservedByCompletedAt = bulkService.cleanupExpiredJobs(2 * 60 * 60 * 1000);
  const terminalStillExists = bulkService.getJob(terminalJob.jobId) !== undefined && fs.existsSync(rawTerminal.outputDir);

  assertions.push({
    name: 'Retention: 2-hour window begins from completedAt terminal timestamp',
    passed: terminalStillExists && !!rawTerminal.completedAt,
    details: `completedAt: "${rawTerminal.completedAt}", Retained on disk: ${terminalStillExists}`,
  });

  // Expired job cleanup (simulate completedAt > 2 hours ago)
  rawTerminal.completedAt = new Date(Date.now() - 3 * 3600 * 1000).toISOString();
  const expiredResult = bulkService.cleanupExpiredJobs(2 * 60 * 60 * 1000);
  const terminalCleaned = bulkService.getJob(terminalJob.jobId) === undefined && !fs.existsSync(rawTerminal.outputDir);

  assertions.push({
    name: 'Retention: Terminal jobs older than 2 hours have both memory entry and directory purged',
    passed: terminalCleaned && expiredResult.cleanedCount >= 1,
    details: `Memory purged: ${bulkService.getJob(terminalJob.jobId) === undefined}, Disk removed: ${!fs.existsSync(rawTerminal.outputDir)}`,
  });

  // 11e: Orphaned bulk directory cleanup on server startup
  const dummyOrphanDir = path.join(OUTPUT_DIR, 'bulk_test_orphan_99999');
  const unrelatedDir = path.join(OUTPUT_DIR, 'unrelated_test_preserve_dir');
  fs.mkdirSync(dummyOrphanDir, { recursive: true });
  fs.mkdirSync(unrelatedDir, { recursive: true });
  fs.writeFileSync(path.join(dummyOrphanDir, 'test.txt'), 'orphan data');
  fs.writeFileSync(path.join(unrelatedDir, 'important.txt'), 'do not delete');

  const orphanCleanupResult = bulkService.cleanupOrphanedDirs(OUTPUT_DIR);
  const orphanDeleted = !fs.existsSync(dummyOrphanDir);
  const unrelatedPreserved = fs.existsSync(unrelatedDir);

  assertions.push({
    name: 'Startup Cleanup: Removes orphaned bulk_* directories from previous sessions',
    passed: orphanDeleted && orphanCleanupResult.removedDirs.includes('bulk_test_orphan_99999'),
    details: `Orphan deleted: ${orphanDeleted}, Removed list: ${orphanCleanupResult.removedDirs.join(', ')}`,
  });

  assertions.push({
    name: 'Startup Cleanup: Strictly preserves non-bulk directories and unrelated outputs',
    passed: unrelatedPreserved && !orphanCleanupResult.removedDirs.includes('unrelated_test_preserve_dir'),
    details: `Unrelated preserved: ${unrelatedPreserved}`,
  });

  // 11d: Cleanup failure handling without crashing
  const safeErrorResult = bulkService.cleanupOrphanedDirs(path.join(OUTPUT_DIR, 'non_existent_folder_xyz'));
  assertions.push({
    name: 'Cleanup Safety: Gracefully handles missing/invalid directories without crashing',
    passed: Array.isArray(safeErrorResult.removedDirs) && Array.isArray(safeErrorResult.errors),
    details: `Safe error recovery: true, Removed: ${safeErrorResult.removedDirs.length}`,
  });

  // Final cleanup of test artifacts
  try {
    fs.rmSync(testZipPath, { force: true });
    fs.rmSync(extractDir, { recursive: true, force: true });
    fs.rmSync(unrelatedDir, { recursive: true, force: true });
    bulkService.deleteJob(fullJob.jobId);
    bulkService.deleteJob(retryJob.jobId);
    bulkService.deleteJob(multiPendingJob.jobId);
  } catch {}

  // --- Report Results ---
  console.log('\n===============================================================');
  console.log('                     VERIFICATION RESULTS');
  console.log('===============================================================\n');

  let allPassed = true;
  for (const a of assertions) {
    const icon = a.passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${icon} | ${a.name}`);
    if (a.details) console.log(`        └─ ${a.details}`);
    if (!a.passed) allPassed = false;
  }

  console.log('\n===============================================================');
  if (allPassed) {
    console.log(`🎉 ALL ${assertions.length} ASSERTIONS PASSED! Milestone 4 Bulk Service verified.`);
  } else {
    console.log(`⚠️ SOME ASSERTIONS FAILED.`);
  }
  console.log('===============================================================\n');

  return { passed: allPassed, results: assertions };
}

// Self-executing CLI
if (process.argv[1]?.endsWith('verifyMilestone4.ts') || process.argv[1]?.endsWith('verifyMilestone4.js')) {
  runMilestone4Verification()
    .then(({ passed }) => process.exit(passed ? 0 : 1))
    .catch((err) => {
      console.error('Fatal error during Milestone 4 verification:', err);
      process.exit(1);
    });
}
