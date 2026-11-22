import { EventInfo, AttendeeInfo } from '@passforge/shared';

export const INITIAL_EVENT: EventInfo = {
  id: 'evt-kiet-2027',
  name: 'KIET TechFest 2027',
  date: '15 February 2027',
  time: '09:00 AM - 06:00 PM IST',
  venue: 'KIET Group of Institutions',
  location: 'Delhi-NCR, Ghaziabad, Uttar Pradesh 201206',
  organizer: 'KIET Technical Team',
  tagline: 'Annual Flagship Technology & Innovation Summit',
  website: 'https://kiet.edu/techfest2027',
  createdAt: new Date().toISOString(),
};

export const INITIAL_ATTENDEE: AttendeeInfo = {
  id: 'att-maksud-001',
  name: 'Maksud Rahman',
  email: 'maksud@example.com',
  ticketType: 'VIP',
  seat: 'A-104',
  importedAt: new Date().toISOString(),
};
