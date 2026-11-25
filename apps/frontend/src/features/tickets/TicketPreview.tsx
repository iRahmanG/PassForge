import React from 'react';
import { OutputFormat, TicketData } from '@passforge/shared';
import {
  Download,
  ExternalLink,
  ShieldCheck,
  Smartphone,
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
  const ticketId = ticket?.ticketId || 'APX27-VIP-84920';
  const curResult = previewData?.results?.[activeFormat];

  return (
    <div className="bg-white border border-[#E9E5DC] rounded-2xl overflow-hidden flex flex-col shadow-sm">
      {/* Preview Header / Format Info Bar */}
      <div className="bg-[#FAF8F5] px-5 py-3 border-b border-[#E9E5DC] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#2E683E]" />
          <span className="text-xs font-bold text-[#252525] tracking-wide uppercase">
            Live Preview • {designName}
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white text-[#B86E52] border border-[#F0D5C9] font-semibold uppercase">
            {activeFormat}
          </span>
        </div>

        <div className="flex items-center gap-2.5 text-xs text-[#77736C]">
          {curResult?.sizeBytes && (
            <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded-md border border-[#E9E5DC] text-[#4A4641]">
              {formatBytes(curResult.sizeBytes)}
            </span>
          )}
          {curResult?.renderTimeMs && (
            <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded-md border border-[#E9E5DC] text-[#4A4641]">
              {curResult.renderTimeMs} ms
            </span>
          )}

          <a
            href={`/api/download/${activeFormat}?ticketId=${ticketId}`}
            download
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FBF2EE] hover:bg-[#F5E6DF] text-[#B86E52] border border-[#F0D5C9] font-semibold transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </a>

          <a
            href={`/api/preview/${activeFormat}?ticketId=${ticketId}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white hover:bg-[#F0EDE6] text-[#4A4641] border border-[#DDD8CD] font-semibold transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Raw</span>
          </a>
        </div>
      </div>

      {/* Main Studio Preview Canvas Area */}
      <div className="relative min-h-[500px] flex items-center justify-center p-4 sm:p-6 bg-[#F7F5F0]">
        {loading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-xs z-20 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-[#B86E52] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-semibold text-[#252525]">
              Rendering Hyper Elements {activeFormat.toUpperCase()}...
            </p>
          </div>
        )}

        {/* 1. Canvas PNG Format */}
        {activeFormat === 'png' && (
          <div className="flex flex-col items-center justify-center w-full">
            <div className="rounded-xl overflow-hidden shadow-md border border-[#DDD8CD] bg-white p-2">
              <img
                src={previewData?.pngDataUrl || `/api/preview/png?ticketId=${ticketId}&t=${Date.now()}`}
                alt="Ticket PNG Preview"
                className="w-full h-auto max-h-[520px] object-contain block rounded-lg"
              />
            </div>
            <p className="text-[11px] text-[#77736C] mt-2.5 font-mono flex items-center gap-2">
              <span>Hyper Elements &lt;Canvas&gt;</span>
              <span>•</span>
              <span>High-Res Pass (2x Retina)</span>
            </p>
          </div>
        )}

        {/* 2. Responsive Web Page Format */}
        {activeFormat === 'page' && (
          <div className="w-full flex flex-col items-center justify-center">
            {isMobileView ? (
              // Mobile Mock Device Bezel
              <div className="w-[340px] sm:w-[360px] h-[600px] bg-slate-900 rounded-[38px] border-[6px] border-slate-800 shadow-xl overflow-hidden flex flex-col relative p-1.5 ring-1 ring-slate-700">
                <div className="w-20 h-3.5 bg-slate-800 rounded-full mx-auto mb-1.5 shrink-0" />
                <iframe
                  title="Mobile Web Ticket Preview"
                  srcDoc={previewData?.pageHtml}
                  src={!previewData?.pageHtml ? `/api/preview/page?ticketId=${ticketId}` : undefined}
                  className="w-full flex-1 rounded-[26px] border-0 bg-white"
                />
                <div className="w-28 h-1 bg-slate-700 rounded-full mx-auto mt-1.5 shrink-0" />
              </div>
            ) : (
              // Desktop Browser Mockup Frame
              <div className="w-full max-w-2xl h-[560px] rounded-xl overflow-hidden border border-[#DDD8CD] shadow-md bg-white flex flex-col">
                <div className="bg-[#FAF8F5] border-b border-[#E9E5DC] px-4 py-2 flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-stone-300 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-stone-300 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-stone-300 inline-block" />
                  </div>
                  <div className="flex-1 max-w-xs mx-auto bg-white border border-[#E9E5DC] rounded px-2.5 py-0.5 text-[10px] font-mono text-[#77736C] text-center truncate">
                    passforge.app/tickets/{ticketId}
                  </div>
                </div>
                <iframe
                  title="Desktop Web Ticket Preview"
                  srcDoc={previewData?.pageHtml}
                  src={!previewData?.pageHtml ? `/api/preview/page?ticketId=${ticketId}` : undefined}
                  className="w-full flex-1 border-0"
                />
              </div>
            )}
            <p className="text-[11px] text-[#77736C] mt-2.5 font-mono flex items-center gap-2">
              <span>Hyper Elements &lt;Page&gt;</span>
              <span>•</span>
              <span>Responsive HTML</span>
            </p>
          </div>
        )}

        {/* 3. Email HTML Format */}
        {activeFormat === 'email' && (
          <div className="w-full max-w-xl flex flex-col items-center">
            <div className="w-full rounded-xl overflow-hidden border border-[#DDD8CD] shadow-md bg-white">
              <div className="bg-[#FAF8F5] border-b border-[#E9E5DC] px-4 py-3 text-xs text-[#504D47] flex flex-col gap-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span>
                    <strong className="text-[#252525]">From:</strong> events@passforge.local
                  </span>
                  <span className="font-mono text-[#9E9A90]">Today, 09:00 AM</span>
                </div>
                <div className="text-[10px]">
                  <strong className="text-[#252525]">To:</strong> {ticket?.attendee.email || 'alex.morgan@example.com'}
                </div>
                <div className="text-xs font-bold text-[#252525] mt-0.5">
                  Subject: Your Official Pass: {ticket?.event.name || 'Apex Global Summit 2027'}
                </div>
              </div>

              <iframe
                title="Email HTML Preview"
                srcDoc={previewData?.emailHtml}
                src={!previewData?.emailHtml ? `/api/preview/email?ticketId=${ticketId}` : undefined}
                className="w-full h-[500px] border-0"
              />
            </div>
            <p className="text-[11px] text-[#77736C] mt-2.5 font-mono flex items-center gap-2">
              <span>Hyper Elements &lt;Email&gt;</span>
              <span>•</span>
              <span>Outlook & Gmail table layout</span>
            </p>
          </div>
        )}

        {/* 4. Document PDF Format */}
        {activeFormat === 'pdf' && (
          <div className="w-full max-w-2xl flex flex-col items-center">
            <div className="w-full h-[580px] rounded-xl overflow-hidden border border-[#DDD8CD] shadow-md bg-white">
              <iframe
                title="PDF Document Preview"
                src={`/api/preview/pdf?ticketId=${ticketId}&t=${Date.now()}`}
                className="w-full h-full border-0"
              />
            </div>
            <p className="text-[11px] text-[#77736C] mt-2.5 font-mono flex items-center gap-2">
              <span>Hyper Elements &lt;Document&gt;</span>
              <span>•</span>
              <span>Printable A4 PDF</span>
            </p>
          </div>
        )}
      </div>

      {/* Ticket Details & Diagnostics Footer */}
      {ticket && (
        <div className="bg-[#FAF8F5] px-5 py-3 border-t border-[#E9E5DC] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 flex-wrap">
            <div>
              <span className="text-[#77736C] uppercase tracking-wider text-[9px] block font-bold">
                Attendee
              </span>
              <span className="font-semibold text-[#252525]">{ticket.attendee.name}</span>
            </div>
            <div>
              <span className="text-[#77736C] uppercase tracking-wider text-[9px] block font-bold">
                Tier / Seat
              </span>
              <span className="font-semibold text-[#252525]">
                {ticket.attendee.ticketType} • {ticket.attendee.seat || 'Open Seating'}
              </span>
            </div>
            <div>
              <span className="text-[#77736C] uppercase tracking-wider text-[9px] block font-bold">
                Ref Code
              </span>
              <span className="font-mono text-[#B86E52] font-semibold">{ticket.ticketId}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[#2E683E] bg-[#EEF6F0] px-2.5 py-1 rounded-md border border-[#C6E2CD]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2E683E]" />
            <span className="font-semibold text-[11px]">Hyper Elements SSR Verified</span>
          </div>
        </div>
      )}
    </div>
  );
};