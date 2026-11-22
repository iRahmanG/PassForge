import { OutputFormat, TicketData } from './ticket.js';
import { AttendeeInfo } from './attendee.js';

export type TicketDesignId = 'tech' | 'editorial';

export interface BrandingConfig {
  accentColor: string;
  logoUrl?: string;
  logoBuffer?: Buffer | Uint8Array;
  showOrganizer?: boolean;
  customNotes?: string;
}

export interface DesignMetadata {
  id: TicketDesignId;
  name: string;
  description: string;
  visualDirection: string;
  category: 'dark-tech' | 'light-editorial';
  defaultAccentColor: string;
  tags: string[];
}

export interface DesignConfig {
  designId: TicketDesignId;
  branding: BrandingConfig;
  updatedAt?: string;
}

export interface TicketPreviewRequest {
  attendeeId?: string;
  attendee?: AttendeeInfo;
  designId: TicketDesignId;
  branding?: Partial<BrandingConfig>;
  format: OutputFormat | 'all';
}

export interface TicketPreviewResponse {
  success: boolean;
  designId: TicketDesignId;
  branding: BrandingConfig;
  ticket: TicketData;
  results?: Partial<Record<OutputFormat, any>>;
  result?: any;
  error?: string;
}
