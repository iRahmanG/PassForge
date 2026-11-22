import QRCode from 'qrcode';
import { TicketData, AttendeeInfo, EventInfo } from '../types/ticket.js';

export const SAMPLE_EVENT: EventInfo = {
  name: 'KIET TechFest 2027',
  date: '15 February 2027',
  time: '09:00 AM - 06:00 PM IST',
  venue: 'KIET Group of Institutions',
  location: 'Delhi-NCR, Ghaziabad, Uttar Pradesh 201206',
  organizer: 'KIET Technical Team',
  tagline: 'Annual Flagship Technology & Innovation Summit',
  website: 'https://kiet.edu/techfest2027',
};

export const SAMPLE_ATTENDEE: AttendeeInfo = {
  name: 'Maksud Rahman',
  email: 'maksud@example.com',
  ticketType: 'VIP',
  seat: 'A-104',
};

export async function createTicketData(
  attendeeOverrides?: Partial<AttendeeInfo>,
  ticketId = 'KTF27-VIP-84920'
): Promise<TicketData> {
  const attendee: AttendeeInfo = {
    ...SAMPLE_ATTENDEE,
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
    event: SAMPLE_EVENT,
    attendee,
    qrCodeDataUrl,
    qrBuffer,
    ticketUrl,
    issuedAt: '2026-11-22T18:00:00Z',
  };
}
