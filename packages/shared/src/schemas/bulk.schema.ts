import { z } from 'zod';

export const supportedOutputFormats = ['email', 'page', 'pdf', 'png'] as const;

export const bulkGenerateRequestSchema = z.object({
  attendeeIds: z
    .array(z.string().min(1, 'Attendee ID cannot be empty'))
    .min(1, 'At least one attendee must be selected'),
  formats: z
    .array(z.enum(supportedOutputFormats))
    .min(1, 'At least one format must be selected'),
  designId: z.enum(['tech', 'editorial']).optional(),
});

export type BulkGenerateInput = z.infer<typeof bulkGenerateRequestSchema>;
