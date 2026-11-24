import Papa from 'papaparse';
import {
  AttendeeInfo,
  CsvColumnMapping,
  CsvImportResult,
  CsvRowError,
  attendeeSchema,
} from '@passforge/shared';
import { INITIAL_ATTENDEE, DEMO_ATTENDEES } from '../../config/sampleData.js';
import { MAX_CSV_ROWS } from '../../config/constants.js';

export class AttendeeService {
  private attendees: AttendeeInfo[] = [{ ...INITIAL_ATTENDEE }];

  getAllAttendees(search?: string, ticketType?: string): AttendeeInfo[] {
    let result = [...this.attendees];

    if (ticketType && ticketType !== 'ALL') {
      const typeLower = ticketType.toLowerCase();
      result = result.filter(a => a.ticketType.toLowerCase() === typeLower);
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        a =>
          a.name.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          a.seat.toLowerCase().includes(q) ||
          a.ticketType.toLowerCase().includes(q)
      );
    }

    return result;
  }

  getAttendeeById(id: string): AttendeeInfo | undefined {
    return this.attendees.find(a => a.id === id);
  }

  getAttendeeByEmail(email: string): AttendeeInfo | undefined {
    return this.attendees.find(a => a.email.toLowerCase() === email.toLowerCase());
  }

  addAttendee(attendee: AttendeeInfo): AttendeeInfo {
    const validated = attendeeSchema.parse(attendee);
    const existingIndex = this.attendees.findIndex(
      a => a.email.toLowerCase() === validated.email.toLowerCase()
    );

    const newAttendee: AttendeeInfo = {
      ...validated,
      id: attendee.id || 'att-' + Math.random().toString(36).substring(2, 9),
      importedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      this.attendees[existingIndex] = newAttendee;
    } else {
      this.attendees.push(newAttendee);
    }

    return newAttendee;
  }

  clearAttendees() {
    this.attendees = [];
  }

  loadDemoRoster(): AttendeeInfo[] {
    this.attendees = DEMO_ATTENDEES.map(a => ({ ...a }));
    return [...this.attendees];
  }

  resetToDefault() {
    this.attendees = [{ ...INITIAL_ATTENDEE }];
  }

  /**
   * Helper to detect standard column names if mapping not provided
   */
  private detectColumnMapping(headers: string[]): CsvColumnMapping {
    const findHeader = (patterns: RegExp[]): string => {
      for (const pattern of patterns) {
        const found = headers.find(h => pattern.test(h.trim()));
        if (found) return found;
      }
      return '';
    };

    const nameCol = findHeader([/^name$/i, /^full[_\s]?name$/i, /^attendee[_\s]?name$/i, /attendee/i, /name/i]);
    const emailCol = findHeader([/^email$/i, /^email[_\s]?address$/i, /mail/i]);
    const ticketCol = findHeader([/^ticket[_\s]?type$/i, /^ticket$/i, /^category$/i, /^tier$/i, /^pass$/i, /ticket/i]);
    const seatCol = findHeader([/^seat[_\s]?number$/i, /^seat[_\s]?no$/i, /^seat$/i, /seat/i]);

    return {
      name: nameCol || headers[0] || 'name',
      email: emailCol || headers[1] || 'email',
      ticketType: ticketCol || headers[2] || 'ticketType',
      seat: seatCol || headers[3] || '',
    };
  }

  /**
   * Parse CSV content with Papa Parse and validate row by row
   */
  importAttendeesFromCsv(csvContent: string, userMapping?: Partial<CsvColumnMapping>): CsvImportResult {
    if (!csvContent || !csvContent.trim()) {
      return {
        totalRows: 0,
        validCount: 0,
        invalidCount: 0,
        skippedEmptyRows: 0,
        importedAttendees: [],
        errors: [{ row: 0, field: 'csv', message: 'CSV content is empty' }],
      };
    }

    const parsed = Papa.parse<Record<string, string>>(csvContent, {
      header: true,
      skipEmptyLines: false, // We manually inspect to report or count empty rows
      transformHeader: h => h.trim(),
    });

    if (parsed.errors && parsed.errors.length > 0) {
      const fatalErrors = parsed.errors.filter(e => e.type === 'Quotes' || e.code === 'UndetectableDelimiter');
      if (fatalErrors.length > 0) {
        return {
          totalRows: 0,
          validCount: 0,
          invalidCount: fatalErrors.length,
          skippedEmptyRows: 0,
          importedAttendees: [],
          errors: fatalErrors.map(e => ({
            row: (e.row || 0) + 1,
            field: 'csv_format',
            message: e.message,
          })),
        };
      }
    }

    const headers = parsed.meta.fields || [];
    if (headers.length === 0) {
      return {
        totalRows: 0,
        validCount: 0,
        invalidCount: 1,
        skippedEmptyRows: 0,
        importedAttendees: [],
        errors: [{ row: 1, field: 'headers', message: 'No CSV headers found' }],
      };
    }

    // Auto-detect or merge with user-provided mapping
    const detectedMapping = this.detectColumnMapping(headers);
    const mapping: CsvColumnMapping = {
      name: userMapping?.name || detectedMapping.name,
      email: userMapping?.email || detectedMapping.email,
      ticketType: userMapping?.ticketType || detectedMapping.ticketType,
      seat: userMapping?.seat !== undefined ? userMapping.seat : detectedMapping.seat,
    };

    const rows = parsed.data;
    if (rows.length > MAX_CSV_ROWS) {
      return {
        totalRows: rows.length,
        validCount: 0,
        invalidCount: 1,
        skippedEmptyRows: 0,
        importedAttendees: [],
        errors: [
          {
            row: 0,
            field: 'limit',
            message: `CSV row count (${rows.length}) exceeds maximum limit of ${MAX_CSV_ROWS} rows.`,
          },
        ],
      };
    }

    const seenEmailsInBatch = new Set<string>();
    const validAttendees: AttendeeInfo[] = [];
    const errors: CsvRowError[] = [];
    let skippedEmptyRows = 0;

    rows.forEach((row, index) => {
      // Row numbers: Header is line 1, first data row is line 2
      const rowNum = index + 2;

      // Check for empty row
      const values = Object.values(row);
      const isAllEmpty = values.every(v => !v || v.trim().length === 0);
      if (isAllEmpty) {
        skippedEmptyRows++;
        return;
      }

      const rawName = mapping.name ? row[mapping.name]?.trim() : '';
      const rawEmail = mapping.email ? row[mapping.email]?.trim() : '';
      const rawTicketType = (mapping.ticketType && row[mapping.ticketType]?.trim()) || 'General';
      const rawSeat = (mapping.seat && row[mapping.seat]?.trim()) || 'General Admission';

      let hasRowError = false;

      // Check required name
      if (!rawName) {
        errors.push({
          row: rowNum,
          field: 'name',
          message: 'Attendee name is required',
          rawData: row,
        });
        hasRowError = true;
      }

      // Check required & valid email
      if (!rawEmail) {
        errors.push({
          row: rowNum,
          field: 'email',
          message: 'Email address is required',
          rawData: row,
        });
        hasRowError = true;
      } else {
        const normalizedEmail = rawEmail.toLowerCase();
        // Check duplicate within current CSV batch
        if (seenEmailsInBatch.has(normalizedEmail)) {
          errors.push({
            row: rowNum,
            field: 'email',
            message: `Duplicate email address "${rawEmail}" found in CSV batch`,
            rawData: row,
          });
          hasRowError = true;
        } else {
          seenEmailsInBatch.add(normalizedEmail);
        }
      }

      // Check required ticket type
      if (!rawTicketType) {
        errors.push({
          row: rowNum,
          field: 'ticketType',
          message: 'Ticket category is required',
          rawData: row,
        });
        hasRowError = true;
      }

      // Schema validation
      const candidate = {
        name: rawName,
        email: rawEmail,
        ticketType: rawTicketType,
        seat: rawSeat,
      };

      const parseResult = attendeeSchema.safeParse(candidate);
      if (!parseResult.success) {
        for (const issue of parseResult.error.issues) {
          // Avoid duplicate message if already reported
          const fieldName = issue.path[0]?.toString() || 'attendee';
          const alreadyReported = errors.some(e => e.row === rowNum && e.field === fieldName);
          if (!alreadyReported) {
            errors.push({
              row: rowNum,
              field: fieldName,
              message: issue.message,
              rawData: row,
            });
          }
        }
        hasRowError = true;
      }

      if (!hasRowError && parseResult.success) {
        const attendee: AttendeeInfo = {
          ...parseResult.data,
          id: 'att-' + Math.random().toString(36).substring(2, 9),
          importedAt: new Date().toISOString(),
        };
        validAttendees.push(attendee);
      }
    });

    // Save valid attendees into storage
    for (const attendee of validAttendees) {
      const existingIdx = this.attendees.findIndex(
        a => a.email.toLowerCase() === attendee.email.toLowerCase()
      );
      if (existingIdx >= 0) {
        this.attendees[existingIdx] = attendee;
      } else {
        this.attendees.push(attendee);
      }
    }

    const totalDataRows = rows.length - skippedEmptyRows;

    return {
      totalRows: totalDataRows,
      validCount: validAttendees.length,
      invalidCount: totalDataRows - validAttendees.length,
      skippedEmptyRows,
      importedAttendees: validAttendees,
      errors,
    };
  }
}

export const attendeeService = new AttendeeService();
