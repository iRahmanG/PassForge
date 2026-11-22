import { z } from 'zod';

export const attendeeSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Attendee name is required').max(120, 'Name is too long').trim(),
  email: z.string().min(1, 'Email is required').email('Invalid email address format').trim().toLowerCase(),
  ticketType: z.string().min(1, 'Ticket category is required').max(50).trim(),
  seat: z.string().max(30).trim().default('Unassigned'),
  avatarUrl: z.string().url('Invalid avatar URL').optional().or(z.literal('')),
});

export const csvColumnMappingSchema = z.object({
  name: z.string().min(1, 'Name column mapping is required'),
  email: z.string().min(1, 'Email column mapping is required'),
  ticketType: z.string().min(1, 'Ticket type column mapping is required'),
  seat: z.string().optional().default(''),
});

export const csvImportOptionsSchema = z.object({
  mapping: csvColumnMappingSchema.optional(),
  defaultTicketType: z.string().default('General'),
  defaultSeat: z.string().default('General Admission'),
});

export type AttendeeInput = z.infer<typeof attendeeSchema>;
export type CsvColumnMappingInput = z.infer<typeof csvColumnMappingSchema>;
