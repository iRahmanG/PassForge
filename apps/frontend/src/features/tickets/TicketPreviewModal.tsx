import React, { useState, useEffect } from 'react';
import { AttendeeInfo, OutputFormat, TicketData, RenderResult } from '@passforge/shared';
import { Modal } from '../../components/ui/Modal.js';
import { Button } from '../../components/ui/Button.js';
import { generateTicket } from '../../services/api.js';
import { formatBytes } from '../../lib/utils.js';
import {
  Sparkles,
  Download,
  ExternalLink,
  RefreshCw,
  Image as ImageIcon,
  Globe,
  Mail,
  FileText,
  ShieldCheck,
} from 'lucide-react';

interface TicketPreviewModalProps {
  attendee: AttendeeInfo | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TicketPreviewModal: React.FC<TicketPreviewModalProps> = ({
  attendee,
  isOpen,
  onClose,
}) => {
  const [activeFormat, setActiveFormat] = useState<OutputFormat>('png');
  const [loading, setLoading] = useState(false);
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [results, setResults] = useState<Partial<Record<OutputFormat, RenderResult>>>({});
  const [timestamp, setTimestamp] = useState<number>(Date.now());

  useEffect(() => {
    if (isOpen && attendee) {
      handleGenerateAll();
    }
  }, [isOpen, attendee]);

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

  if (!attendee) return null;

  const ticketId = ticketData?.ticketId || 'KTF27-VIP-84920';
  const curResult = results[activeFormat];

  const formatButtons = [
    { id: 'png' as OutputFormat, label: 'Canvas PNG', icon: <ImageIcon className="w-3.5 h-3.5" /> },
    { id: 'page' as OutputFormat, label: 'Responsive Web', icon: <Globe className="w-3.5 h-3.5" /> },
    { id: 'email' as OutputFormat, label: 'Email HTML', icon: <Mail className="w-3.5 h-3.5" /> },
    { id: 'pdf' as OutputFormat, label: 'Printable PDF', icon: <FileText className="w-3.5 h-3.5" /> },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="4xl"
      title={
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FBF2EE] border border-[#F0D5C9] flex items-center justify-center text-[#B86E52]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#252525] tracking-tight">
              Pass Inspector — {attendee.name}
            </h3>
            <p className="text-xs text-[#77736C] font-mono">
              Tier: {attendee.ticketType} • Seat: {attendee.seat || 'Open Seating'} • Ref: {ticketId}
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Format Selector Tabs & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E9E5DC] pb-3">
          <div className="flex bg-[#FAF8F5] p-1 rounded-xl border border-[#E9E5DC] gap-1">
            {formatButtons.map((f) => {
              const isActive = activeFormat === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveFormat(f.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#B86E52] text-white shadow-xs'
                      : 'text-[#77736C] hover:text-[#252525]'
                  }`}
                >
                  {f.icon}
                  <span>{f.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleGenerateSingle(activeFormat)}
              loading={loading}
              icon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Regenerate
            </Button>
            <a
              href={`/api/download/${activeFormat}?ticketId=${ticketId}`}
              className="inline-flex items-center justify-center font-semibold rounded-lg px-3 py-1.5 text-xs gap-1.5 bg-[#B86E52] hover:bg-[#A15D43] text-white shadow-xs transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              Download {activeFormat.toUpperCase()}
            </a>
            <a
              href={`/api/preview/${activeFormat}?ticketId=${ticketId}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center font-semibold rounded-lg px-2.5 py-1.5 text-xs bg-white hover:bg-[#FAF8F5] text-[#252525] border border-[#DDD8CD] transition-all"
              title="Open raw preview in new tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Live Rendering Display Container */}
        <div className="bg-[#FAF8F5] rounded-2xl border border-[#E9E5DC] p-4 min-h-[480px] flex items-center justify-center overflow-hidden relative">
          {loading ? (
            <div className="flex flex-col items-center justify-center space-y-3 py-20 text-[#77736C]">
              <div className="w-8 h-8 border-2 border-[#B86E52] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-semibold text-[#252525]">
                Rendering personalized pass with Hyper Elements...
              </p>
            </div>
          ) : activeFormat === 'png' ? (
            <div className="w-full flex items-center justify-center p-2 overflow-hidden">
              <img
                src={`/api/preview/png?ticketId=${ticketId}&t=${timestamp}`}
                alt="Ticket Canvas PNG"
                className="max-w-full max-h-[460px] h-auto w-auto rounded-xl shadow-md border border-[#DDD8CD] object-contain bg-white block"
              />
            </div>
          ) : activeFormat === 'page' ? (
            <iframe
              src={`/api/preview/page?ticketId=${ticketId}&t=${timestamp}`}
              title="Ticket Web Page Preview"
              className="w-full h-[500px] rounded-xl border border-[#DDD8CD] bg-white shadow-xs"
            />
          ) : activeFormat === 'email' ? (
            <iframe
              src={`/api/preview/email?ticketId=${ticketId}&t=${timestamp}`}
              title="Ticket Email Preview"
              className="w-full h-[500px] rounded-xl border border-[#DDD8CD] bg-white shadow-xs"
            />
          ) : activeFormat === 'pdf' ? (
            <iframe
              src={`/api/preview/pdf?ticketId=${ticketId}&t=${timestamp}#toolbar=0`}
              title="Ticket PDF Preview"
              className="w-full h-[500px] rounded-xl border border-[#DDD8CD] bg-white shadow-xs"
            />
          ) : null}
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#77736C] pt-2 border-t border-[#E9E5DC]">
          <div className="flex items-center gap-3">
            {curResult?.renderTimeMs && (
              <span className="font-mono text-[11px] bg-[#FAF8F5] px-2.5 py-1 rounded-md border border-[#E9E5DC] text-[#4A4641]">
                Render: {curResult.renderTimeMs} ms
              </span>
            )}
            {curResult?.sizeBytes && (
              <span className="font-mono text-[11px] bg-[#FAF8F5] px-2.5 py-1 rounded-md border border-[#E9E5DC] text-[#4A4641]">
                Size: {formatBytes(curResult.sizeBytes)}
              </span>
            )}
            <span className="text-[11px] font-mono text-[#B86E52]">{ticketId}</span>
          </div>

          <div className="flex items-center gap-1.5 text-[#2E683E]">
            <ShieldCheck className="w-4 h-4 text-[#2E683E]" />
            <span className="text-[11px] font-medium">SSR Verified</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};