import { useState, useEffect } from 'react';
import { AttendeeInfo, CsvImportResult, CsvColumnMapping } from '@passforge/shared';
import {
  fetchAttendees,
  importAttendeesCsv,
  importAttendeesCsvText,
  resetAttendees,
} from '../services/api.js';

export function useAttendees() {
  const [attendees, setAttendees] = useState<AttendeeInfo[]>([]);
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadAttendees = async (search?: string, ticketType?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAttendees(search, ticketType);
      setAttendees(data.attendees);
      setCount(data.count);
    } catch (err: any) {
      setError(err.message || 'Failed to load attendees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendees();
  }, []);

  const importFile = async (
    file: File,
    mapping?: Partial<CsvColumnMapping>
  ): Promise<CsvImportResult> => {
    const result = await importAttendeesCsv(file, mapping);
    await loadAttendees();
    return result;
  };

  const importText = async (
    csvText: string,
    mapping?: Partial<CsvColumnMapping>
  ): Promise<CsvImportResult> => {
    const result = await importAttendeesCsvText(csvText, mapping);
    await loadAttendees();
    return result;
  };

  const reset = async () => {
    await resetAttendees();
    await loadAttendees();
  };

  return {
    attendees,
    count,
    loading,
    error,
    refreshAttendees: loadAttendees,
    importFile,
    importText,
    resetAttendees: reset,
  };
}
