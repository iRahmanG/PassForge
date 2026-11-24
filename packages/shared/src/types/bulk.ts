import { OutputFormat } from './ticket.js';
import { TicketDesignId, BrandingConfig } from './design.js';

export type BulkTaskStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export type BulkJobStatus =
  | 'QUEUED'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'COMPLETED_WITH_ERRORS'
  | 'FAILED'
  | 'CANCELLED';

export interface BulkTask {
  taskId: string;
  jobId: string;
  attendeeId: string;
  attendeeName: string;
  format: OutputFormat;
  status: BulkTaskStatus;
  error?: string;
  outputPath?: string;
  fileName?: string;
  sizeBytes?: number;
  durationMs?: number;
}

export interface BulkJob {
  jobId: string;
  status: BulkJobStatus;
  designId: TicketDesignId;
  branding?: BrandingConfig;
  attendeeIds: string[];
  formats: OutputFormat[];
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  pendingTasks: number;
  progressPercent: number;
  createdAt: string;
  completedAt?: string;
  tasks: BulkTask[];
  outputDir: string;
  zipPath?: string;
  zipSizeBytes?: number;
  error?: string;
}

export interface BulkGenerateRequest {
  attendeeIds: string[];
  formats: OutputFormat[];
  designId?: TicketDesignId;
}

export interface BulkGenerateResponse {
  success: boolean;
  jobId: string;
  status: BulkJobStatus;
  totalTasks: number;
  selectedAttendeeCount: number;
  selectedFormats: OutputFormat[];
  message: string;
}

export interface BulkJobProgressResponse {
  success: boolean;
  jobId: string;
  status: BulkJobStatus;
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  pendingTasks: number;
  progressPercent: number;
  createdAt: string;
  completedAt?: string;
  tasks: BulkTask[];
  failedTaskList?: BulkTask[];
  isTerminal: boolean;
}
