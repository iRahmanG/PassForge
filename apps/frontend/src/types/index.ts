export * from '@passforge/shared';

export type ActiveTab = 'event' | 'import' | 'attendees' | 'tickets';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}
