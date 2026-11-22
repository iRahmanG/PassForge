import { z } from 'zod';

export const eventSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Event name must be at least 2 characters').max(120, 'Event name too long').trim(),
  date: z.string().min(1, 'Event date is required').trim(),
  time: z.string().min(1, 'Event time is required').trim(),
  venue: z.string().min(2, 'Venue is required').max(200).trim(),
  location: z.string().min(2, 'Location is required').max(200).trim(),
  organizer: z.string().min(2, 'Organizer name is required').max(100).trim(),
  tagline: z.string().max(200).default('').optional(),
  website: z.string().url('Invalid website URL').or(z.literal('')).optional().default(''),
});

export type EventInput = z.infer<typeof eventSchema>;
