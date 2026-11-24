import { EventInfo, eventSchema } from '@passforge/shared';
import { INITIAL_EVENT, DEMO_EVENT } from '../../config/sampleData.js';

export class EventService {
  private currentEvent: EventInfo = { ...INITIAL_EVENT };

  getCurrentEvent(): EventInfo {
    return { ...this.currentEvent };
  }

  updateEvent(data: Partial<EventInfo>): EventInfo {
    const validated = eventSchema.parse({
      ...this.currentEvent,
      ...data,
      id: this.currentEvent.id || 'evt-' + Date.now(),
    });

    this.currentEvent = {
      ...validated,
      updatedAt: new Date().toISOString(),
    };

    return { ...this.currentEvent };
  }

  loadDemoEvent(): EventInfo {
    this.currentEvent = { ...DEMO_EVENT };
    return { ...this.currentEvent };
  }

  resetToDefault(): EventInfo {
    this.currentEvent = { ...INITIAL_EVENT };
    return { ...this.currentEvent };
  }
}

export const eventService = new EventService();
