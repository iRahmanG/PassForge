export interface EventInfo {
  name: string;
  date: string;
  time: string;
  venue: string;
  location: string;
  organizer: string;
  tagline: string;
  website: string;
}

export interface AttendeeInfo {
  name: string;
  email: string;
  ticketType: 'VIP' | 'General' | 'Speaker' | 'Student' | string;
  seat: string;
  avatarUrl?: string;
}

export interface TicketData {
  ticketId: string;
  event: EventInfo;
  attendee: AttendeeInfo;
  qrCodeDataUrl: string;
  qrBuffer: Buffer;
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
