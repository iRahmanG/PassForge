import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import {
  AttendeeInfo,
  CsvColumnMapping,
  CsvImportResult,
  OutputFormat,
  EventInfo,
} from '@passforge/shared';
import { StepProgressBar, WorkflowStepId } from './components/layout/StepProgressBar.js';
import { Footer } from './components/layout/Footer.js';
import { LandingPage } from './features/marketing/LandingPage.js';
import { EventSetupStep } from './features/event/EventSetupStep.js';
import { CsvUploader } from './features/attendees/CsvUploader.js';
import { CsvColumnMapper } from './features/attendees/CsvColumnMapper.js';
import { ImportSummary } from './features/attendees/ImportSummary.js';
import { AttendeeTable } from './features/attendees/AttendeeTable.js';
import { TicketDesigner } from './features/tickets/TicketDesigner.js';
import { TicketPreviewModal } from './features/tickets/TicketPreviewModal.js';
import { BulkExportModal } from './features/tickets/BulkExportModal.js';
import { useEvent } from './hooks/useEvent.js';
import { useAttendees } from './hooks/useAttendees.js';
import { useTicketRender } from './hooks/useTicketRender.js';
import { fetchHealth, saveDesignConfig, uploadLogo } from './services/api.js';
import { ActiveTab } from './types/index.js';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Calendar,
  ArrowRight,
  ArrowLeft,
  Users,
  Layers,
  Table as TableIcon,
  UploadCloud,
} from 'lucide-react';

export default function App() {
  const [routePath, setRoutePath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  // Guided 4-Step Workflow State: 1 | 2 | 3 | 4
  const [currentStep, setCurrentStep] = useState<WorkflowStepId>(1);
  const [completedSteps, setCompletedSteps] = useState<WorkflowStepId[]>([]);
  const [isDemoLoaded, setIsDemoLoaded] = useState<boolean>(false);

  // Studio tabs fallback inside Step 2 ('import' | 'attendees')
  const [step2View, setStep2View] = useState<'import' | 'roster'>('import');
  const [serverOnline, setServerOnline] = useState<boolean>(true);

  // Synchronize route with browser history
  useEffect(() => {
    const handlePopState = () => {
      setRoutePath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (path.startsWith('#')) {
      const id = path.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }
    window.history.pushState({}, '', path);
    setRoutePath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Core Hooks
  const { event, updateEvent, refreshEvent } = useEvent();
  const {
    attendees,
    count: attendeeCount,
    importFile,
    importText,
    resetAttendees,
    loadDemo,
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

  // Health poll on mount
  useEffect(() => {
    fetchHealth()
      .then(() => setServerOnline(true))
      .catch(() => setServerOnline(false));
  }, []);

  // Validation helpers for workflow prerequisites
  const isStep1Valid = Boolean(
    event?.name &&
      event.name.trim().length >= 2 &&
      event?.date &&
      event.date.trim().length > 0 &&
      event?.venue &&
      event.venue.trim().length >= 2
  );

  const isStep2Valid = attendees.length > 0;

  const canNavigateToStep = (targetStep: WorkflowStepId): boolean => {
    if (targetStep === 1) return true;
    if (targetStep === 2) return isStep1Valid;
    if (targetStep === 3) return isStep1Valid && isStep2Valid;
    if (targetStep === 4) return isStep1Valid && isStep2Valid;
    return false;
  };

  // Handle Intent & Navigation Query Params (?action=create | ?action=resume | ?step=X)
  useEffect(() => {
    if (!routePath.startsWith('/app')) return;

    const params = new URLSearchParams(window.location.search);
    const action = params.get('action');
    const stepParam = params.get('step');

    if (action === 'create') {
      // "Create Your Tickets": Start fresh at Step 1
      setCurrentStep(1);
      setCompletedSteps([]);
      setIsDemoLoaded(false);
      handleResetImportFlow();
    } else if (action === 'resume') {
      // "Open Studio": Resume current in-memory workflow if valid, otherwise Step 1
      if (isStep1Valid && isStep2Valid) {
        setCurrentStep(3);
        setCompletedSteps([1, 2]);
      } else if (isStep1Valid) {
        setCurrentStep(2);
        setCompletedSteps([1]);
      } else {
        setCurrentStep(1);
      }
    } else if (stepParam) {
      const num = parseInt(stepParam, 10) as WorkflowStepId;
      if (num >= 1 && num <= 4 && canNavigateToStep(num)) {
        setCurrentStep(num);
      }
    }
  }, [routePath, isStep1Valid, isStep2Valid]);

  // Demo Experience: Populates demo event + 12 demo attendees and starts at Step 3 (Design)
  const handleLoadDemoAndGoToDesign = async () => {
    try {
      await loadDemo();
      await refreshEvent();
      setCompletedSteps([1, 2]);
      setCurrentStep(3);
      setIsDemoLoaded(true);
    } catch (err: any) {
      alert(`Failed to load demo data: ${err.message}`);
    }
  };

  // Step 1: Save Event Details and Proceed
  const handleStep1Continue = async (
    eventData: Partial<EventInfo>,
    brandingData?: { accentColor?: string; logoDataUrl?: string }
  ) => {
    await updateEvent(eventData);

    if (brandingData?.accentColor) {
      try {
        await saveDesignConfig({ branding: { accentColor: brandingData.accentColor } });
      } catch (e) {
        console.warn('Failed to update brand color:', e);
      }
    }

    if (brandingData?.logoDataUrl) {
      try {
        await uploadLogo(brandingData.logoDataUrl);
      } catch (e) {
        console.warn('Failed to upload logo:', e);
      }
    }

    setCompletedSteps((prev) => Array.from(new Set([...prev, 1 as WorkflowStepId])));
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // CSV parsing & mapping handlers
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
      transformHeader: (h) => h.trim(),
    });

    const headers = parsed.meta.fields || [];
    setDetectedHeaders(headers);
    setPreviewRows(parsed.data || []);

    const findHeader = (patterns: RegExp[]) => {
      for (const pattern of patterns) {
        const found = headers.find((h) => pattern.test(h));
        if (found) return found;
      }
      return '';
    };

    setDetectedMapping({
      name:
        findHeader([/^name$/i, /^full[_\s]?name$/i, /^attendee[_\s]?name$/i, /name/i]) ||
        headers[0] ||
        '',
      email: findHeader([/^email$/i, /^email[_\s]?address$/i, /mail/i]) || headers[1] || '',
      ticketType:
        findHeader([/^ticket[_\s]?type$/i, /^ticket$/i, /^category$/i, /^tier$/i, /pass/i]) ||
        headers[2] ||
        '',
      seat:
        findHeader([/^seat[_\s]?number$/i, /^seat[_\s]?no$/i, /^seat$/i, /seat/i]) ||
        headers[3] ||
        '',
    });
  };

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
      setCompletedSteps((prev) => Array.from(new Set([...prev, 2 as WorkflowStepId])));
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

  // If viewing public landing page or public marketing sections
  if (!routePath.startsWith('/app')) {
    let initialSection: string | undefined = undefined;
    if (routePath.includes('features')) initialSection = 'features';
    else if (routePath.includes('how-it-works')) initialSection = 'how-it-works';
    else if (routePath.includes('designs')) initialSection = 'designs';
    else if (routePath.includes('faq')) initialSection = 'faq';
    else if (routePath.includes('use-cases')) initialSection = 'use-cases';

    return <LandingPage onNavigate={navigate} initialSection={initialSection} />;
  }

  return (
    <div
      className={`flex flex-col bg-[#F7F5F0] text-[#252525] ${
        currentStep === 3 ? 'h-screen overflow-hidden' : 'min-h-screen'
      }`}
    >
      {/* Persistent 4-Step Progress Indicator */}
      <StepProgressBar
        currentStep={currentStep}
        completedSteps={completedSteps}
        onSelectStep={(step) => {
          if (canNavigateToStep(step)) {
            setCurrentStep(step);
          }
        }}
        canNavigateToStep={canNavigateToStep}
        eventName={event?.name}
        attendeeCount={attendeeCount}
        onNavigateHome={() => navigate('/')}
        onLoadDemo={handleLoadDemoAndGoToDesign}
      />

      {/* ======================================================== */}
      {/* STEP 1: EVENT DETAILS */}
      {/* ======================================================== */}
      {currentStep === 1 && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <EventSetupStep
            initialEvent={event}
            onContinue={handleStep1Continue}
            onLoadDemo={handleLoadDemoAndGoToDesign}
          />
        </main>
      )}

      {/* ======================================================== */}
      {/* STEP 2: IMPORT ATTENDEES */}
      {/* ======================================================== */}
      {currentStep === 2 && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Header Brief Banner with Event Context */}
          {event && (
            <div className="bg-white border border-[#E9E5DC] rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FBF2EE] text-[#B86E52] border border-[#F0D5C9] flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#77736C]">
                      Importing Roster For
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2E683E]" />
                    <span className="text-xs font-semibold text-[#2E683E]">Step 1 Complete</span>
                  </div>
                  <p className="text-sm sm:text-base font-bold text-[#252525] truncate">
                    {event.name}{' '}
                    <span className="text-xs font-normal text-[#77736C]">
                      • {event.date} • {event.venue}
                    </span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setCurrentStep(1)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B86E52] hover:text-[#A15D43] px-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#E9E5DC] transition-colors cursor-pointer self-start sm:self-auto"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Edit Event Details</span>
              </button>
            </div>
          )}

          {/* Sub-view Switcher if attendees already present */}
          {attendees.length > 0 && (
            <div className="flex items-center justify-between bg-white border border-[#E9E5DC] rounded-2xl p-2 shadow-2xs">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setStep2View('import')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    step2View === 'import'
                      ? 'bg-[#FBF2EE] text-[#B86E52] border border-[#F0D5C9]'
                      : 'text-[#77736C] hover:text-[#252525]'
                  }`}
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>CSV Uploader</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep2View('roster')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    step2View === 'roster'
                      ? 'bg-[#FBF2EE] text-[#B86E52] border border-[#F0D5C9]'
                      : 'text-[#77736C] hover:text-[#252525]'
                  }`}
                >
                  <TableIcon className="w-3.5 h-3.5" />
                  <span>Verified Roster ({attendees.length})</span>
                </button>
              </div>

              <div className="text-xs text-[#2E683E] font-semibold flex items-center gap-1.5 pr-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{attendees.length} Attendees Loaded</span>
              </div>
            </div>
          )}

          {/* Step 2 Content: CSV Flow or Attendee Table */}
          {step2View === 'import' ? (
            <div className="space-y-6">
              {importResult ? (
                <ImportSummary
                  result={importResult}
                  onGoToDirectory={() => setStep2View('roster')}
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
          ) : (
            <div className="space-y-6">
              <AttendeeTable
                attendees={attendees}
                onSelectAttendeeForTicket={handleOpenTicketModal}
                onGoToImport={() => setStep2View('import')}
                onResetToDefault={resetAttendees}
                onLoadDemo={handleLoadDemoAndGoToDesign}
              />
            </div>
          )}

          {/* Step 2 Navigation Footer */}
          <div className="bg-white border border-[#E9E5DC] rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#504D47] hover:text-[#252525] bg-[#FAF8F5] hover:bg-white border border-[#DDD8CD] transition-all cursor-pointer w-full sm:w-auto justify-center"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Event Details</span>
            </button>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              {attendees.length === 0 && (
                <button
                  type="button"
                  onClick={handleLoadDemoAndGoToDesign}
                  className="text-xs font-semibold text-[#B86E52] hover:underline flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Or Load 12 Demo Attendees</span>
                </button>
              )}

              <button
                type="button"
                data-testid="continue-to-design-btn"
                disabled={attendees.length === 0}
                onClick={() => {
                  setCompletedSteps((prev) => Array.from(new Set([...prev, 2 as WorkflowStepId])));
                  setCurrentStep(3);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs w-full sm:w-auto ${
                  attendees.length > 0
                    ? 'text-white bg-[#B86E52] hover:bg-[#A15D43] cursor-pointer'
                    : 'text-[#9C988F] bg-[#FAF8F5] border border-[#E9E5DC] cursor-not-allowed opacity-60'
                }`}
                title={
                  attendees.length === 0
                    ? 'Import or load attendees to proceed to ticket design'
                    : 'Proceed to Design Studio'
                }
              >
                <span>Continue to Design Tickets</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </main>
      )}

      {/* ======================================================== */}
      {/* STEP 3: DESIGN TICKETS STUDIO */}
      {/* ======================================================== */}
      {currentStep === 3 && (
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <TicketDesigner
            attendees={attendees}
            eventName={event?.name || 'KIET TechFest 2027'}
            onNavigateHome={() => navigate('/')}
            onSelectTab={(tab) => {
              if (tab === 'event') setCurrentStep(1);
              else if (tab === 'import' || tab === 'attendees') setCurrentStep(2);
            }}
            onLoadDemo={handleLoadDemoAndGoToDesign}
            onOpenPassInspector={(attendee) => handleOpenTicketModal(attendee || attendees[0])}
            onProceedToExport={() => {
              setCompletedSteps((prev) => Array.from(new Set([...prev, 3 as WorkflowStepId])));
              setCurrentStep(4);
            }}
            isDemoLoaded={isDemoLoaded}
          />
        </div>
      )}

      {/* ======================================================== */}
      {/* STEP 4: GENERATE & EXPORT */}
      {/* ======================================================== */}
      {currentStep === 4 && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Step 4 Context Header */}
          <div className="bg-white border border-[#E9E5DC] rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FBF2EE] border border-[#F0D5C9] text-xs font-bold text-[#B86E52]">
                <span>Step 4 of 4</span>
                <span className="text-[#A15D43]">•</span>
                <span>Batch Generation &amp; ZIP Archive</span>
              </div>
              <h2 className="text-xl font-bold text-[#252525] font-serif">
                Generate &amp; Download Tickets
              </h2>
              <p className="text-xs text-[#77736C]">
                Event: <span className="font-semibold text-[#252525]">{event?.name}</span> •{' '}
                <span className="font-semibold text-[#252525]">{attendees.length} Attendees</span>
              </p>
            </div>

            <button
              onClick={() => setCurrentStep(3)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#504D47] hover:text-[#252525] px-3.5 py-2 rounded-xl bg-[#FAF8F5] hover:bg-white border border-[#DDD8CD] transition-colors cursor-pointer self-start sm:self-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Design Studio</span>
            </button>
          </div>

          {/* Embedded Full Bulk Generation & ZIP Export View */}
          <BulkExportModal
            isOpen={true}
            embedded={true}
            onClose={() => setCurrentStep(3)}
            onBackToDesign={() => setCurrentStep(3)}
            attendees={attendees}
            eventName={event?.name || 'KIET TechFest 2027'}
            designName="Selected Template"
            onLoadDemo={handleLoadDemoAndGoToDesign}
          />
        </main>
      )}

      {/* Footer (for non-full-screen studio steps) */}
      {currentStep !== 3 && <Footer />}

      {/* Pass Inspector Modal */}
      <TicketPreviewModal
        attendee={modalAttendee}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        eventName={event?.name || 'KIET TechFest 2027'}
      />
    </div>
  );
}
