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
      name: 'Ticket Canvas PNG',
      engine: 'Hyper Elements <Canvas>',
      desc: '2000x1040 high-resolution badge image generated via Satori and Resvg.',
      icon: <ImageIcon className="w-4 h-4 text-[#B86E52]" />,
      tagColor: 'border-[#F0D5C9] bg-[#FBF2EE] text-[#B86E52]',
    },
    {
      id: 'page' as const,
      name: 'Responsive Web Ticket',
      engine: 'Hyper Elements <Page>',
      desc: 'Digital wallet pass with mobile viewport breakpoints and schedule metrics.',
      icon: <Globe className="w-4 h-4 text-[#0E7490]" />,
      tagColor: 'border-[#CFEBF0] bg-[#ECF8FA] text-[#0E7490]',
    },
    {
      id: 'email' as const,
      name: 'Personalized Email HTML',
      engine: 'Hyper Elements <Email>',
      desc: 'Outlook and Gmail compatible table layout with embedded branding and QR.',
      icon: <Mail className="w-4 h-4 text-[#945B0E]" />,
      tagColor: 'border-[#F3E0BA] bg-[#FDF6E8] text-[#945B0E]',
    },
    {
      id: 'pdf' as const,
      name: 'Printable A4 Ticket PDF',
      engine: 'Hyper Elements <Document>',
      desc: 'Standard A4 PDF admission pass with tear-off stub, guidelines, and QR check-in.',
      icon: <FileText className="w-4 h-4 text-[#2E683E]" />,
      tagColor: 'border-[#C6E2CD] bg-[#EEF6F0] text-[#2E683E]',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {formats.map((f) => {
        const res = results[f.id];
        return (
          <div
            key={f.id}
            className="border border-[#E9E5DC] rounded-xl p-3.5 flex flex-col justify-between transition-all hover:border-[#DDD8CD] bg-white shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="p-1.5 rounded-lg bg-[#FAF8F5] border border-[#E9E5DC]">
                  {f.icon}
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[#E9E5DC] text-[#4A4641] font-medium">
                  {res?.renderTimeMs ? `${res.renderTimeMs} ms` : 'SSR Ready'}
                </span>
              </div>
              <h4 className="text-xs font-bold text-[#252525] mb-0.5 tracking-tight">{f.name}</h4>
              <span
                className={`text-[9px] font-mono px-1.5 py-0.2 rounded-md border inline-block mb-2 font-semibold ${f.tagColor}`}
              >
                {f.engine}
              </span>
              <p className="text-[11px] text-[#77736C] leading-relaxed mb-3 line-clamp-2">{f.desc}</p>
            </div>

            <div className="pt-2 border-t border-[#E9E5DC] flex items-center justify-between text-xs">
              <span className="font-mono text-[#77736C] text-[10px]">
                {res ? formatBytes(res.sizeBytes) : 'Ready'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onPreviewFormat(f.id)}
                  className="text-xs font-semibold text-[#B86E52] hover:text-[#A15D43] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  Inspect <ExternalLink className="w-3 h-3" />
                </button>
                <a
                  href={`/api/download/${f.id}`}
                  className="text-[#77736C] hover:text-[#252525] p-1 rounded-md hover:bg-[#FAF8F5] transition-colors"
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