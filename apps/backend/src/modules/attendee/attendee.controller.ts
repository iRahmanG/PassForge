import { Request, Response } from 'express';
import { attendeeService } from './attendee.service.js';
import { CsvColumnMapping } from '@passforge/shared';

export class AttendeeController {
  getAllAttendees(req: Request, res: Response) {
    try {
      const search = typeof req.query.search === 'string' ? req.query.search : undefined;
      const ticketType = typeof req.query.ticketType === 'string' ? req.query.ticketType : undefined;

      const attendees = attendeeService.getAllAttendees(search, ticketType);
      res.json({
        success: true,
        count: attendees.length,
        attendees,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  importCsv(req: Request, res: Response) {
    try {
      let csvContent = '';

      // Check multipart file upload first
      if (req.file) {
        csvContent = req.file.buffer.toString('utf-8');
      } else if (req.body && typeof req.body.csv === 'string') {
        csvContent = req.body.csv;
      } else if (req.body && typeof req.body.csvText === 'string') {
        csvContent = req.body.csvText;
      } else {
        return res.status(400).json({
          success: false,
          error: 'No CSV file or CSV text provided. Upload a file as "file" or provide "csv" string in body.',
        });
      }

      // Check optional mapping
      let mapping: Partial<CsvColumnMapping> | undefined;
      if (req.body.mapping) {
        try {
          mapping = typeof req.body.mapping === 'string' ? JSON.parse(req.body.mapping) : req.body.mapping;
        } catch {
          // ignore mapping parse error and fall back to auto-detection
        }
      }

      const result = attendeeService.importAttendeesFromCsv(csvContent, mapping);
      return res.json({
        success: true,
        result,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  resetAttendees(_req: Request, res: Response) {
    try {
      attendeeService.resetToDefault();
      res.json({ success: true, message: 'Attendees reset to initial state' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

export const attendeeController = new AttendeeController();
