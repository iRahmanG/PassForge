import React from 'react';
import { OutputFormat, TicketData } from '@passforge/shared';
import {
  Download,
  ExternalLink,
  Sparkles,
  Smartphone,
  CheckCircle2,
  FileText,
  Mail,
  Globe,
  Image as ImageIcon,
} from 'lucide-react';
import { formatBytes } from '../../lib/utils.js';

interface TicketPreviewProps {
  activeFormat: OutputFormat;
  isMobileView: boolean;
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
}

export const TicketPreview: React.FC<TicketPreviewProps> = ({
  activeFormat,
  isMobileView,
  loading,
  previewData,
  designName,
}) => {
  const ticket = previewData?.ticket;
  const ticketId = ticket?.ticketId || 'KTF27-VIP-84920';
  const curResult = previewData?.results?.[activeFormat];

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden flex flex-col">
      {/* Preview Header / Format Info Bar */}
      <div className="bg-slate-950/80 px-6 py-3.5 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-white tracking-wide uppercase">
            Live Preview • {designName}
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
            {activeFormat.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          {curResult?.sizeBytes && (
            <span className="font-mono text-[11px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              {formatBytes(curResult.sizeBytes)}
            </span>
          )}
          {curResult?.renderTimeMs && (
            <span className="font-mono text-[11px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              {curResult.renderTimeMs} ms
            </span>
          )}

          <a
            href={`/api/download/${activeFormat}?ticketId=${ticketId}`}
            download
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-semibold transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </a>

          <a
            href={`/api/preview/${activeFormat}?ticketId=${ticketId}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Raw</span>
          </a>
        </div>
      </div>

      {/* Main Preview Canvas Area */}
      <div className="relative min-h-[540px] flex items-center justify-center p-6 bg-slate-950/40">
        {loading && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-semibold text-slate-300">
              Rendering Hyper Elements {activeFormat.toUpperCase()}...
            </p>
          </div>
        )}

        {/* 1. Canvas PNG Format */}
        {activeFormat === 'png' && (
          <div className="flex flex-col items-center justify-center w-full max-w-4xl">
            <div className="rounded-xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950">
              <img
                src={previewData?.pngDataUrl || `/api/preview/png?ticketId=${ticketId}&t=${Date.now()}`}
                alt="Ticket PNG Preview"
                className="w-full h-auto max-h-[580px] object-contain block"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-3 font-mono">
              Rendered via Hyper Elements &lt;Canvas&gt; • 2000x1040 (2x Retina)
            </p>
          </div>
        )}

        {/* 2. Responsive Web Page Format */}
        {activeFormat === 'page' && (
          <div className="w-full flex flex-col items-center justify-center">
            {isMobileView ? (
              // Mobile Mock Device Bezel
              <div className="w-[380px] h-[640px] bg-slate-950 rounded-[40px] border-4 border-slate-800 shadow-2xl overflow-hidden flex flex-col relative p-2">
                <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-2 shrink-0" />
                <iframe
                  title="Mobile Web Ticket Preview"
                  srcDoc={previewData?.pageHtml}
                  src={!previewData?.pageHtml ? `/api/preview/page?ticketId=${ticketId}` : undefined}
                  className="w-full flex-1 rounded-[24px] border-0 bg-white"
                />
              </div>
            ) : (
              // Desktop View Frame
              <div className="w-full max-w-3xl h-[620px] rounded-xl overflow-hidden border border-slate-800 shadow-xl bg-white">
                <iframe
                  title="Desktop Web Ticket Preview"
                  srcDoc={previewData?.pageHtml}
                  src={!previewData?.pageHtml ? `/api/preview/page?ticketId=${ticketId}` : undefined}
                  className="w-full h-full border-0"
                />
              </div>
            )}
            <p className="text-[11px] text-slate-400 mt-3 font-mono">
              Rendered via Hyper Elements &lt;Page&gt; • Responsive HTML with breakpoints
            </p>
          </div>
        )}

        {/* 3. Email HTML Format */}
        {activeFormat === 'email' && (
          <div className="w-full max-w-2xl flex flex-col items-center">
            {/* Mock Email Client Envelope */}
            <div className="w-full rounded-xl overflow-hidden border border-slate-800 shadow-2xl bg-white">
              <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 text-xs text-slate-600 flex flex-col gap-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span>
                    <strong className="text-slate-800">From:</strong> events@passforge.local
                  </span>
                  <span className="font-mono text-slate-400">Today, 09:00 AM</span>
                </div>
                <div className="text-[11px]">
                  <strong className="text-slate-800">To:</strong> {ticket?.attendee.email || 'maksud@example.com'}
                </div>
                <div className="text-xs font-semibold text-slate-900 mt-1">
                  Subject: Your Official Pass: {ticket?.event.name || 'KIET TechFest 2027'}
                </div>
              </div>

              <iframe
                title="Email HTML Preview"
                srcDoc={previewData?.emailHtml}
                src={!previewData?.emailHtml ? `/api/preview/email?ticketId=${ticketId}` : undefined}
                className="w-full h-[540px] border-0"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-3 font-mono">
              Rendered via Hyper Elements &lt;Email&gt; • Outlook & Gmail table layout
            </p>
          </div>
        )}

        {/* 4. Document PDF Format */}
        {activeFormat === 'pdf' && (
          <div className="w-full max-w-3xl flex flex-col items-center">
            <div className="w-full h-[620px] rounded-xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900">
              <iframe
                title="PDF Document Preview"
                src={`/api/preview/pdf?ticketId=${ticketId}&t=${Date.now()}`}
                className="w-full h-full border-0"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-3 font-mono">
              Rendered via Hyper Elements &lt;Document&gt; • Standard A4 Printable Vector PDF
            </p>
          </div>
        )}
      </div>

      {/* Ticket Details & Diagnostics Footer */}
      {ticket && (
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-4 flex-wrap">
            <div>
              <span className="text-slate-500 uppercase tracking-wider text-[10px] block font-bold">
                Attendee
              </span>
              <span className="font-semibold text-slate-200">{ticket.attendee.name}</span>
            </div>
            <div>
              <span className="text-slate-500 uppercase tracking-wider text-[10px] block font-bold">
                Tier / Seat
              </span>
              <span className="font-semibold text-slate-200">
                {ticket.attendee.ticketType} • {ticket.attendee.seat || 'Open Seating'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 uppercase tracking-wider text-[10px] block font-bold">
                Ticket Ref
              </span>
              <span className="font-mono text-indigo-400">{ticket.ticketId}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Hyper Elements 0.5.2 SSR Verified</span>
          </div>
        </div>
      )}
    </div>
  );
};
