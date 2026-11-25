import React, { useState, useEffect, useRef } from 'react';
import {
  OutputFormat,
  TicketData,
  AttendeeInfo,
} from '@passforge/shared';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Expand,
  Shrink,
  Smartphone,
  Monitor,
  User,
  Image as ImageIcon,
  Globe,
  Mail,
  FileText,
  Download,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { formatBytes } from '../../lib/utils.js';

interface LiveCanvasProps {
  activeFormat: OutputFormat;
  onSelectFormat: (format: OutputFormat) => void;
  isMobileView: boolean;
  onToggleMobileView: (mobile: boolean) => void;
  loading: boolean;
  previewData: {
    ticket?: TicketData;
    pngDataUrl?: string;
    emailHtml?: string;
    pageHtml?: string;
    pdfUrl?: string;
    results?: any;
  } | null;
  designName: string;
  attendees: AttendeeInfo[];
  selectedAttendeeId?: string;
  onSelectAttendee: (id: string | undefined) => void;
  onRefresh?: () => void;
  onOpenInspector?: () => void;
}

export const LiveCanvas: React.FC<LiveCanvasProps> = ({
  activeFormat,
  onSelectFormat,
  isMobileView,
  onToggleMobileView,
  loading,
  previewData,
  designName,
  attendees,
  selectedAttendeeId,
  onSelectAttendee,
  onRefresh,
  onOpenInspector,
}) => {
  const [zoom, setZoom] = useState<number>(1.0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [pageHeight, setPageHeight] = useState<number>(540);
  const [emailHeight, setEmailHeight] = useState<number>(520);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const pageIframeRef = useRef<HTMLIFrameElement>(null);
  const emailIframeRef = useRef<HTMLIFrameElement>(null);

  const ticket = previewData?.ticket;
  const ticketId = ticket?.ticketId || 'KTF27-VIP-84920';
  const curResult = previewData?.results?.[activeFormat];

  const currentAttendee =
    attendees.find((a) => a.id === selectedAttendeeId) ||
    ticket?.attendee ||
    attendees[0];

  const getTierBadgeStyle = (tier?: string) => {
    const t = (tier || '').toLowerCase();
    if (t.includes('vip')) return 'bg-[#FBF2EE] text-[#B86E52] border-[#F0D5C9]';
    if (t.includes('speaker')) return 'bg-[#F3E8FF] text-[#7E22CE] border-[#E9D5FF]';
    if (t.includes('student')) return 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]';
    return 'bg-[#F1F5F9] text-[#475569] border-[#CBD5E1]';
  };

  // Zoom controls
  const handleZoomIn = () => setZoom((prev) => Math.min(1.5, Number((prev + 0.1).toFixed(1))));
  const handleZoomOut = () => setZoom((prev) => Math.max(0.6, Number((prev - 0.1).toFixed(1))));
  const handleZoomFit = () => setZoom(1.0);

  // Security-checked listener for iframe resize postMessages
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (!e.data || e.data.type !== 'PASSFORGE_IFRAME_RESIZE' || typeof e.data.height !== 'number') {
        return;
      }

      // Add 24px safety buffer to prevent 1px rounding subpixel inner scrollbars
      const validHeight = Math.min(Math.max(Math.round(e.data.height) + 24, 350), 4500);

      if (e.data.format === 'page') {
        setPageHeight(validHeight);
      } else if (e.data.format === 'email') {
        setEmailHeight(validHeight);
      } else {
        // Fallback matching by active window reference
        if (pageIframeRef.current && e.source === pageIframeRef.current.contentWindow) {
          setPageHeight(validHeight);
        } else if (emailIframeRef.current && e.source === emailIframeRef.current.contentWindow) {
          setEmailHeight(validHeight);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Content-aware direct DOM measurement on iframe load & resize
  const measureIframe = (iframe: HTMLIFrameElement | null, format: 'page' | 'email') => {
    if (!iframe) return;
    try {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) return;

      const compute = () => {
        const body = doc.body;
        const html = doc.documentElement;
        if (!body && !html) return;
        const h = Math.max(
          body?.scrollHeight || 0,
          body?.offsetHeight || 0,
          body?.clientHeight || 0,
          html?.scrollHeight || 0,
          html?.offsetHeight || 0
        );
        if (h > 200) {
          const finalH = h + 24;
          if (format === 'page') setPageHeight(finalH);
          if (format === 'email') setEmailHeight(finalH);
        }
      };

      compute();

      if (doc.fonts && doc.fonts.ready) {
        doc.fonts.ready.then(compute).catch(() => { });
      }

      if (typeof ResizeObserver !== 'undefined' && doc.body) {
        const observer = new ResizeObserver(() => compute());
        observer.observe(doc.body);
        if (doc.documentElement) observer.observe(doc.documentElement);
      }
    } catch {
      // In case of restricted DOM access, the postMessage listener provides fallback
    }
  };

  // Safely inject measurement script into srcDoc HTML without modifying the underlying template
  const prepareHtmlWithResizeScript = (rawHtml?: string, format: 'page' | 'email' = 'page') => {
    if (!rawHtml) return undefined;
    const script = `
      <style>
        /* Smooth scrolling inside preview frames */
        html, body {
          margin: 0;
          padding: 0;
          overflow-y: auto !important;
          overflow-x: hidden !important;
        }
      </style>
      <script>
        (function() {
          function sendH() {
            var b = document.body;
            var d = document.documentElement;
            if (!b && !d) return;
            var h = Math.max(
              b ? b.scrollHeight : 0,
              b ? b.offsetHeight : 0,
              b ? b.clientHeight : 0,
              d ? d.scrollHeight : 0,
              d ? d.offsetHeight : 0
            );
            if (h > 0) {
              window.parent.postMessage({ type: 'PASSFORGE_IFRAME_RESIZE', format: '${format}', height: h }, '*');
            }
          }
          window.addEventListener('load', sendH);
          window.addEventListener('resize', sendH);
          if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(sendH).catch(function() {});
          }
          if (window.ResizeObserver && document.body) {
            new ResizeObserver(sendH).observe(document.body);
            if (document.documentElement) new ResizeObserver(sendH).observe(document.documentElement);
          }
          if (document.readyState === 'complete' || document.readyState === 'interactive') {
            sendH();
          } else {
            document.addEventListener('DOMContentLoaded', sendH);
          }
          setTimeout(sendH, 60);
          setTimeout(sendH, 180);
          setTimeout(sendH, 450);
          setTimeout(sendH, 1000);
        })();
      </script>
    `;

    if (rawHtml.includes('</body>')) {
      return rawHtml.replace('</body>', `${script}</body>`);
    }
    return rawHtml + script;
  };

  // Native Fullscreen API integration with fallback & fit-to-screen recalculation
  useEffect(() => {
    const onFullscreenChange = () => {
      const isNativeFs = Boolean(document.fullscreenElement);
      setIsFullscreen(isNativeFs);
      setZoom(1.0);
    };

    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', onFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    const container = canvasContainerRef.current;
    if (!container) return;

    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch {
        setIsFullscreen(false);
        setZoom(1.0);
      }
    } else if (container.requestFullscreen) {
      try {
        await container.requestFullscreen();
      } catch {
        // Fallback to CSS maximized mode if native request is rejected or unavailable
        setIsFullscreen((prev) => {
          const next = !prev;
          setZoom(1.0);
          return next;
        });
      }
    } else {
      // Fallback for browsers without requestFullscreen
      setIsFullscreen((prev) => {
        const next = !prev;
        setZoom(1.0);
        return next;
      });
    }
  };

  // Escape key fallback
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => { });
        } else if (isFullscreen) {
          setIsFullscreen(false);
          setZoom(1.0);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const formats: { id: OutputFormat; label: string; tooltip: string; icon: React.ReactNode }[] = [
    { id: 'page', label: 'Web Page', tooltip: 'Responsive digital ticket', icon: <Globe className="w-3.5 h-3.5" /> },
    { id: 'email', label: 'Email', tooltip: 'HTML invitation suitable for email delivery', icon: <Mail className="w-3.5 h-3.5" /> },
    { id: 'pdf', label: 'PDF', tooltip: 'Printable ticket document', icon: <FileText className="w-3.5 h-3.5" /> },
    { id: 'png', label: 'PNG Image', tooltip: 'High-resolution ticket image', icon: <ImageIcon className="w-3.5 h-3.5" /> },
  ];

  return (
    <div
      ref={canvasContainerRef}
      className={`flex flex-col bg-[#F0EDE6] rounded-2xl border border-[#E9E5DC] overflow-hidden transition-all duration-200 ${isFullscreen
          ? 'fixed inset-0 z-50 rounded-none border-0 p-4 sm:p-6 bg-[#EFECE4]'
          : 'flex-1 h-full min-h-0 shadow-sm'
        }`}
    >
      {/* Canvas Top Bar: Segmented Format Selector, Attendee Picker & Viewport Controls */}
      <div className="bg-white px-3 sm:px-4 py-2 border-b border-[#E9E5DC] flex flex-wrap items-center justify-between gap-2 shrink-0">
        {/* Left: Segmented Format Switcher */}
        <div className="flex items-center gap-1 bg-[#FAF8F5] p-1 rounded-xl border border-[#E9E5DC] overflow-x-auto max-w-full shrink-0">
          {formats.map((f) => {
            const isActive = activeFormat === f.id;
            return (
              <button
                key={f.id}
                data-testid={`format-tab-${f.id}`}
                onClick={() => onSelectFormat(f.id)}
                title={f.tooltip}
                className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${isActive
                    ? 'bg-[#B86E52] text-white shadow-xs'
                    : 'text-[#77736C] hover:text-[#252525] hover:bg-[#F0EDE6]'
                  }`}
              >
                {f.icon}
                <span className="text-[11px] sm:text-xs">{f.label}</span>
              </button>
            );
          })}
        </div>

        {/* Center: Attendee Switcher with Tier & Seat Badges */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 bg-[#FAF8F5] border border-[#DDD8CD] rounded-lg pl-2 pr-1 py-1 focus-within:border-[#B86E52] transition-colors">
            <User className="w-3.5 h-3.5 text-[#B86E52] shrink-0" />
            <select
              value={selectedAttendeeId || ''}
              onChange={(e) => onSelectAttendee(e.target.value || undefined)}
              className="bg-transparent text-[#252525] text-xs font-semibold focus:outline-none cursor-pointer max-w-[130px] sm:max-w-[180px] truncate"
              title="Switch attendee to preview personalization"
            >
              {attendees.map((att) => (
                <option key={att.id || att.name} value={att.id || ''}>
                  {att.name} — [{att.ticketType}]
                </option>
              ))}
            </select>
          </div>

          {/* Active Attendee Badges (Tier & Seat) */}
          {currentAttendee && (
            <div className="hidden sm:flex items-center gap-1.5 shrink-0">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${getTierBadgeStyle(
                  currentAttendee.ticketType
                )}`}
                title={`Ticket Tier: ${currentAttendee.ticketType}`}
              >
                {currentAttendee.ticketType || 'General'}
              </span>
              <span
                className="text-[10px] font-mono text-[#555048] bg-white border border-[#E9E5DC] px-2 py-0.5 rounded-md"
                title={`Assigned Seat: ${currentAttendee.seat || 'Open Seating'}`}
              >
                Seat: {currentAttendee.seat || 'Open'}
              </span>
            </div>
          )}
        </div>

        {/* Right: Viewport Toggle, Zoom & Fullscreen Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Responsive Mobile/Desktop Toggle (for Web Pass) */}
          {activeFormat === 'page' && (
            <div className="flex items-center bg-[#FAF8F5] p-0.5 rounded-lg border border-[#E9E5DC] mr-1 shrink-0">
              <button
                onClick={() => onToggleMobileView(false)}
                className={`p-1 rounded text-xs transition-colors cursor-pointer shrink-0 ${!isMobileView ? 'bg-white text-[#252525] shadow-xs' : 'text-[#77736C]'
                  }`}
                title="Desktop Viewport"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onToggleMobileView(true)}
                className={`p-1 rounded text-xs transition-colors cursor-pointer shrink-0 ${isMobileView ? 'bg-white text-[#252525] shadow-xs' : 'text-[#77736C]'
                  }`}
                title="Mobile Viewport"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Zoom In / Out / Reset */}
          <div className="flex items-center bg-[#FAF8F5] p-1 rounded-lg border border-[#E9E5DC] shrink-0 gap-0.5">
            <button
              onClick={handleZoomOut}
              className="p-1 rounded text-[#77736C] hover:text-[#252525] hover:bg-white transition-colors cursor-pointer shrink-0"
              title="Zoom Out (-10%)"
              aria-label="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span
              className="text-[11px] font-mono font-semibold text-[#37352F] select-none text-center shrink-0"
              style={{ minWidth: '48px', display: 'inline-block' }}
            >
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1 rounded text-[#77736C] hover:text-[#252525] hover:bg-white transition-colors cursor-pointer shrink-0"
              title="Zoom In (+10%)"
              aria-label="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleZoomFit}
            className="p-1.5 rounded-lg border border-[#E9E5DC] bg-[#FAF8F5] text-[#77736C] hover:text-[#252525] hover:bg-white transition-colors cursor-pointer shrink-0"
            title="Reset Zoom to 100%"
            aria-label="Fit to Screen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg border border-[#E9E5DC] bg-[#FAF8F5] text-[#77736C] hover:text-[#252525] hover:bg-white transition-colors cursor-pointer shrink-0"
            title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Fullscreen Artboard'}
            aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Shrink className="w-3.5 h-3.5" /> : <Expand className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Artboard Canvas Area */}
      <div
        className={`flex-1 min-h-0 flex justify-center items-center p-3 sm:p-6 relative ${
          zoom > 1.0 ? 'overflow-auto' : 'overflow-hidden'
        }`}
        style={{
          backgroundColor: '#F5F2EB',
          backgroundImage: 'radial-gradient(#DDD8CD 1.2px, transparent 1.2px)',
          backgroundSize: '24px 24px',
        }}
      >
        {loading && (
          <div className="absolute inset-0 bg-[#F0EDE6]/80 backdrop-blur-xs z-20 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-[#B86E52] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-semibold text-[#252525]">
              Compiling Hyper Elements {activeFormat.toUpperCase()}...
            </p>
          </div>
        )}

        {/* Scalable Artboard Container */}
        <div
          className="transition-transform duration-150 ease-out origin-center flex flex-col items-center justify-center w-full max-w-full"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
        >
          {/* 1. Canvas PNG Format */}
          {activeFormat === 'png' && (
            <div className="flex flex-col items-center justify-center w-full max-w-full" style={{ width: 'min(100%, 780px)' }}>
              <div className="w-full max-w-full rounded-2xl overflow-hidden shadow-xl border border-[#DDD8CD] bg-white p-2 sm:p-3 flex items-center justify-center">
                <img
                  src={previewData?.pngDataUrl || `/api/preview/png?ticketId=${ticketId}&t=${Date.now()}`}
                  alt="Ticket PNG Preview"
                  className="max-w-full h-auto object-contain block mx-auto rounded-xl"
                  style={{
                    maxWidth: '100%',
                    maxHeight: 'min(460px, 58vh)',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
              </div>
              <p className="text-[10px] text-[#77736C] mt-2.5 font-mono text-center">
                Hyper Elements &lt;Canvas&gt; • High-Resolution Ticket Pass
              </p>
            </div>
          )}

          {/* 2. Responsive Web Page Format */}
          {activeFormat === 'page' && (
            <div
              className="flex flex-col items-center justify-center w-full max-w-full"
              style={{ width: isMobileView ? 'min(100%, 380px)' : 'min(100%, 740px)' }}
            >
              {isMobileView ? (
                // Realistic Smartphone Chassis
                <div
                  style={{
                    width: 'min(100%, 360px)',
                    height: 'min(520px, 60vh)',
                    maxWidth: '100%',
                    backgroundColor: '#0F172A',
                    borderRadius: '44px',
                    padding: '14px 10px 10px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
                    border: '4px solid #334155',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: '90px',
                      height: '18px',
                      backgroundColor: '#020617',
                      borderRadius: '9999px',
                      margin: '0 auto 10px',
                      flexShrink: 0,
                    }}
                  />
                  <iframe
                    ref={pageIframeRef}
                    title="Mobile Web Ticket Preview"
                    srcDoc={prepareHtmlWithResizeScript(previewData?.pageHtml, 'page')}
                    src={!previewData?.pageHtml ? `/api/preview/page?ticketId=${ticketId}` : undefined}
                    onLoad={() => measureIframe(pageIframeRef.current, 'page')}
                    scrolling="yes"
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '28px',
                      border: 'none',
                      backgroundColor: '#FFFFFF',
                      display: 'block',
                    }}
                  />
                  <div
                    style={{
                      width: '100px',
                      height: '4px',
                      backgroundColor: '#475569',
                      borderRadius: '9999px',
                      margin: '10px auto 2px',
                      flexShrink: 0,
                    }}
                  />
                </div>
              ) : (
                // Desktop Browser Frame
                <div
                  className="rounded-xl overflow-hidden border border-[#DDD8CD] shadow-xl bg-white flex flex-col w-full max-w-full"
                  style={{ width: '100%', height: 'min(480px, 58vh)' }}
                >
                  <div className="bg-[#FAF8F5] border-b border-[#E9E5DC] px-4 py-2.5 flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] inline-block" />
                    </div>
                    <div className="flex-1 max-w-xs mx-auto bg-white border border-[#E9E5DC] rounded px-3 py-1 text-[11px] font-mono text-[#77736C] text-center truncate">
                      passforge.app/tickets/{ticketId}
                    </div>
                  </div>
                  <iframe
                    ref={pageIframeRef}
                    title="Desktop Web Ticket Preview"
                    srcDoc={prepareHtmlWithResizeScript(previewData?.pageHtml, 'page')}
                    src={!previewData?.pageHtml ? `/api/preview/page?ticketId=${ticketId}` : undefined}
                    onLoad={() => measureIframe(pageIframeRef.current, 'page')}
                    scrolling="yes"
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                      display: 'block',
                    }}
                  />
                </div>
              )}
              <p className="text-[10px] text-[#77736C] mt-2.5 font-mono text-center">
                Hyper Elements &lt;Page&gt; • {isMobileView ? 'Mobile Viewport' : 'Desktop Viewport'}
              </p>
            </div>
          )}

          {/* 3. Email HTML Format */}
          {activeFormat === 'email' && (
            <div className="flex flex-col items-center w-full max-w-full" style={{ width: 'min(100%, 640px)' }}>
              <div
                className="rounded-xl overflow-hidden border border-[#DDD8CD] shadow-xl bg-white flex flex-col w-full max-w-full"
                style={{ width: '100%', height: 'min(480px, 58vh)' }}
              >
                <div className="bg-[#FAF8F5] border-b border-[#E9E5DC] px-4 py-2.5 text-xs text-[#504D47] flex flex-col gap-1 shrink-0">
                  <div className="flex justify-between items-center text-[10px]">
                    <span>
                      <strong className="text-[#252525]">From:</strong> events@passforge.local
                    </span>
                    <span className="font-mono text-[#9E9A90]">Today, 09:00 AM</span>
                  </div>
                  <div className="text-[10px]">
                    <strong className="text-[#252525]">To:</strong> {ticket?.attendee.email || 'alex.morgan@example.com'}
                  </div>
                </div>

                <iframe
                  ref={emailIframeRef}
                  title="Email HTML Preview"
                  srcDoc={prepareHtmlWithResizeScript(previewData?.emailHtml, 'email')}
                  src={!previewData?.emailHtml ? `/api/preview/email?ticketId=${ticketId}` : undefined}
                  onLoad={() => measureIframe(emailIframeRef.current, 'email')}
                  scrolling="yes"
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    display: 'block',
                  }}
                />
              </div>
              <p className="text-[10px] text-[#77736C] mt-2.5 font-mono text-center">
                Hyper Elements &lt;Email&gt; • Compatible Email HTML Tables
              </p>
            </div>
          )}

          {/* 4. Document PDF Format */}
          {activeFormat === 'pdf' && (
            <div className="flex flex-col items-center w-full max-w-full" style={{ width: 'min(100%, 760px)' }}>
              <div
                className="rounded-2xl overflow-hidden border border-[#DDD8CD] shadow-xl bg-[#525659] w-full max-w-full"
                style={{ width: '100%', height: 'min(500px, 60vh)' }}
              >
                <iframe
                  title="PDF Document Preview"
                  src={`/api/preview/pdf?ticketId=${ticketId}&t=${Date.now()}#toolbar=0&navpanes=0&scrollbar=0&view=Fit`}
                  style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                />
              </div>
              <p className="text-[10px] text-[#77736C] mt-2.5 font-mono text-center">
                Hyper Elements &lt;Document&gt; • Vector PDF Print Admission (A4 Portrait)
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Canvas Bottom Meta Bar */}
      <div className="bg-white px-4 py-2 border-t border-[#E9E5DC] flex items-center justify-between gap-3 text-xs shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-[#252525]">{designName}</span>
          <span className="text-[#C5BFB2]">|</span>
          <span className="text-[#77736C] font-mono text-[11px]">{ticketId}</span>
          {curResult?.sizeBytes && (
            <>
              <span className="text-[#C5BFB2] hidden sm:inline">|</span>
              <span className="text-[#77736C] font-mono text-[11px] hidden sm:inline">
                {formatBytes(curResult.sizeBytes)}
              </span>
            </>
          )}
          {curResult?.renderTimeMs && (
            <span className="text-[#2E683E] font-mono text-[11px] hidden sm:inline">
              ({curResult.renderTimeMs}ms)
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onOpenInspector && (
            <>
              <button
                onClick={onOpenInspector}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-700 hover:text-neutral-900 transition-colors cursor-pointer"
                title="Open Pass Inspector (Full Preview)"
              >
                <Maximize2 className="w-3 h-3 text-neutral-500" />
                <span>Pass Inspector</span>
              </button>
              <span className="text-[#C5BFB2]">•</span>
            </>
          )}
          <a
            href={`/api/download/${activeFormat}?ticketId=${ticketId}`}
            download
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#B86E52] hover:text-[#A15D43] transition-colors"
          >
            <Download className="w-3 h-3" />
            <span>Download</span>
          </a>
          <span className="text-[#C5BFB2]">•</span>
          <a
            href={`/api/preview/${activeFormat}?ticketId=${ticketId}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-medium text-[#77736C] hover:text-[#252525] transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            <span>Raw</span>
          </a>
        </div>
      </div>
    </div>
  );
};
