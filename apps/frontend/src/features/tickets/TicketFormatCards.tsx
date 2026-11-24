import React from 'react';
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
      name: 'Canvas PNG',
      label: 'Badge Image',
      desc: 'High-resolution pass for social sharing, wallet passes, and entry scanning.',
      icon: <ImageIcon className="w-4 h-4 text-[#B86E52]" />,
    },
    {
      id: 'page' as const,
      name: 'Web Pass',
      label: 'Responsive HTML',
      desc: 'Mobile-first ticket page with responsive breakpoints and live schedule.',
      icon: <Globe className="w-4 h-4 text-[#0E7490]" />,
    },
    {
      id: 'email' as const,
      name: 'Email HTML',
      label: 'Email Tables',
      desc: 'Universal table layout tested with Outlook, Apple Mail, and Gmail.',
      icon: <Mail className="w-4 h-4 text-[#945B0E]" />,
    },
    {
      id: 'pdf' as const,
      name: 'Print PDF',
      label: 'Vector A4',
      desc: 'Print-ready vector admission document with tear-off verification stub.',
      icon: <FileText className="w-4 h-4 text-[#2E683E]" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {formats.map((f) => {
        const res = results[f.id];
        return (
          <div
            key={f.id}
            className="border border-[#E9E5DC] rounded-xl p-4 flex flex-col justify-between transition-all hover:border-[#DDD8CD] bg-white shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="p-1.5 rounded-lg bg-[#FAF8F5] border border-[#E9E5DC]">
                  {f.icon}
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAF8F5] text-[#77736C]">
                  {res?.renderTimeMs ? `${res.renderTimeMs}ms` : 'Ready'}
                </span>
              </div>
              <h4 className="text-xs font-bold text-[#252525] mb-0.5">{f.name}</h4>
              <p className="text-[10px] font-medium text-[#77736C] mb-2">{f.label}</p>
              <p className="text-[11px] text-[#5F5B54] leading-relaxed mb-3 line-clamp-2">{f.desc}</p>
            </div>

            <div className="pt-2.5 border-t border-[#F0EDE6] flex items-center justify-between text-xs">
              <span className="font-mono text-[#77736C] text-[10px]">
                {res ? formatBytes(res.sizeBytes) : 'SSR'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onPreviewFormat(f.id)}
                  className="text-xs font-semibold text-[#B86E52] hover:text-[#A15D43] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Inspect</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
                <a
                  href={`/api/download/${f.id}`}
                  className="text-[#77736C] hover:text-[#252525] p-1 rounded hover:bg-[#FAF8F5] transition-colors"
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