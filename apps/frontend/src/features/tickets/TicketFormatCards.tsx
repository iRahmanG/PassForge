import React from 'react';
import { Card } from '../../components/ui/Card.js';
import { Mail, Globe, FileText, Image as ImageIcon, ExternalLink, Download } from 'lucide-react';
import { formatBytes } from '../../lib/utils.js';

interface TicketFormatCardsProps {
  results?: Record<string, any>;
  onPreviewFormat: (format: 'email' | 'page' | 'pdf' | 'png') => void;
}

export const TicketFormatCards: React.FC<TicketFormatCardsProps> = ({
  results = {},
  onPreviewFormat,
}) => {
  const formats = [
    {
      id: 'png' as const,
      name: 'Ticket PNG Badge',
      engine: 'Hyper Elements <Canvas>',
      desc: '2000x1040 high-resolution social/mobile badge image generated with Satori and Resvg.',
      icon: <ImageIcon className="w-5 h-5 text-indigo-400" />,
      color: 'border-indigo-500/30 bg-indigo-950/10',
    },
    {
      id: 'page' as const,
      name: 'Responsive Web Ticket',
      engine: 'Hyper Elements <Page>',
      desc: 'Digital wallet pass with mobile breakpoints, schedule metrics, and online access.',
      icon: <Globe className="w-5 h-5 text-cyan-400" />,
      color: 'border-cyan-500/30 bg-cyan-950/10',
    },
    {
      id: 'email' as const,
      name: 'Personalized Email HTML',
      engine: 'Hyper Elements <Email>',
      desc: 'Outlook and Gmail-safe table layout with embedded branding and QR code.',
      icon: <Mail className="w-5 h-5 text-amber-400" />,
      color: 'border-amber-500/30 bg-amber-950/10',
    },
    {
      id: 'pdf' as const,
      name: 'Printable A4 Ticket PDF',
      engine: 'Hyper Elements <Document>',
      desc: 'Standard A4 PDF admission pass with tear-off stub, venue guidelines, and QR check-in.',
      icon: <FileText className="w-5 h-5 text-emerald-400" />,
      color: 'border-emerald-500/30 bg-emerald-950/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {formats.map(f => {
        const res = results[f.id];
        return (
          <div
            key={f.id}
            className={`border rounded-xl p-4 flex flex-col justify-between transition-all hover:border-slate-600 bg-slate-900/80 ${f.color}`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60">{f.icon}</div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {res?.renderTimeMs ? `${res.renderTimeMs} ms` : 'Ready'}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mb-0.5">{f.name}</h4>
              <p className="text-[11px] font-mono text-indigo-300 mb-2">{f.engine}</p>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">{f.desc}</p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="font-mono text-slate-400 text-[11px]">
                {res ? formatBytes(res.sizeBytes) : '—'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onPreviewFormat(f.id)}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  Preview <ExternalLink className="w-3 h-3" />
                </button>
                <a
                  href={`/api/download/${f.id}`}
                  className="text-slate-400 hover:text-slate-200"
                  title="Download File"
                >
                  <Download className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
