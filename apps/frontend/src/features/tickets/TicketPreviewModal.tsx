import React, { useState, useEffect, useRef } from 'react';
import { AttendeeInfo, OutputFormat, TicketData, RenderResult } from '@passforge/shared';
import { generateTicket } from '../../services/api.js';
import { formatBytes } from '../../lib/utils.js';
import {
  ArrowLeft,
  Download,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Info,
  X,
  RefreshCw,
  ShieldCheck,
  Globe,
  Mail,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';

interface TicketPreviewModalProps {
  attendee: AttendeeInfo | null;
  isOpen: boolean;
  onClose: () => void;
  eventName?: string;
}

export const TicketPreviewModal: React.FC<TicketPreviewModalProps> = ({
  attendee,
  isOpen,
  onClose,
  eventName = 'Apex Global Summit 2027',
}) => {
  const [activeFormat, setActiveFormat] = useState<OutputFormat>('png');
  const [loading, setLoading] = useState(false);
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [results, setResults] = useState<Partial<Record<OutputFormat, RenderResult>>>({});
  const [timestamp, setTimestamp] = useState<number>(Date.now());
  const [zoom, setZoom] = useState<number>(100);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && attendee) {
      handleGenerateAll();
      setZoom(100);
      setShowDetails(false);
    }
  }, [isOpen, attendee]);

  // Keyboard navigation & zoom shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      } else if ((e.ctrlKey || e.metaKey) && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        setZoom((z) => Math.min(200, z + 15));
      } else if ((e.ctrlKey || e.metaKey) && (e.key === '-' || e.key === '_')) {
        e.preventDefault();
        setZoom((z) => Math.max(50, z - 15));
      } else if ((e.ctrlKey || e.metaKey) && e.key === '0') {
        e.preventDefault();
        setZoom(100);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFullscreen, onClose]);

  const handleGenerateAll = async () => {
    if (!attendee) return;
    setLoading(true);
    try {
      const res = await generateTicket('all', attendee.id);
      if (res.results) setResults(res.results);
      if (res.ticket) setTicketData(res.ticket);
      setTimestamp(Date.now());
    } catch (err: any) {
      console.error('Failed to generate tickets for attendee:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSingle = async (format: OutputFormat) => {
    if (!attendee) return;
    setLoading(true);
    try {
      const res = await generateTicket(format, attendee.id);
      if (res.result) {
        setResults((prev) => ({ ...prev, [format]: res.result }));
      }
      if (res.ticket) setTicketData(res.ticket);
      setTimestamp(Date.now());
    } catch (err: any) {
      console.error(`Failed to generate ${format} ticket:`, err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !attendee) return null;

  const ticketId = ticketData?.ticketId || 'APX27-VIP-84920';
  const curResult = results[activeFormat];

  const formatTabs: { id: OutputFormat; label: string; icon: React.ReactNode }[] = [
    { id: 'page', label: 'Web', icon: <Globe className="w-3.5 h-3.5" /> },
    { id: 'email', label: 'Email', icon: <Mail className="w-3.5 h-3.5" /> },
    { id: 'pdf', label: 'PDF', icon: <FileText className="w-3.5 h-3.5" /> },
    { id: 'png', label: 'PNG', icon: <ImageIcon className="w-3.5 h-3.5" /> },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-md select-none animate-fade-in"
      style={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0 }}
    >
      {/* Backdrop overlay click dismiss */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        title="Click to close"
      />

      {/* Main Full-Screen Design Inspector Container (95vw × 95vh) */}
      <div
        className={`relative z-10 w-[96vw] max-w-[1720px] ${
          isFullscreen ? 'w-screen h-screen max-w-none rounded-none' : 'h-[95vh] rounded-[24px]'
        } bg-[#FAFAFA] border border-[#EAEAEA] shadow-2xl flex flex-col overflow-hidden transition-all duration-200`}
        style={{
          width: isFullscreen ? '100vw' : '96vw',
          height: isFullscreen ? '100vh' : '95vh',
          maxWidth: isFullscreen ? 'none' : '1720px',
          backgroundColor: '#FAFAFA',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* STICKY TOP TOOLBAR (Minimal Chrome: Back, Template, Format, Zoom, Download) */}
        <header className="h-14 sm:h-16 px-4 sm:px-6 bg-white border-b border-[#EAEAEA] flex items-center justify-between shrink-0 gap-3 z-20">
          {/* Left: Back Action & Template Information */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onClose}
              className="p-2 -ml-2 rounded-xl text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors inline-flex items-center gap-1.5 cursor-pointer shrink-0"
              title="Back to Studio (Esc)"
              aria-label="Back to Studio"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-xs font-semibold hidden sm:inline">Back</span>
            </button>

            <div className="h-4 w-px bg-[#EAEAEA] shrink-0" />

            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm font-bold text-neutral-900 truncate tracking-tight">
                Pass Inspector
              </h2>
              <p className="text-[11px] text-neutral-500 truncate">
                {eventName} • {attendee.name}
              </p>
            </div>
          </div>

          {/* Center: Segmented Format Selector (Web | Email | PDF | PNG) */}
          <div className="hidden md:inline-flex p-1 rounded-xl bg-neutral-100 border border-neutral-200/80 shrink-0">
            {formatTabs.map((tab) => {
              const isActive = activeFormat === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFormat(tab.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                      : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right: Zoom Controls, Download, Fullscreen & Details Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Zoom Controls */}
            <div className="hidden lg:flex items-center bg-neutral-100 rounded-xl p-0.5 border border-neutral-200/80">
              <button
                onClick={() => setZoom((z) => Math.max(50, z - 15))}
                className="p-1.5 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-white transition-colors cursor-pointer"
                title="Zoom Out (Ctrl -)"
                aria-label="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setZoom(100)}
                className="px-2 py-1 text-[11px] font-mono font-medium text-neutral-700 hover:text-neutral-900 hover:bg-white rounded-md transition-colors cursor-pointer min-w-[48px] text-center"
                title="Reset to 100% (Ctrl 0)"
              >
                {zoom}%
              </button>

              <button
                onClick={() => setZoom((z) => Math.min(200, z + 15))}
                className="p-1.5 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-white transition-colors cursor-pointer"
                title="Zoom In (Ctrl +)"
                aria-label="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>

              <div className="h-3 w-px bg-neutral-300 mx-0.5" />

              <button
                onClick={() => setZoom(100)}
                className="px-2 py-1 text-[10px] font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-white rounded-md transition-colors cursor-pointer"
                title="Fit to Screen"
              >
                Fit
              </button>
            </div>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer hidden sm:flex items-center justify-center"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Canvas'}
              aria-label="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Technical Details Toggle */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className={`p-2 rounded-xl transition-colors cursor-pointer flex items-center justify-center ${
                showDetails
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
              title="View Technical Details"
              aria-label="View Technical Details"
            >
              <Info className="w-4 h-4" />
            </button>

            {/* Primary Download Button */}
            <a
              href={`/api/download/${activeFormat}?ticketId=${ticketId}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold transition-all shadow-xs hover:shadow-md cursor-pointer shrink-0"
              title={`Download ${activeFormat.toUpperCase()} Pass`}
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
              <span className="uppercase text-[11px] font-mono text-neutral-300">{activeFormat}</span>
            </a>

            {/* Raw External Preview in New Tab */}
            <a
              href={`/api/preview/${activeFormat}?ticketId=${ticketId}`}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 border border-neutral-200 transition-colors hidden sm:flex items-center justify-center"
              title="Open raw preview in new tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </header>

        {/* Mobile Format Selector Bar (< 768px) */}
        <div className="md:hidden px-3 py-2 bg-white border-b border-[#EAEAEA] flex items-center justify-center">
          <div className="inline-flex p-1 rounded-xl bg-neutral-100 border border-neutral-200/80 w-full justify-around">
            {formatTabs.map((tab) => {
              const isActive = activeFormat === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFormat(tab.id)}
                  className={`flex-1 py-1.5 text-center text-xs font-medium rounded-lg transition-all ${
                    isActive
                      ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                      : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* DEDICATED DESIGN CANVAS (80-90% Space, Neutral #F5F5F5 Background) */}
        <main
          ref={canvasRef}
          className="flex-1 min-h-0 bg-[#F5F5F5] overflow-auto flex items-center justify-center p-4 sm:p-8 relative"
          style={{ backgroundColor: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center space-y-3 py-20 text-neutral-500">
              <div className="w-8 h-8 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-semibold text-neutral-700">
                Rendering ticket with Hyper Elements SSR...
              </p>
            </div>
          ) : (
            /* Zoomable Canvas Target */
            <div
              className="transition-transform duration-150 ease-out flex items-center justify-center max-w-full"
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'center center',
              }}
            >
              {activeFormat === 'page' ? (
                /* WEB PASS: Dark Browser-Style Window Frame */
                <div
                  className="w-[820px] max-w-[88vw] rounded-2xl bg-[#1E1E1E] border border-neutral-700/80 shadow-2xl overflow-hidden flex flex-col"
                  style={{ width: 'min(820px, 88vw)', maxWidth: '88vw', backgroundColor: '#1E1E1E' }}
                >
                  {/* Browser Window Header Bar */}
                  <div
                    className="h-9 px-4 bg-[#2A2A2A] border-b border-[#3A3A3A] flex items-center justify-between shrink-0"
                    style={{ backgroundColor: '#2A2A2A' }}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                    </div>
                    {/* URL Pill */}
                    <div className="px-4 py-0.5 rounded-md bg-[#1E1E1E] text-neutral-400 font-mono text-[11px] border border-neutral-700 flex items-center gap-1.5 max-w-xs truncate">
                      <Globe className="w-3 h-3 text-neutral-500 shrink-0" />
                      <span className="truncate">passforge.event/pass/{ticketId}</span>
                    </div>
                    <div className="w-8" />
                  </div>

                  {/* Browser Viewport */}
                  <iframe
                    src={`/api/preview/page?ticketId=${ticketId}&t=${timestamp}`}
                    title="Web Pass Live Preview"
                    className="w-full bg-white border-none block"
                    style={{ height: 'min(580px, 68vh)', maxHeight: '68vh' }}
                  />
                </div>
              ) : activeFormat === 'email' ? (
                /* EMAIL INVITE: Inbox-Style Client Frame */
                <div
                  className="w-[720px] max-w-[88vw] rounded-2xl bg-white border border-[#EAEAEA] shadow-2xl overflow-hidden flex flex-col"
                  style={{ width: 'min(720px, 88vw)', maxWidth: '88vw', backgroundColor: '#FFFFFF' }}
                >
                  {/* Email Client Top Bar */}
                  <div className="p-3.5 bg-[#FAF8F5] border-b border-[#EAEAEA] flex items-center justify-between text-xs text-neutral-600 shrink-0">
                    <div className="space-y-0.5 min-w-0">
                      <p className="font-semibold text-neutral-900 truncate">
                        Subject: Your Pass for {eventName}
                      </p>
                      <p className="text-[11px] text-neutral-500 font-mono">
                        From: tickets@{eventName.toLowerCase().replace(/[^a-z0-9]/g, '')}.org
                      </p>
                    </div>
                    <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-white text-neutral-500 border border-neutral-200 shrink-0">
                      HTML Tables
                    </span>
                  </div>

                  {/* Email Content Frame */}
                  <iframe
                    src={`/api/preview/email?ticketId=${ticketId}&t=${timestamp}`}
                    title="Email Invite Live Preview"
                    className="w-full bg-white border-none block"
                    style={{ height: 'min(600px, 68vh)', maxHeight: '68vh' }}
                  />
                </div>
              ) : activeFormat === 'pdf' ? (
                /* PRINT PDF: Realistic A4 Sheet with Realistic Paper Shadow */
                <div
                  className="w-[760px] max-w-[88vw] bg-white rounded-sm shadow-[0_24px_64px_rgba(0,0,0,0.18)] border border-neutral-200 overflow-hidden"
                  style={{ width: 'min(760px, 88vw)', maxWidth: '88vw', backgroundColor: '#FFFFFF' }}
                >
                  <iframe
                    src={`/api/preview/pdf?ticketId=${ticketId}&t=${timestamp}#toolbar=0`}
                    title="Print PDF Live Preview"
                    className="w-full bg-white border-none block"
                    style={{ height: 'min(780px, 72vh)', maxHeight: '72vh' }}
                  />
                </div>
              ) : (
                /* CANVAS PNG: High-Resolution Badge */
                <div
                  className="flex items-center justify-center p-2 sm:p-4 max-w-full"
                  style={{ width: 'min(860px, 88vw)', maxWidth: '88vw' }}
                >
                  <img
                    src={`/api/preview/png?ticketId=${ticketId}&t=${timestamp}`}
                    alt="High-Res Pass PNG"
                    className="rounded-2xl shadow-2xl border border-neutral-200/80 bg-white block"
                    style={{
                      maxWidth: '100%',
                      maxHeight: 'min(520px, 68vh)',
                      width: 'auto',
                      height: 'auto',
                      objectFit: 'contain',
                      display: 'block',
                      borderRadius: '16px',
                      boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.22)',
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* COLLAPSIBLE TECHNICAL INFORMATION DRAWER */}
          {showDetails && (
            <div className="absolute bottom-6 right-6 z-30 w-80 bg-white/95 backdrop-blur-md rounded-2xl border border-[#EAEAEA] shadow-2xl p-4 text-xs space-y-3 animate-fade-in select-none">
              <div className="flex items-center justify-between pb-2 border-b border-[#EAEAEA]">
                <div className="flex items-center gap-1.5 font-bold text-neutral-900">
                  <Info className="w-3.5 h-3.5 text-neutral-600" />
                  <span>Technical Specs</span>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1.5 text-neutral-600 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-neutral-400 font-sans">Attendee:</span>
                  <span className="font-semibold text-neutral-900 font-sans truncate max-w-[150px]">
                    {attendee.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400 font-sans">Tier:</span>
                  <span className="text-neutral-800">{attendee.ticketType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400 font-sans">Seat:</span>
                  <span className="text-neutral-800">{attendee.seat || 'Open Seating'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400 font-sans">Reference:</span>
                  <span className="text-neutral-800">{ticketId}</span>
                </div>
                {curResult?.renderTimeMs && (
                  <div className="flex justify-between">
                    <span className="text-neutral-400 font-sans">Render Time:</span>
                    <span className="text-neutral-800">{curResult.renderTimeMs} ms</span>
                  </div>
                )}
                {curResult?.sizeBytes && (
                  <div className="flex justify-between">
                    <span className="text-neutral-400 font-sans">File Size:</span>
                    <span className="text-neutral-800">{formatBytes(curResult.sizeBytes)}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-[#EAEAEA] flex items-center justify-between">
                <div className="flex items-center gap-1 text-emerald-700 text-[11px] font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>SSR Verified</span>
                </div>

                <button
                  onClick={() => handleGenerateSingle(activeFormat)}
                  disabled={loading}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-700 hover:text-neutral-900 cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                  <span>Regenerate</span>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
