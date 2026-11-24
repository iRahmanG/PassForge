import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Globe,
  Mail,
  FileText,
  ArrowRight,
} from 'lucide-react';
import { OutputFormat } from '@passforge/shared';
import { QrPattern } from '../../components/ui/QrPattern';

interface DesignShowcaseSectionProps {
  onNavigate: (path: string) => void;
}

export const DesignShowcaseSection: React.FC<DesignShowcaseSectionProps> = ({ onNavigate }) => {
  const [selectedDesign, setSelectedDesign] = useState<'cyber' | 'editorial'>('cyber');
  const [selectedFormat, setSelectedFormat] = useState<OutputFormat>('png');

  const formatTabs: { id: OutputFormat; label: string; badge: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: 'png',
      label: 'Canvas Badge',
      badge: 'PNG',
      icon: <ImageIcon className="w-3.5 h-3.5" />,
      desc: '2000×1040 high-resolution pass for social sharing, digital wallets, and entry check-in.',
    },
    {
      id: 'page',
      label: 'Web Pass',
      badge: 'HTML',
      icon: <Globe className="w-3.5 h-3.5" />,
      desc: 'Interactive responsive web pass optimized across mobile, tablet, and desktop viewports.',
    },
    {
      id: 'email',
      label: 'Email Invite',
      badge: 'Tables',
      icon: <Mail className="w-3.5 h-3.5" />,
      desc: 'Tested table-based email markup compatible with Gmail, Apple Mail, and Microsoft Outlook.',
    },
    {
      id: 'document',
      label: 'Print PDF',
      badge: 'Vector',
      icon: <FileText className="w-3.5 h-3.5" />,
      desc: 'Clean vector A4 document formatted for physical printing with check-in verification stubs.',
    },
  ];

  return (
    <section id="designs" className="py-16 md:py-24 bg-[#FAF8F5] border-t border-b border-[#E9E5DC] scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <p className="text-xs font-semibold tracking-wider uppercase text-[#B86E52]">
            Production Design System
          </p>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#252525] font-serif">
            Two curated aesthetics. Four native outputs.
          </h2>
          <p className="text-sm sm:text-base text-[#77736C] leading-relaxed">
            Written once in React, compiled natively into Email, Web, PDF, and PNG through Hyper Elements.
          </p>
        </div>

        {/* Design Selector Toggle Bar */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 rounded-xl bg-white border border-[#DDD8CD] shadow-xs gap-1">
            <button
              onClick={() => setSelectedDesign('cyber')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                selectedDesign === 'cyber'
                  ? 'bg-[#070b14] text-white shadow-xs'
                  : 'text-[#5F5B54] hover:text-[#252525]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
              <span>Cyber Tech Pass</span>
            </button>
            <button
              onClick={() => setSelectedDesign('editorial')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                selectedDesign === 'editorial'
                  ? 'bg-[#B86E52] text-white shadow-xs'
                  : 'text-[#5F5B54] hover:text-[#252525]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-white shrink-0" />
              <span>Premium Editorial Pass</span>
            </button>
          </div>
        </div>

        {/* Central Stage Card */}
        <div className="bg-white border border-[#E9E5DC] rounded-2xl p-6 sm:p-10 shadow-sm max-w-4xl mx-auto">
          {/* Format Tabs Switcher */}
          <div className="flex flex-col sm:flex-row items-center justify-between pb-6 mb-8 border-b border-[#F0EDE6] gap-4">
            <div className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-start">
              {formatTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedFormat(tab.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    selectedFormat === tab.id
                      ? 'bg-[#FBF2EE] text-[#B86E52] font-semibold border border-[#F0D5C9]'
                      : 'text-[#77736C] hover:text-[#252525] hover:bg-[#FAF8F5]'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            <span className="text-xs text-[#77736C] font-sans text-center sm:text-right">
              {formatTabs.find((t) => t.id === selectedFormat)?.desc}
            </span>
          </div>

          {/* Ticket Canvas Hero Area */}
          <div className="flex justify-center py-2">
            {selectedDesign === 'cyber' ? (
              /* Cyber Tech Ticket */
              <div className="w-full max-w-xl bg-[#070b14] text-white rounded-2xl p-6 sm:p-8 border border-cyan-500/30 shadow-lg relative overflow-hidden transition-all">
                <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-bl-full pointer-events-none" />
                
                {/* Ticket Top */}
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-cyan-500/20">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                      HACKATHON PASS
                    </span>
                    <span className="text-xs font-mono text-cyan-300 font-bold">#PF-2027-VIP</span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400">
                    OUTPUT: {selectedFormat.toUpperCase()}
                  </span>
                </div>

                {/* Event Name */}
                <div className="space-y-1 mb-8">
                  <h3 className="text-2xl sm:text-3xl font-black font-sans tracking-tight text-white">
                    KIET TechFest 2027
                  </h3>
                  <p className="text-xs text-cyan-200/80 font-mono">
                    15 February 2027 • KIET Group of Institutions
                  </p>
                </div>

                {/* Attendee Details & QR Grid */}
                <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 items-center">
                  <div className="col-span-2 space-y-2">
                    <div>
                      <div className="text-[10px] font-mono uppercase text-slate-400">Attendee</div>
                      <div className="text-base sm:text-lg font-bold text-white">Maksud Rahman</div>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-mono">
                      <div>
                        <span className="text-slate-400 text-[10px] block">TIER</span>
                        <span className="text-cyan-300 font-bold">VIP ADMIT</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">SEAT</span>
                        <span className="text-white font-bold">A-104</span>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1 flex justify-end">
                    <div className="bg-white p-2 rounded-xl shadow-sm flex items-center justify-center">
                      <QrPattern className="w-16 h-16 text-[#070b14]" />
                    </div>
                  </div>
                </div>

                {/* Ticket Footer */}
                <div className="mt-5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>KIET Technical Team</span>
                  <span className="text-cyan-400">Hyper Elements 0.5.2 Engine</span>
                </div>
              </div>
            ) : (
              /* Premium Editorial Ticket */
              <div className="w-full max-w-xl bg-[#FAF8F5] text-[#252525] rounded-2xl p-6 sm:p-8 border border-[#DDD8CD] shadow-lg relative overflow-hidden transition-all">
                {/* Ticket Top */}
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#E9E5DC]">
                  <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#FBF2EE] text-[#B86E52] border border-[#F0D5C9]">
                    OFFICIAL ADMISSION
                  </span>
                  <span className="text-xs font-mono text-[#77736C]">
                    OUTPUT: {selectedFormat.toUpperCase()}
                  </span>
                </div>

                {/* Event Name */}
                <div className="space-y-1 mb-8">
                  <p className="text-xs uppercase tracking-widest text-[#B86E52] font-semibold">
                    KIET Technical Team Presents
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-bold font-serif text-[#252525]">
                    KIET TechFest 2027
                  </h3>
                  <p className="text-xs text-[#77736C]">
                    Saturday, 15 February 2027 • Main Auditorium
                  </p>
                </div>

                {/* Attendee Details & QR Grid */}
                <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-white border border-[#E9E5DC] items-center">
                  <div className="col-span-2 space-y-2">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-[#9E9A90]">Admit One</div>
                      <div className="text-base sm:text-lg font-bold font-serif text-[#252525]">Maksud Rahman</div>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <div>
                        <span className="text-[#9E9A90] text-[10px] block">CATEGORY</span>
                        <span className="text-[#B86E52] font-bold">VIP Pass</span>
                      </div>
                      <div>
                        <span className="text-[#9E9A90] text-[10px] block">RESERVED SEAT</span>
                        <span className="text-[#252525] font-semibold">Row A • Seat 104</span>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1 flex justify-end">
                    <div className="bg-white p-2 rounded-xl border border-[#DDD8CD] shadow-xs flex items-center justify-center">
                      <QrPattern className="w-16 h-16 text-[#252525]" />
                    </div>
                  </div>
                </div>

                {/* Ticket Footer */}
                <div className="mt-5 flex items-center justify-between text-[10px] text-[#77736C]">
                  <span>Single Entry Admission</span>
                  <span className="text-[#B86E52] font-semibold">PassForge Editorial Engine</span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action Bar */}
          <div className="mt-8 pt-5 border-t border-[#F0EDE6] flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-[#77736C]">
              Want to customize branding or preview your real attendees?
            </span>
            <button
              onClick={() => onNavigate('/app')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B86E52] hover:text-[#A15D43] transition-colors cursor-pointer"
            >
              <span>Open in Ticket Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
