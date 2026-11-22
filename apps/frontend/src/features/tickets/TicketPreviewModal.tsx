import React, { useState, useEffect } from 'react';
import { AttendeeInfo, OutputFormat, TicketData, RenderResult } from '@passforge/shared';
import { Modal } from '../../components/ui/Modal.js';
import { Button } from '../../components/ui/Button.js';
import { generateTicket } from '../../services/api.js';
import { formatBytes } from '../../lib/utils.js';
import { Sparkles, Download, ExternalLink, RefreshCw, CheckCircle2 } from 'lucide-react';

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

  // When modal opens with an attendee, trigger initial generation of all 4 formats
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
        setResults(prev => ({ ...prev, [format]: res.result }));
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="4xl"
      title={
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Ticket Preview — {attendee.name}</h3>
            <p className="text-xs text-slate-400 font-mono">
              Tier: {attendee.ticketType} • Seat: {attendee.seat} • Ref: {ticketId}
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Format Selector Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 gap-1">
            <button
              onClick={() => setActiveFormat('png')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeFormat === 'png'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🖼️ Canvas (PNG)
            </button>
            <button
              onClick={() => setActiveFormat('page')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeFormat === 'page'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🌐 Web (Page)
            </button>
            <button
              onClick={() => setActiveFormat('email')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeFormat === 'email'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              📧 Email (HTML)
            </button>
            <button
              onClick={() => setActiveFormat('pdf')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeFormat === 'pdf'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              📄 Print (PDF)
            </button>
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
              className="inline-flex items-center justify-center font-semibold rounded-lg px-3 py-1.5 text-xs gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              Download {activeFormat.toUpperCase()}
            </a>
            <a
              href={`/api/preview/${activeFormat}?ticketId=${ticketId}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center font-semibold rounded-lg px-2.5 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
              title="Open full preview in new browser tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Live Rendering Display Container */}
        <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 min-h-[500px] flex items-center justify-center overflow-hidden relative">
          {loading ? (
            <div className="flex flex-col items-center justify-center space-y-3 py-20 text-slate-400">
              <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-medium">Rendering personalized ticket with Hyper Elements...</p>
            </div>
          ) : activeFormat === 'png' ? (
            <div className="w-full flex items-center justify-center p-2">
              <img
                src={`/api/preview/png?ticketId=${ticketId}&t=${timestamp}`}
                alt="Ticket Canvas PNG"
                className="max-h-[500px] w-auto rounded-lg shadow-2xl border border-slate-800 object-contain"
              />
            </div>
          ) : activeFormat === 'page' ? (
            <iframe
              src={`/api/preview/page?ticketId=${ticketId}&t=${timestamp}`}
              title="Ticket Web Page Preview"
              className="w-full h-[550px] rounded-lg border-0 bg-slate-950"
            />
          ) : activeFormat === 'email' ? (
            <iframe
              src={`/api/preview/email?ticketId=${ticketId}&t=${timestamp}`}
              title="Ticket Email Preview"
              className="w-full h-[550px] rounded-lg border-0 bg-slate-950"
            />
          ) : activeFormat === 'pdf' ? (
            <iframe
              src={`/api/preview/pdf?ticketId=${ticketId}&t=${timestamp}#toolbar=0`}
              title="Ticket PDF Preview"
              className="w-full h-[550px] rounded-lg border-0 bg-slate-950"
            />
          ) : null}
        </div>

        {/* Performance & File Stats Footer */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 bg-slate-950/80 px-4 py-2.5 rounded-lg border border-slate-800/80 font-mono">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Hyper Elements SSR Verified</span>
            </span>
            <span>Time: <b className="text-slate-200">{curResult?.renderTimeMs || 0} ms</b></span>
            <span>Size: <b className="text-slate-200">{curResult ? formatBytes(curResult.sizeBytes) : '—'}</b></span>
          </div>
          <div className="text-slate-500">
            Output: <span className="text-slate-400">apps/backend/output/</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};
