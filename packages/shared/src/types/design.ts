import { OutputFormat, TicketData } from './ticket.js';
import { AttendeeInfo } from './attendee.js';

export type TicketDesignId = 'tech' | 'editorial' | 'vintage' | 'festival';

export interface WatermarkConfig {
  enabled: boolean;
  opacity?: number; // Default 0.08 (8%)
  size?: number; // Default 40 (% of width)
  position?: 'center';
}

export interface FontOption {
  id: string;
  name: string;
  category: 'sans' | 'serif' | 'mono' | 'display';
  family: string;
  description: string;
}

export const FONT_OPTIONS: FontOption[] = [
  {
    id: 'sans-modern',
    name: 'Modern Sans',
    category: 'sans',
    family: 'Arial, sans-serif',
    description: 'Clean, neutral, and versatile. Ideal for tech summits and conferences.',
  },
  {
    id: 'serif-editorial',
    name: 'Editorial Serif',
    category: 'serif',
    family: 'Georgia, serif',
    description: 'Refined, literary, and formal. Perfect for galas, keynotes, and invitations.',
  },
  {
    id: 'mono-tech',
    name: 'Technical Mono',
    category: 'mono',
    family: '"Courier New", Courier, monospace',
    description: 'Code-inspired monospace styling. Great for hackathons and dev summits.',
  },
  {
    id: 'humanist-geometric',
    name: 'Geometric Humanist',
    category: 'sans',
    family: '"Trebuchet MS", sans-serif',
    description: 'Warm, open, and friendly curves. Great for workshops and design forums.',
  },
  {
    id: 'classic-roman',
    name: 'Classic Roman',
    category: 'serif',
    family: '"Times New Roman", Times, serif',
    description: 'Timeless traditional serif with distinguished gravitas.',
  },
];

export interface BrandingConfig {
  accentColor: string;
  fontFamily?: string;
  logoUrl?: string;
  logoBuffer?: Buffer | Uint8Array;
  showOrganizer?: boolean;
  customNotes?: string;
  watermark?: WatermarkConfig;
  watermarkUrl?: string;
}

export interface DesignMetadata {
  id: TicketDesignId;
  name: string;
  description: string;
  visualDirection: string;
  category: 'dark-tech' | 'light-editorial' | 'vintage-retro' | 'concert-festival';
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
