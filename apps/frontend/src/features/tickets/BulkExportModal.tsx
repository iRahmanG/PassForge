import React, { useState, useEffect, useRef } from 'react';
import {
  OutputFormat,
  AttendeeInfo,
  BulkJobProgressResponse,
  BulkGenerateResponse,
  supportedOutputFormats,
  TicketDesignId,
} from '@passforge/shared';
import {
  X,
  Download,
  Mail,
  Globe,
  FileText,
  Image as ImageIcon,
  Check,
  AlertTriangle,
  RotateCw,
  Search,
  CheckSquare,
  Square,
  Sparkles,
  Archive,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface BulkExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  attendees: AttendeeInfo[];
  eventName: string;
  designName: string;
  designId?: TicketDesignId;
}

type Step = 'config' | 'progress' | 'results';

export const BulkExportModal: React.FC<BulkExportModalProps> = ({
  isOpen,
  onClose,
  attendees,
  eventName,
  designName,
  designId,
}) => {
  // Step state
  const [step, setStep] = useState<Step>('config');

  // Format selection: All 4 formats selected by default
  const [selectedFormats, setSelectedFormats] = useState<OutputFormat[]>([
    'email',
    'page',
    'pdf',
    'png',
  ]);

  // Attendee selection: All attendees selected by default
  const [selectedAttendeeIds, setSelectedAttendeeIds] = useState<string[]>(() =>
    attendees.map((a) => a.id)
  );
  const [attendeeSelectionMode, setAttendeeSelectionMode] = useState<'all' | 'custom'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Job execution state
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobProgress, setJobProgress] = useState<BulkJobProgressResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sync selected attendee IDs when attendees change
  useEffect(() => {
    if (attendees.length > 0 && selectedAttendeeIds.length === 0) {
      setSelectedAttendeeIds(attendees.map((a) => a.id));
    }
  }, [attendees]);

  // Polling hook for job progress
  useEffect(() => {
    if (step === 'progress' && jobId) {
      const fetchProgress = async () => {
        try {
          const res = await fetch(`/api/bulk/${jobId}`);
          if (!res.ok) throw new Error('Failed to fetch generation progress');
          const data: BulkJobProgressResponse = await res.json();
          setJobProgress(data);

          if (data.isTerminal) {
            if (pollIntervalRef.current) {
              clearInterval(pollIntervalRef.current);
              pollIntervalRef.current = null;
            }
            setStep('results');
          }
        } catch (err: any) {
          console.error('Polling error:', err);
        }
      };

      fetchProgress();
      pollIntervalRef.current = setInterval(fetchProgress, 600);

      return () => {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
        }
      };
    }
  }, [step, jobId]);

  if (!isOpen) return null;

  // Format toggling
  const toggleFormat = (format: OutputFormat) => {
    setSelectedFormats((prev) =>
      prev.includes(format) ? prev.filter((f) => f !== format) : [...prev, format]
    );
  };

  const selectAllFormats = () => {
    setSelectedFormats([...supportedOutputFormats]);
  };

  const clearFormats = () => {
    setSelectedFormats([]);
  };

  // Attendee toggling
  const effectiveAttendeeIds =
    attendeeSelectionMode === 'all'
      ? attendees.map((a) => a.id)
      : selectedAttendeeIds;

  const toggleAttendee = (id: string) => {
    setSelectedAttendeeIds((prev) =>
      prev.includes(id) ? prev.filter((aId) => aId !== id) : [...prev, id]
    );
  };

  const selectAllAttendees = () => {
    setSelectedAttendeeIds(attendees.map((a) => a.id));
  };

  const clearAttendees = () => {
    setSelectedAttendeeIds([]);
  };

  // Filtered attendees for custom selection
  const filteredAttendees = attendees.filter((a) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.name.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      a.ticketType.toLowerCase().includes(q) ||
      (a.seat && a.seat.toLowerCase().includes(q))
    );
  });

  const totalExpectedOutputs = effectiveAttendeeIds.length * selectedFormats.length;

  // Start Generation
  const handleStartGeneration = async () => {
    if (effectiveAttendeeIds.length === 0 || selectedFormats.length === 0) return;

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/bulk/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attendeeIds: effectiveAttendeeIds,
          formats: selectedFormats,
          designId,
        }),
      });

      const data: BulkGenerateResponse = await res.json();
      if (!res.ok || !data.success) {
        throw new Error((data as any).error || 'Failed to start bulk generation');
      }

      setJobId(data.jobId);
      setStep('progress');
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred initiating export');
    } finally {
      setSubmitting(false);
    }
  };

  // Retry failed tasks
  const handleRetryFailed = async () => {
    if (!jobId) return;
    setRetrying(true);
    try {
      const res = await fetch(`/api/bulk/${jobId}/retry`, { method: 'POST' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to retry tasks');
      }
      setStep('progress');
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setRetrying(false);
    }
  };

  // Cancel job
  const handleCancelJob = async () => {
    if (!jobId) return;
    try {
      await fetch(`/api/bulk/${jobId}/cancel`, { method: 'POST' });
    } catch (err) {
      console.error('Cancel error:', err);
    }
  };

  const handleResetExport = () => {
    setStep('config');
    setJobId(null);
    setJobProgress(null);
    setErrorMessage(null);
  };

  const formatCards: {
    id: OutputFormat;
    label: string;
    sublabel: string;
    ext: string;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      id: 'email',
      label: 'Email HTML',
      sublabel: 'Universal table markup for Gmail, Outlook & Apple Mail',
      ext: '.html',
      icon: <Mail className="w-4 h-4 text-[#B86E52]" />,
      color: 'border-[#F0D5C9]',
    },
    {
      id: 'page',
      label: 'Web Pass',
      sublabel: 'Responsive standalone webpage pass with responsive layout',
      ext: '.html',
      icon: <Globe className="w-4 h-4 text-[#2E683E]" />,
      color: 'border-[#C6E2CD]',
    },
    {
      id: 'pdf',
      label: 'Printable PDF',
      sublabel: 'Clean vector admission document formatted for physical print',
      ext: '.pdf',
      icon: <FileText className="w-4 h-4 text-[#2C3E50]" />,
      color: 'border-[#CBD5E1]',
    },
    {
      id: 'png',
      label: 'Canvas PNG',
      sublabel: '2000×1040 high-resolution pass for social and digital wallet',
      ext: '.png',
      icon: <ImageIcon className="w-4 h-4 text-[#78350F]" />,
      color: 'border-[#FDE68A]',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div
        onClick={step === 'progress' ? undefined : onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog Container */}
      <div
        data-testid="bulk-export-modal"
        className="relative w-full max-w-2xl bg-white rounded-2xl border border-[#DDD8CD] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden z-10 animate-fade-in"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#E9E5DC] bg-[#FAF8F5] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FBF2EE] border border-[#F0D5C9] flex items-center justify-center text-[#B86E52] shrink-0">
              <Archive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#252525]">
                Bulk Ticket Generation &amp; ZIP Export
              </h3>
              <p className="text-xs text-[#77736C]">
                {eventName} • Design: <span className="font-semibold text-[#252525]">{designName}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            data-testid="bulk-modal-close-btn"
            disabled={step === 'progress'}
            className="p-1.5 rounded-lg text-[#77736C] hover:text-[#252525] hover:bg-white border border-[#E9E5DC] transition-colors cursor-pointer disabled:opacity-40"
            title="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="mx-5 mt-4 p-3 rounded-xl bg-[#FDF0F0] border border-[#F5CCCC] text-[#A83232] text-xs flex items-center gap-2 shrink-0">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span className="flex-1">{errorMessage}</span>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 1: EXPORT CONFIGURATION */}
        {/* ======================================================== */}
        {step === 'config' && (
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* 1. Format Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-[#252525] uppercase tracking-wider">
                    1. Select Output Formats
                  </h4>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#FAF8F5] border border-[#E9E5DC] text-[#77736C]">
                    {selectedFormats.length} of 4 selected
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <button
                    onClick={selectAllFormats}
                    data-testid="select-all-formats-btn"
                    className="text-[#B86E52] hover:underline font-semibold cursor-pointer"
                  >
                    Select All
                  </button>
                  <span className="text-[#DDD8CD]">•</span>
                  <button
                    onClick={clearFormats}
                    data-testid="clear-formats-btn"
                    className="text-[#77736C] hover:text-[#252525] cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {formatCards.map((card) => {
                  const isChecked = selectedFormats.includes(card.id);
                  return (
                    <div
                      key={card.id}
                      data-testid={`format-checkbox-${card.id}`}
                      onClick={() => toggleFormat(card.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                        isChecked
                          ? 'bg-[#FBF8F4] border-[#B86E52] shadow-xs'
                          : 'bg-white border-[#E9E5DC] hover:border-[#DDD8CD] hover:bg-[#FAF8F5]'
                      }`}
                    >
                      <div className="pt-0.5 shrink-0">
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-[#B86E52]" />
                        ) : (
                          <Square className="w-4 h-4 text-[#DDD8CD]" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-[#252525] flex items-center gap-1.5">
                            {card.icon}
                            {card.label}
                          </span>
                          <span className="text-[10px] font-mono text-[#77736C] bg-white border border-[#E9E5DC] px-1.5 py-0.2 rounded">
                            {card.ext}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#77736C] mt-1 leading-snug">
                          {card.sublabel}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              {selectedFormats.length === 0 && (
                <p className="text-[11px] text-[#A83232] mt-1.5 font-medium">
                  ⚠️ At least one output format must be selected.
                </p>
              )}
            </div>

            {/* 2. Attendee Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-[#252525] uppercase tracking-wider">
                    2. Select Attendees
                  </h4>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#FAF8F5] border border-[#E9E5DC] text-[#77736C]">
                    {effectiveAttendeeIds.length} of {attendees.length} selected
                  </span>
                </div>

                <div className="flex items-center bg-[#FAF8F5] p-0.5 rounded-lg border border-[#E9E5DC]">
                  <button
                    onClick={() => setAttendeeSelectionMode('all')}
                    data-testid="attendee-mode-all"
                    className={`px-2 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                      attendeeSelectionMode === 'all'
                        ? 'bg-white text-[#252525] shadow-xs'
                        : 'text-[#77736C]'
                    }`}
                  >
                    All ({attendees.length})
                  </button>
                  <button
                    onClick={() => setAttendeeSelectionMode('custom')}
                    data-testid="attendee-mode-custom"
                    className={`px-2 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                      attendeeSelectionMode === 'custom'
                        ? 'bg-white text-[#252525] shadow-xs'
                        : 'text-[#77736C]'
                    }`}
                  >
                    Custom
                  </button>
                </div>
              </div>

              {attendeeSelectionMode === 'custom' && (
                <div className="border border-[#E9E5DC] rounded-xl overflow-hidden bg-white">
                  {/* Search and Batch Actions Bar */}
                  <div className="p-2 border-b border-[#E9E5DC] bg-[#FAF8F5] flex items-center justify-between gap-2">
                    <div className="relative flex-1 max-w-xs">
                      <Search className="w-3.5 h-3.5 text-[#77736C] absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name, email, tier..."
                        className="w-full pl-8 pr-3 py-1 bg-white border border-[#DDD8CD] rounded-lg text-xs focus:outline-none focus:border-[#B86E52]"
                      />
                    </div>
                    <div className="flex items-center gap-2 text-xs shrink-0">
                      <button
                        onClick={selectAllAttendees}
                        className="text-[#B86E52] hover:underline font-semibold cursor-pointer"
                      >
                        Select All
                      </button>
                      <span className="text-[#DDD8CD]">•</span>
                      <button
                        onClick={clearAttendees}
                        className="text-[#77736C] hover:text-[#252525] cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  {/* Scrollable list */}
                  <div className="max-h-48 overflow-y-auto divide-y divide-[#F0EDE6] p-1">
                    {filteredAttendees.map((att) => {
                      const isChecked = selectedAttendeeIds.includes(att.id);
                      return (
                        <div
                          key={att.id}
                          data-testid={`attendee-row-${att.id}`}
                          onClick={() => toggleAttendee(att.id)}
                          className="px-3 py-2 flex items-center justify-between gap-2 hover:bg-[#FAF8F5] cursor-pointer select-none rounded-lg"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {isChecked ? (
                              <CheckSquare className="w-4 h-4 text-[#B86E52] shrink-0" />
                            ) : (
                              <Square className="w-4 h-4 text-[#DDD8CD] shrink-0" />
                            )}
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-[#252525] truncate">
                                {att.name}
                              </p>
                              <p className="text-[10px] text-[#77736C] truncate">{att.email}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0 text-[10px]">
                            <span className="px-2 py-0.5 rounded-full bg-[#FAF8F5] border border-[#E9E5DC] text-[#504D47] font-medium">
                              {att.ticketType}
                            </span>
                            <span className="text-[#77736C] font-mono hidden sm:inline">
                              {att.seat || 'Open Seating'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {effectiveAttendeeIds.length === 0 && (
                <p className="text-[11px] text-[#A83232] mt-1.5 font-medium">
                  ⚠️ At least one attendee must be selected.
                </p>
              )}
            </div>

            {/* 3. Output Estimate Banner */}
            <div
              data-testid="batch-estimate-banner"
              className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E9E5DC] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#77736C]">
                  Expected Generation Batch
                </span>
                <p className="text-sm font-bold text-[#252525] mt-0.5">
                  {effectiveAttendeeIds.length} Attendees × {selectedFormats.length} Formats ={' '}
                  <span className="text-[#B86E52] font-mono">{totalExpectedOutputs} Tickets</span>
                </p>
                <p className="text-[11px] text-[#77736C] mt-0.5">
                  Packaged into organized directories (
                  {selectedFormats.join(', ')}) with{' '}
                  <code className="text-[#252525]">manifest.json</code>.
                </p>
              </div>

              <button
                onClick={handleStartGeneration}
                data-testid="start-bulk-generate-btn"
                disabled={submitting || totalExpectedOutputs === 0}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#B86E52] hover:bg-[#A15D43] transition-all cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                <Sparkles className="w-4 h-4" />
                <span>{submitting ? 'Initiating...' : `Generate ${totalExpectedOutputs} Tickets`}</span>
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 2: GENERATION PROGRESS */}
        {/* ======================================================== */}
        {step === 'progress' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#FBF2EE] border border-[#F0D5C9] flex items-center justify-center text-[#B86E52] mx-auto animate-pulse">
                <RotateCw className="w-6 h-6 animate-spin" />
              </div>
              <h4 className="text-base font-bold text-[#252525]">
                Compiling Tickets with Hyper Elements...
              </h4>
              <p className="text-xs text-[#77736C]">
                Rendering personalized passes concurrently using controlled worker pool.
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-[#77736C]">Generation Progress</span>
                <span className="font-bold text-[#252525]">
                  {jobProgress?.progressPercent ?? 0}%
                </span>
              </div>
              <div className="w-full h-3 bg-[#FAF8F5] border border-[#E9E5DC] rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-[#B86E52] rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${jobProgress?.progressPercent ?? 5}%` }}
                />
              </div>
            </div>

            {/* Counters Grid */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-3 bg-[#FAF8F5] border border-[#E9E5DC] rounded-xl">
                <span className="text-[10px] uppercase font-bold text-[#77736C] block">
                  Completed
                </span>
                <span className="text-lg font-bold text-[#2E683E] font-mono">
                  {jobProgress?.completedTasks ?? 0}
                </span>
              </div>
              <div className="p-3 bg-[#FAF8F5] border border-[#E9E5DC] rounded-xl">
                <span className="text-[10px] uppercase font-bold text-[#77736C] block">
                  Pending
                </span>
                <span className="text-lg font-bold text-[#945B0E] font-mono">
                  {jobProgress?.pendingTasks ?? 0}
                </span>
              </div>
              <div className="p-3 bg-[#FAF8F5] border border-[#E9E5DC] rounded-xl">
                <span className="text-[10px] uppercase font-bold text-[#77736C] block">Failed</span>
                <span className="text-lg font-bold text-[#A83232] font-mono">
                  {jobProgress?.failedTasks ?? 0}
                </span>
              </div>
              <div className="p-3 bg-[#FAF8F5] border border-[#E9E5DC] rounded-xl">
                <span className="text-[10px] uppercase font-bold text-[#77736C] block">Total</span>
                <span className="text-lg font-bold text-[#252525] font-mono">
                  {jobProgress?.totalTasks ?? totalExpectedOutputs}
                </span>
              </div>
            </div>

            {/* Active task ticker */}
            <div className="bg-[#FAF8F5] border border-[#E9E5DC] rounded-xl p-3 max-h-36 overflow-y-auto text-[11px] font-mono space-y-1 text-[#77736C]">
              {jobProgress?.tasks?.slice(-5).map((t) => (
                <div key={t.taskId} className="flex items-center justify-between gap-2">
                  <span className="truncate">
                    [{t.format.toUpperCase()}] {t.attendeeName}
                  </span>
                  <span
                    className={`font-semibold ${
                      t.status === 'COMPLETED'
                        ? 'text-[#2E683E]'
                        : t.status === 'FAILED'
                        ? 'text-[#A83232]'
                        : 'text-[#945B0E]'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-center">
              <button
                onClick={handleCancelJob}
                className="text-xs text-[#77736C] hover:text-[#A83232] transition-colors cursor-pointer"
              >
                Cancel Generation
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 3: RESULTS & DOWNLOAD */}
        {/* ======================================================== */}
        {step === 'results' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Terminal Status Card */}
            {jobProgress?.status === 'COMPLETED' && (
              <div className="p-4 rounded-xl bg-[#EEF6F0] border border-[#C6E2CD] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#C6E2CD] flex items-center justify-center text-[#2E683E] shrink-0">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#2E683E]">
                    Bulk Generation Complete!
                  </h4>
                  <p className="text-xs text-[#504D47] mt-0.5">
                    All {jobProgress.completedTasks} ticket files generated successfully and packaged into an organized ZIP archive.
                  </p>
                </div>
              </div>
            )}

            {jobProgress?.status === 'COMPLETED_WITH_ERRORS' && (
              <div className="p-4 rounded-xl bg-[#FDF6E8] border border-[#F3E0BA] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#F3E0BA] flex items-center justify-center text-[#945B0E] shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#945B0E]">
                    Completed with {jobProgress.failedTasks} Failure(s)
                  </h4>
                  <p className="text-xs text-[#504D47] mt-0.5">
                    {jobProgress.completedTasks} tickets were generated successfully and are ready to download. You can retry the failed items below.
                  </p>
                </div>
              </div>
            )}

            {jobProgress?.status === 'FAILED' && (
              <div className="p-4 rounded-xl bg-[#FDF0F0] border border-[#F5CCCC] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#F5CCCC] flex items-center justify-center text-[#A83232] shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#A83232]">
                    Generation Failed
                  </h4>
                  <p className="text-xs text-[#504D47] mt-0.5">
                    None of the requested tickets could be compiled. Please check the logs or retry.
                  </p>
                </div>
              </div>
            )}

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-[#FAF8F5] border border-[#E9E5DC] rounded-xl">
                <span className="text-[10px] uppercase font-bold text-[#77736C] block">
                  Successful
                </span>
                <span className="text-lg font-bold text-[#2E683E] font-mono">
                  {jobProgress?.completedTasks ?? 0}
                </span>
              </div>
              <div className="p-3 bg-[#FAF8F5] border border-[#E9E5DC] rounded-xl">
                <span className="text-[10px] uppercase font-bold text-[#77736C] block">
                  Failed
                </span>
                <span className="text-lg font-bold text-[#A83232] font-mono">
                  {jobProgress?.failedTasks ?? 0}
                </span>
              </div>
              <div className="p-3 bg-[#FAF8F5] border border-[#E9E5DC] rounded-xl">
                <span className="text-[10px] uppercase font-bold text-[#77736C] block">
                  Total
                </span>
                <span className="text-lg font-bold text-[#252525] font-mono">
                  {jobProgress?.totalTasks ?? 0}
                </span>
              </div>
            </div>

            {/* Failed Task List (if any) */}
            {jobProgress?.failedTaskList && jobProgress.failedTaskList.length > 0 && (
              <div className="border border-[#F5CCCC] rounded-xl overflow-hidden bg-white">
                <div className="p-2.5 bg-[#FDF0F0] border-b border-[#F5CCCC] text-xs font-bold text-[#A83232] flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Failed Output Details ({jobProgress.failedTaskList.length})</span>
                </div>
                <div className="max-h-36 overflow-y-auto divide-y divide-[#FDF0F0] p-2 text-xs">
                  {jobProgress.failedTaskList.map((ft) => (
                    <div key={ft.taskId} className="py-1.5 flex items-start justify-between gap-2">
                      <div>
                        <span className="font-semibold text-[#252525]">{ft.attendeeName}</span>{' '}
                        <span className="font-mono text-[10px] text-[#77736C]">
                          ({ft.format})
                        </span>
                        {ft.error && (
                          <p className="text-[10px] text-[#A83232] font-mono mt-0.5">
                            {ft.error}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              {jobProgress && jobProgress.completedTasks > 0 && (
                <a
                  href={`/api/bulk/${jobId}/download`}
                  download
                  data-testid="download-bulk-zip-btn"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white bg-[#B86E52] hover:bg-[#A15D43] transition-all cursor-pointer shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Download ZIP Archive ({jobProgress.completedTasks} Tickets)</span>
                </a>
              )}

              {jobProgress && jobProgress.failedTasks > 0 && (
                <button
                  onClick={handleRetryFailed}
                  data-testid="retry-failed-btn"
                  disabled={retrying}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#B86E52] bg-[#FAF8F5] hover:bg-white border border-[#E9E5DC] hover:border-[#B86E52] transition-all cursor-pointer"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${retrying ? 'animate-spin' : ''}`} />
                  <span>{retrying ? 'Retrying...' : `Retry ${jobProgress.failedTasks} Failed Output(s)`}</span>
                </button>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handleResetExport}
                  className="text-xs text-[#77736C] hover:text-[#252525] cursor-pointer"
                >
                  ← Configure New Export
                </button>
                <button
                  onClick={onClose}
                  data-testid="close-modal-done-btn"
                  className="px-4 py-2 text-xs font-semibold text-[#504D47] hover:text-[#252525] bg-[#FAF8F5] hover:bg-white rounded-lg border border-[#E9E5DC] cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
