import {
  EventInfo,
  AttendeeInfo,
  CsvColumnMapping,
  CsvImportResult,
  TicketData,
  RenderResult,
  OutputFormat,
  DesignMetadata,
  DesignConfig,
  TicketPreviewRequest,
  TicketPreviewResponse,
} from '@passforge/shared';

const API_BASE = '/api';

export async function fetchHealth(): Promise<{ status: string; uptimeSeconds: number }> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Failed to reach backend health endpoint');
  return res.json();
}

export async function fetchCurrentEvent(): Promise<EventInfo> {
  const res = await fetch(`${API_BASE}/events/current`);
  if (!res.ok) throw new Error('Failed to fetch event data');
  const data = await res.json();
  return data.event;
}

export async function saveEvent(event: Partial<EventInfo>): Promise<EventInfo> {
  const res = await fetch(`${API_BASE}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to save event information');
  }
  return data.event;
}

export async function fetchAttendees(
  search?: string,
  ticketType?: string
): Promise<{ attendees: AttendeeInfo[]; count: number }> {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (ticketType && ticketType !== 'ALL') params.set('ticketType', ticketType);

  const url = `${API_BASE}/attendees${params.toString() ? '?' + params.toString() : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch attendee records');
  return res.json();
}

export async function importAttendeesCsv(
  file: File,
  mapping?: Partial<CsvColumnMapping>
): Promise<CsvImportResult> {
  const formData = new FormData();
  formData.append('file', file);
  if (mapping) {
    formData.append('mapping', JSON.stringify(mapping));
  }

  const res = await fetch(`${API_BASE}/attendees/import`, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'CSV import failed');
  }
  return data.result;
}

export async function importAttendeesCsvText(
  csvText: string,
  mapping?: Partial<CsvColumnMapping>
): Promise<CsvImportResult> {
  const res = await fetch(`${API_BASE}/attendees/import`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ csv: csvText, mapping }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'CSV text import failed');
  }
  return data.result;
}

export async function resetAttendees(): Promise<void> {
  const res = await fetch(`${API_BASE}/attendees/reset`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to reset attendees');
}

export async function fetchTicketData(): Promise<{
  ticket: TicketData;
  results: Record<OutputFormat, RenderResult>;
}> {
  const res = await fetch(`${API_BASE}/ticket-data`);
  if (!res.ok) throw new Error('Failed to fetch ticket rendering data');
  return res.json();
}

export async function generateTicket(
  format: OutputFormat | 'all',
  attendeeId?: string
): Promise<{
  success: boolean;
  result?: RenderResult;
  results?: Record<OutputFormat, RenderResult>;
  ticket?: TicketData;
}> {
  const url = `${API_BASE}/generate/${format}${attendeeId ? '?attendeeId=' + attendeeId : ''}`;
  const res = await fetch(url, { method: 'POST' });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || `Failed to generate ${format} output`);
  }
  return data;
}

export async function testLongName(): Promise<{ success: boolean; results: any; ticket: any }> {
  const res = await fetch(`${API_BASE}/test-long-name`, { method: 'POST' });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error || 'Stress test failed');
  return data;
}

// ==========================================
// Milestone 3: Design & Branding API Methods
// ==========================================

export async function fetchDesigns(): Promise<DesignMetadata[]> {
  const res = await fetch(`${API_BASE}/designs`);
  if (!res.ok) throw new Error('Failed to fetch ticket designs');
  const data = await res.json();
  return data.designs;
}

export async function fetchCurrentDesignConfig(): Promise<DesignConfig> {
  const res = await fetch(`${API_BASE}/designs/current`);
  if (!res.ok) throw new Error('Failed to fetch current design configuration');
  const data = await res.json();
  return data.config;
}

export async function saveDesignConfig(config: Partial<DesignConfig>): Promise<DesignConfig> {
  const res = await fetch(`${API_BASE}/designs/current`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to save design configuration');
  }
  return data.config;
}

export async function fetchTicketPreview(
  payload: TicketPreviewRequest
): Promise<TicketPreviewResponse & { previews?: { pngDataUrl?: string; emailHtml?: string; pageHtml?: string; pdfUrl?: string } }> {
  const res = await fetch(`${API_BASE}/tickets/preview`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to render live ticket preview');
  }
  return data;
}

export async function uploadLogo(dataUrl: string): Promise<{ config: DesignConfig; logoUrl: string }> {
  const res = await fetch(`${API_BASE}/branding/logo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dataUrl }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to upload event logo');
  }
  return data;
}

export async function resetBranding(): Promise<DesignConfig> {
  const res = await fetch(`${API_BASE}/branding/reset`, { method: 'POST' });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to reset branding');
  }
  return data.config;
}
