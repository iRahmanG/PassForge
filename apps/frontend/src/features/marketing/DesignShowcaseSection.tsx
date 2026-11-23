import React, { useState } from 'react';
import {
  Sparkles,
  Image as ImageIcon,
  Globe,
  Mail,
  FileText,
  CheckCircle2,
  ExternalLink,
  Download,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { OutputFormat } from '@passforge/shared';

interface DesignShowcaseSectionProps {
  onNavigate: (path: string) => void;
}

export const DesignShowcaseSection: React.FC<DesignShowcaseSectionProps> = ({ onNavigate }) => {
  const [selectedDesign, setSelectedDesign] = useState<'cyber' | 'editorial'>('cyber');
  const [selectedFormat, setSelectedFormat] = useState<OutputFormat>('png');

  const formatTabs: { id: OutputFormat; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: 'png',
      label: 'Canvas PNG',
      icon: <ImageIcon className="w-4 h-4" />,
      desc: '1200×630 high-resolution social & badge image rendered via Node canvas',
    },
    {
      id: 'page',
      label: 'Web Page',
      icon: <Globe className="w-4 h-4" />,
      desc: 'Responsive HTML landing pass optimized for mobile and desktop screens',
    },
    {
      id: 'email',
      label: 'Email HTML',
      icon: <Mail className="w-4 h-4" />,
      desc: 'Table-based email markup compatible with Gmail, Outlook, and Apple Mail',
    },
    {
      id: 'document',
      label: 'Printable PDF',
      icon: <FileText className="w-4 h-4" />,
      desc: 'Vector PDF document formatted for standard printing and admission passes',
    },
  ];

  return (
    <section id="designs" className="py-20 bg-[#FAF8F5] border-t border-b border-[#E9E5DC] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#DDD8CD] text-xs font-semibold text-[#B86E52]">
            Design System & Rendering Matrix
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#252525] font-serif">
            Two distinct layouts. Four native outputs.
          </h2>
          <p className="text-sm sm:text-base text-[#5F5B54] leading-relaxed">
            Every design is defined once in React and compiled by Hyper Elements into four distinct
            delivery formats without sacrificing visual fidelity or responsiveness.
          </p>
        </div>

        {/* Design Selector Toggle Bar */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-1 rounded-2xl border border-[#DDD8CD] shadow-xs flex items-center gap-1">
            <button
              onClick={() => setSelectedDesign('cyber')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                selectedDesign === 'cyber'
                  ? 'bg-[#070b14] text-white shadow-sm'
                  : 'text-[#5F5B54] hover:text-[#252525]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Design A: Cyber Tech</span>
            </button>
            <button
              onClick={() => setSelectedDesign('editorial')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                selectedDesign === 'editorial'
                  ? 'bg-[#B86E52] text-white shadow-sm'
                  : 'text-[#5F5B54] hover:text-[#252525]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-white" />
              <span>Design B: Premium Editorial</span>
            </button>
          </div>
        </div>

        {/* Interactive Showcase Container */}
        <div className="bg-white border border-[#E9E5DC] rounded-3xl p-6 sm:p-8 shadow-sm">
          {/* Format Tabs Switcher */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#F0EDE6] flex-wrap gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              {formatTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedFormat(tab.id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedFormat === tab.id
                      ? 'bg-[#FAF8F5] border border-[#DDD8CD] text-[#252525] shadow-xs'
                      : 'text-[#77736C] hover:text-[#252525] hover:bg-[#FAF8F5]'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="text-xs text-[#77736C] hidden lg:block">
              {formatTabs.find((t) => t.id === selectedFormat)?.desc}
            </div>
          </div>

          {/* Visual Showcase Render Area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Interactive Ticket Canvas */}
            <div className="lg:col-span-8 flex justify-center">
              {selectedDesign === 'cyber' ? (
                /* Cyber Tech Preview Card */
                <div className="w-full max-w-xl bg-[#070b14] text-white rounded-2xl p-6 sm:p-8 border border-cyan-500/40 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-bl-full pointer-events-none" />
                  
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-cyan-500/20">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono tracking-widest uppercase px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/40">
                        HACKATHON PASS
                      </span>
                      <span className="text-xs font-mono text-cyan-300 font-bold">#PF-2027-VIP</span>
                    </div>
                    <span className="text-[11px] font-mono text-cyan-400 font-semibold px-2 py-0.5 rounded bg-cyan-500/10">
                      FORMAT: {selectedFormat.toUpperCase()}
                    </span>
                  </div>

                  {/* Event Title */}
                  <div className="space-y-1 mb-8">
                    <h3 className="text-2xl sm:text-3xl font-black font-sans tracking-tight text-white">
                      KIET TechFest 2027
                    </h3>
                    <p className="text-xs sm:text-sm text-cyan-200/80 font-mono">
                      15 February 2027 • KIET Group of Institutions
                    </p>
                  </div>

                  {/* Attendee Details & QR Grid */}
                  <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 items-center">
                    <div className="col-span-2 space-y-2">
                      <div>
                        <div className="text-[10px] font-mono uppercase text-slate-400">Attendee Name</div>
                        <div className="text-lg font-bold text-white">Maksud Rahman</div>
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
                      <div className="bg-white p-2 rounded-xl shadow-md">
                        <img
                          src="/output/sample_ticket_qr.png"
                          alt="QR Code"
                          className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bottom Verification Note */}
                  <div className="mt-6 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Organizer: KIET Technical Team</span>
                    <span className="text-cyan-400">Verified by PassForge</span>
                  </div>
                </div>
              ) : (
                /* Premium Editorial Preview Card */
                <div className="w-full max-w-xl bg-[#FAF8F5] text-[#252525] rounded-2xl p-6 sm:p-8 border border-[#DDD8CD] shadow-xl relative overflow-hidden">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E9E5DC]">
                    <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#FBF2EE] text-[#B86E52] border border-[#F0D5C9]">
                      OFFICIAL ADMISSION
                    </span>
                    <span className="text-xs font-mono text-[#77736C]">
                      OUTPUT: {selectedFormat.toUpperCase()}
                    </span>
                  </div>

                  {/* Event Title */}
                  <div className="space-y-1 mb-8">
                    <p className="text-xs uppercase tracking-widest text-[#B86E52] font-semibold">
                      KIET Technical Team Presents
                    </p>
                    <h3 className="text-2xl sm:text-3xl font-bold font-serif text-[#252525]">
                      KIET TechFest 2027
                    </h3>
                    <p className="text-xs sm:text-sm text-[#77736C]">
                      Saturday, 15 February 2027 • Main Auditorium
                    </p>
                  </div>

                  {/* Attendee Details & QR Grid */}
                  <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-white border border-[#E9E5DC] items-center">
                    <div className="col-span-2 space-y-2">
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-[#9E9A90]">Admit One</div>
                        <div className="text-lg font-bold font-serif text-[#252525]">Maksud Rahman</div>
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
                      <div className="bg-white p-2 rounded-xl border border-[#DDD8CD] shadow-xs">
                        <img
                          src="/output/sample_ticket_qr.png"
                          alt="QR Code"
                          className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bottom Verification Note */}
                  <div className="mt-6 flex items-center justify-between text-[11px] text-[#77736C]">
                    <span>Valid for single entry admission</span>
                    <span className="text-[#B86E52] font-semibold">PassForge Editorial Engine</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Technical Specs & Format Highlights */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-[#FAF8F5] border border-[#E9E5DC] rounded-2xl p-5 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#B86E52]">
                  Format Specifications
                </span>
                <h4 className="text-sm font-bold text-[#252525]">
                  {formatTabs.find((t) => t.id === selectedFormat)?.label} Delivery
                </h4>
                <p className="text-xs text-[#5F5B54] leading-relaxed">
                  {formatTabs.find((t) => t.id === selectedFormat)?.desc}
                </p>

                <div className="pt-2 border-t border-[#E9E5DC] space-y-2 text-xs text-[#4A4641]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#77736C]">Engine:</span>
                    <span className="font-mono font-semibold">Hyper Elements 0.5.2</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#77736C]">Render Pipeline:</span>
                    <span className="font-semibold">Server-Side JSX</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#77736C]">QR Code Payload:</span>
                    <span className="font-mono text-[11px]">Unique Ticket Hash</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-[#E9E5DC] bg-white flex items-center justify-between gap-3">
                <div className="text-xs text-[#77736C]">
                  Test this layout with your own attendee CSV:
                </div>
                <button
                  onClick={() => onNavigate('/app')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#B86E52] hover:bg-[#A15D43] transition-colors shrink-0 cursor-pointer"
                >
                  Try in Studio
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
