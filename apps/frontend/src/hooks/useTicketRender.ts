import { useState, useEffect } from 'react';
import { TicketData, RenderResult, OutputFormat } from '@passforge/shared';
import { fetchTicketData, generateTicket, testLongName } from '../services/api.js';

export function useTicketRender() {
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [results, setResults] = useState<Record<OutputFormat, RenderResult> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadTicketData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTicketData();
      setTicket(data.ticket);
      setResults(data.results);
    } catch (err: any) {
      setError(err.message || 'Failed to load ticket preview data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTicketData();
  }, []);

  const renderSingleFormat = async (format: OutputFormat, attendeeId?: string) => {
    setLoading(true);
    try {
      const res = await generateTicket(format, attendeeId);
      if (res.result) {
        setResults(prev => (prev ? { ...prev, [format]: res.result! } : null));
      }
      if (res.ticket) setTicket(res.ticket);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const renderAllFormats = async (attendeeId?: string) => {
    setLoading(true);
    try {
      const res = await generateTicket('all', attendeeId);
      if (res.results) setResults(res.results);
      if (res.ticket) setTicket(res.ticket);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const runLongNameTest = async () => {
    setLoading(true);
    try {
      const res = await testLongName();
      if (res.results) setResults(res.results);
      if (res.ticket) setTicket(res.ticket);
      return res;
    } finally {
      setLoading(false);
    }
  };

  return {
    ticket,
    results,
    loading,
    error,
    refreshTicket: loadTicketData,
    renderSingleFormat,
    renderAllFormats,
    runLongNameTest,
  };
}
