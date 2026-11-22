import { Request, Response } from 'express';
import { eventService } from './event.service.js';
import { ZodError } from 'zod';

export class EventController {
  getCurrentEvent(_req: Request, res: Response) {
    try {
      const event = eventService.getCurrentEvent();
      res.json({ success: true, event });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  updateEvent(req: Request, res: Response) {
    try {
      const updated = eventService.updateEvent(req.body);
      res.json({ success: true, event: updated });
    } catch (err: any) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          issues: err.issues,
        });
      }
      res.status(400).json({ success: false, error: err.message });
    }
  }
}

export const eventController = new EventController();
