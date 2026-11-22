import { EventInfo } from './event.js';
import { AttendeeInfo } from './attendee.js';

export interface TicketData {
  ticketId: string;
  event: EventInfo;
  attendee: AttendeeInfo;
  qrCodeDataUrl: string;
  qrBuffer?: Buffer | Uint8Array;
  ticketUrl: string;
  issuedAt: string;
}

export type OutputFormat = 'email' | 'page' | 'pdf' | 'png';

export interface RenderResult {
  format: OutputFormat;
  success: boolean;
  outputPath?: string;
  contentType: string;
  sizeBytes: number;
  renderTimeMs: number;
  previewUrl?: string;
  diagnostics?: any[];
  error?: string;
}
