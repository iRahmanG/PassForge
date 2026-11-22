import QRCode from 'qrcode';
import { TicketData, AttendeeInfo, EventInfo } from '@passforge/shared';
import { eventService } from '../event/event.service.js';
import { attendeeService } from '../attendee/attendee.service.js';
import { INITIAL_EVENT, INITIAL_ATTENDEE } from '../../config/sampleData.js';

export class TicketService {
  /**
   * Generate TicketData for an attendee and the current event
   */
  async createTicketData(
    attendeeOverrides?: Partial<AttendeeInfo>,
    ticketId = 'KTF27-VIP-84920'
  ): Promise<TicketData> {
    const currentEvent = eventService.getCurrentEvent();
    const baseAttendee = attendeeService.getAllAttendees()[0] || INITIAL_ATTENDEE;

    const attendee: AttendeeInfo = {
      ...baseAttendee,
      ...attendeeOverrides,
    };

    const ticketUrl = `https://passforge.local/tickets/${ticketId}`;

    // Generate high quality QR code data URL and raw buffer
    const qrCodeDataUrl = await QRCode.toDataURL(ticketUrl, {
      width: 256,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    });

    const qrBuffer = await QRCode.toBuffer(ticketUrl, {
      width: 256,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    });

    return {
      ticketId,
      event: currentEvent,
      attendee,
      qrCodeDataUrl,
      qrBuffer,
      ticketUrl,
      issuedAt: new Date().toISOString(),
    };
  }

  /**
   * Generate TicketData specifically for an attendee by ID
   */
  async getTicketForAttendee(attendeeId: string): Promise<TicketData | null> {
    const attendee = attendeeService.getAttendeeById(attendeeId);
    if (!attendee) return null;

    const prefix = attendee.ticketType.substring(0, 3).toUpperCase();
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const ticketId = `KTF27-${prefix}-${randomSuffix}`;

    return this.createTicketData(attendee, ticketId);
  }
}

export const ticketService = new TicketService();
