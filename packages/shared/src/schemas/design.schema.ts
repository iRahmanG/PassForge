import { z } from 'zod';
import { attendeeSchema } from './attendee.schema.js';

export const ticketDesignIdSchema = z.enum(['tech', 'editorial']);

export const brandingConfigSchema = z.object({
  accentColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Accent color must be a valid hex code (e.g. #06b6d4)')
    .default('#06b6d4'),
  logoUrl: z.string().optional(),
  showOrganizer: z.boolean().default(true).optional(),
  customNotes: z.string().max(300).optional(),
});

export const designConfigSchema = z.object({
  designId: ticketDesignIdSchema.default('tech'),
  branding: brandingConfigSchema.default({
    accentColor: '#06b6d4',
  }),
  updatedAt: z.string().optional(),
});

export const ticketPreviewRequestSchema = z.object({
  attendeeId: z.string().optional(),
  attendee: attendeeSchema.optional(),
  designId: ticketDesignIdSchema.default('tech'),
  branding: brandingConfigSchema.partial().optional(),
  format: z.enum(['email', 'page', 'pdf', 'png', 'all']).default('all'),
});

export type BrandingConfigInput = z.infer<typeof brandingConfigSchema>;
export type DesignConfigInput = z.infer<typeof designConfigSchema>;
export type TicketPreviewRequestInput = z.infer<typeof ticketPreviewRequestSchema>;
