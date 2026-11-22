export interface AttendeeInfo {
  id?: string;
  name: string;
  email: string;
  ticketType: 'VIP' | 'General' | 'Speaker' | 'Student' | string;
  seat: string;
  avatarUrl?: string;
  importedAt?: string;
}

export interface CsvColumnMapping {
  name: string;
  email: string;
  ticketType: string;
  seat?: string;
}

export interface CsvRowError {
  row: number;
  field: string;
  message: string;
  rawData?: Record<string, string>;
}

export interface CsvImportResult {
  totalRows: number;
  validCount: number;
  invalidCount: number;
  skippedEmptyRows: number;
  importedAttendees: AttendeeInfo[];
  errors: CsvRowError[];
}
