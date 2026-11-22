import { useState, useEffect } from 'react';
import { EventInfo } from '@passforge/shared';
import { fetchCurrentEvent, saveEvent } from '../services/api.js';

export function useEvent() {
  const [event, setEvent] = useState<EventInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadEvent = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCurrentEvent();
      setEvent(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch event');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvent();
  }, []);

  const updateEventData = async (data: Partial<EventInfo>) => {
    const updated = await saveEvent(data);
    setEvent(updated);
    return updated;
  };

  return {
    event,
    loading,
    error,
    refreshEvent: loadEvent,
    updateEvent: updateEventData,
  };
}
