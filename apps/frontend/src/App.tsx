import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { AttendeeInfo, CsvColumnMapping, CsvImportResult, OutputFormat } from '@passforge/shared';
import { Header } from './components/layout/Header.js';
import { Footer } from './components/layout/Footer.js';
import { EventForm } from './features/event/EventForm.js';
import { EventSummaryCard } from './features/event/EventSummaryCard.js';
import { CsvUploader } from './features/attendees/CsvUploader.js';
import { CsvColumnMapper } from './features/attendees/CsvColumnMapper.js';
import { ImportSummary } from './features/attendees/ImportSummary.js';
import { AttendeeTable } from './features/attendees/AttendeeTable.js';
import { TicketDesigner } from './features/tickets/TicketDesigner.js';
import { TicketPreviewModal } from './features/tickets/TicketPreviewModal.js';
import { BatchExportCard } from './features/exports/BatchExportCard.js';
import { useEvent } from './hooks/useEvent.js';
import { useAttendees } from './hooks/useAttendees.js';
import { useTicketRender } from './hooks/useTicketRender.js';
import { fetchHealth } from './services/api.js';
import { ActiveTab } from './types/index.js';
import { Sparkles, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('tickets');
  const [serverOnline, setServerOnline] = useState<boolean>(true);

  // Core Hooks
  const { event, updateEvent } = useEvent();
  const {
    attendees,
    count: attendeeCount,
    importFile,
    importText,
    resetAttendees,
  } = useAttendees();
  const {
    results: ticketResults,
    renderAllFormats,
    runLongNameTest,
    loading: renderLoading,
  } = useTicketRender();

  // CSV Workflow State
  const [loadedFile, setLoadedFile] = useState<File | null>(null);
  const [rawCsvText, setRawCsvText] = useState<string>('');
  const [detectedHeaders, setDetectedHeaders] = useState<string[]>([]);
  const [previewRows, setPreviewRows] = useState<Record<string, string>[]>([]);
  const [detectedMapping, setDetectedMapping] = useState<CsvColumnMapping>({
    name: '',
    email: '',
    ticketType: '',
    seat: '',
  });
  const [importResult, setImportResult] = useState<CsvImportResult | null>(null);
  const [importing, setImporting] = useState<boolean>(false);

  // Ticket Preview Modal State
  const [modalAttendee, setModalAttendee] = useState<AttendeeInfo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Poll server health on mount
  useEffect(() => {
    fetchHealth()
      .then(() => setServerOnline(true))
      .catch(() => setServerOnline(false));
  }, []);

  // When a file or text is loaded, parse headers and candidate mapping
  const handleFileLoaded = (file: File, content: string) => {
    setLoadedFile(file);
    setRawCsvText(content);
    setImportResult(null);
    parseCsvMetadata(content);
  };

  const handleTextLoaded = (content: string) => {
    setLoadedFile(null);
    setRawCsvText(content);
    setImportResult(null);
    parseCsvMetadata(content);
  };

  const parseCsvMetadata = (content: string) => {
    const parsed = Papa.parse<Record<string, string>>(content, {
      header: true,
      preview: 5,
      skipEmptyLines: 'greedy',
      transformHeader: h => h.trim(),
    });

    const headers = parsed.meta.fields || [];
    setDetectedHeaders(headers);
    setPreviewRows(parsed.data || []);

    // Helper to detect default columns
    const findHeader = (patterns: RegExp[]) => {
      for (const pattern of patterns) {
        const found = headers.find(h => pattern.test(h));
        if (found) return found;
      }
      return '';
    };

    setDetectedMapping({
      name: findHeader([/^name$/i, /^full[_\s]?name$/i, /^attendee[_\s]?name$/i, /name/i]) || headers[0] || '',
      email: findHeader([/^email$/i, /^email[_\s]?address$/i, /mail/i]) || headers[1] || '',
      ticketType: findHeader([/^ticket[_\s]?type$/i, /^ticket$/i, /^category$/i, /^tier$/i, /pass/i]) || headers[2] || '',
      seat: findHeader([/^seat[_\s]?number$/i, /^seat[_\s]?no$/i, /^seat$/i, /seat/i]) || headers[3] || '',
    });
  };

  // Execute import with the finalized mapping
  const handleConfirmImport = async (mapping: CsvColumnMapping) => {
    setImporting(true);
    try {
      let result: CsvImportResult;
      if (loadedFile) {
        result = await importFile(loadedFile, mapping);
      } else {
        result = await importText(rawCsvText, mapping);
      }
      setImportResult(result);
    } catch (err: any) {
      alert(`Import failed: ${err.message}`);
    } finally {
      setImporting(false);
    }
  };

  const handleResetImportFlow = () => {
    setLoadedFile(null);
    setRawCsvText('');
    setDetectedHeaders([]);
    setPreviewRows([]);
    setImportResult(null);
  };

  const handleOpenTicketModal = (attendee: AttendeeInfo) => {
    setModalAttendee(attendee);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F5F0] text-[#252525]">
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        eventName={event?.name}
        attendeeCount={attendeeCount}
        serverOnline={serverOnline}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* TAB 1: EVENT CONFIGURATION */}
        {activeTab === 'event' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {event && <EventForm initialEvent={event} onSave={updateEvent} />}
            </div>
            <div>
              {event && <EventSummaryCard event={event} />}
            </div>
          </div>
        )}

        {/* TAB 2: CSV ATTENDEE IMPORT */}
        {activeTab === 'import' && (
          <div className="space-y-6">
            {event && (
              <div className="bg-white border border-[#E9E5DC] rounded-2xl px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#FBF2EE] text-[#B86E52] border border-[#F0D5C9] flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#77736C]">
                        Importing Roster For
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2E683E]" />
                    </div>
                    <p className="text-sm font-bold text-[#252525] truncate">
                      {event.name}{' '}
                      <span className="text-xs font-normal text-[#77736C]">
                        • {event.date} • {event.venue}
                      </span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('event')}
                  className="text-xs font-semibold text-[#B86E52] hover:text-[#A15D43] self-start sm:self-auto cursor-pointer"
                >
                  Edit Event Details →
                </button>
              </div>
            )}

            {importResult ? (
              <ImportSummary
                result={importResult}
                onGoToDirectory={() => setActiveTab('attendees')}
                onReset={handleResetImportFlow}
              />
            ) : detectedHeaders.length > 0 ? (
              <CsvColumnMapper
                headers={detectedHeaders}
                previewRows={previewRows}
                initialMapping={detectedMapping}
                onConfirmImport={handleConfirmImport}
                onCancel={handleResetImportFlow}
                loading={importing}
              />
            ) : (
              <CsvUploader
                onFileLoaded={handleFileLoaded}
                onTextLoaded={handleTextLoaded}
                loading={importing}
              />
            )}
          </div>
        )}

        {/* TAB 3: ATTENDEE DIRECTORY */}
        {activeTab === 'attendees' && (
          <div className="space-y-6">
            <AttendeeTable
              attendees={attendees}
              onSelectAttendeeForTicket={handleOpenTicketModal}
              onGoToImport={() => setActiveTab('import')}
              onResetToDefault={resetAttendees}
            />
          </div>
        )}

        {/* TAB 4: TICKET DESIGNER & LIVE PREVIEW */}
        {activeTab === 'tickets' && (
          <TicketDesigner
            attendees={attendees}
            eventName={event?.name || 'KIET TechFest 2027'}
          />
        )}
      </main>

      <Footer />

      {/* Ticket Preview Modal */}
      <TicketPreviewModal
        attendee={modalAttendee}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
