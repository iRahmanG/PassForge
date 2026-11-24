import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Globe,
  Mail,
  FileText,
  ArrowRight,
  Sparkles,
  Smartphone,
  Printer,
  CheckCircle2,
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
      badge: '.png',
      icon: <ImageIcon className="w-3.5 h-3.5" />,
      desc: '2000×1040 px high-resolution pass for social sharing, digital wallets, and entry check-in.',
    },
    {
      id: 'page',
      label: 'Web Pass',
      badge: '.html',
      icon: <Globe className="w-3.5 h-3.5" />,
      desc: 'Interactive responsive web pass optimized across mobile, tablet, and desktop viewports.',
    },
    {
      id: 'email',
      label: 'Email Invite',
      badge: '.html',
      icon: <Mail className="w-3.5 h-3.5" />,
      desc: 'Tested table-based email markup compatible with Gmail, Apple Mail, and Microsoft Outlook.',
    },
    {
      id: 'document',
      label: 'Print PDF',
      badge: '.pdf',
      icon: <FileText className="w-3.5 h-3.5" />,
      desc: 'Clean vector A4 document formatted for physical printing with check-in verification stubs.',
    },
  ];

  const activeTab = formatTabs.find((t) => t.id === selectedFormat) || formatTabs[0];

  return (
    <section id="designs" className="py-8 sm:py-12 bg-[#FAF8F5] border-t border-b border-[#E9E5DC] scroll-mt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-4 sm:mb-6 space-y-1.5">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#252525] font-serif">
            One React template. Four native outputs.
          </h2>
          <p className="text-xs sm:text-sm text-[#77736C] leading-normal max-w-xl mx-auto">
            Written once in JSX. PassForge compiles pixel-perfect HTML emails, responsive web wallets, printable vector PDFs, and high-res PNG badges through Hyper Elements SSR.
          </p>
        </div>

        {/* Design Selector Toggle Bar */}
        <div className="flex justify-center mb-5 sm:mb-6">
          <div className="inline-flex p-1 rounded-2xl bg-white border border-[#DDD8CD] shadow-2xs gap-1.5">
            <button
              onClick={() => setSelectedDesign('cyber')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                selectedDesign === 'cyber' ? 'shadow-xs' : 'text-[#5F5B54] hover:text-[#252525]'
              }`}
              style={
                selectedDesign === 'cyber'
                  ? { backgroundColor: '#070b14', color: '#ffffff' }
                  : { backgroundColor: 'transparent', color: '#5F5B54' }
              }
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
              <span>Cyber Tech Pass</span>
            </button>
            <button
              onClick={() => setSelectedDesign('editorial')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                selectedDesign === 'editorial' ? 'shadow-xs' : 'text-[#5F5B54] hover:text-[#252525]'
              }`}
              style={
                selectedDesign === 'editorial'
                  ? { backgroundColor: '#B86E52', color: '#ffffff' }
                  : { backgroundColor: 'transparent', color: '#5F5B54' }
              }
            >
              <span className="w-2 h-2 rounded-full bg-white shrink-0" />
              <span>Premium Editorial Pass</span>
            </button>
          </div>
        </div>

        {/* Central Output Stage Card */}
        <div className="bg-white border border-[#E9E5DC] rounded-3xl p-4 sm:p-6 shadow-sm max-w-4xl mx-auto transition-all">
          
          {/* Format Tabs Switcher */}
          <div className="flex flex-col sm:flex-row items-center justify-between pb-4 mb-4 sm:mb-5 border-b border-[#F0EDE6] gap-3">
            <div className="inline-flex items-center p-1 rounded-2xl bg-[#FAF8F5] border border-[#DDD8CD] gap-1 shrink-0 overflow-x-auto max-w-full">
              {formatTabs.map((tab) => {
                const isActive = selectedFormat === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedFormat(tab.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-white text-[#B86E52] font-semibold shadow-2xs border border-[#E9E5DC]'
                        : 'text-[#77736C] hover:text-[#252525]'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <span className="text-xs text-[#77736C] font-sans text-center sm:text-right truncate max-w-sm">
              {activeTab.desc}
            </span>
          </div>

          {/* Rendered Ticket Mockup Viewport */}
          <div className="flex items-center justify-center py-2 sm:py-3 transition-all min-h-[250px] sm:min-h-[280px]">
            {selectedDesign === 'cyber' ? (
              /* CYBER TECH PASS PREVIEWS */
              selectedFormat === 'png' ? (
                /* PNG Canvas Badge */
                <div
                  className="w-full max-w-lg rounded-2xl p-4 sm:p-5 text-white shadow-xl relative overflow-hidden transition-all duration-300 border border-cyan-500/30 flex flex-col justify-between"
                  style={{
                    backgroundColor: '#070B14',
                    background: 'linear-gradient(135deg, #070B14 0%, #0F172A 100%)',
                  }}
                >
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-cyan-500/20">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 font-bold">
                        SUMMIT PASS
                      </span>
                      <span className="text-xs font-mono text-cyan-400 font-bold">#GTS-2027-VIP</span>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400/90 flex items-center gap-1">
                      <ImageIcon className="w-3 h-3 text-cyan-400" />
                      <span>2000×1040 PNG</span>
                    </span>
                  </div>

                  <div className="space-y-0.5 mb-4">
                    <div className="text-[9px] font-mono uppercase tracking-widest text-cyan-400/80">
                      GLOBAL TECH DIRECTORATE PRESENTS
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black font-sans tracking-tight text-white">
                      Global Tech Summit 2027
                    </h3>
                    <p className="text-xs text-slate-300 font-mono">
                      15 February 2027 • International Convention Center
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 mb-3">
                    <div className="space-y-1 min-w-0">
                      <div>
                        <div className="text-[9px] font-mono uppercase text-slate-400">Pass Holder</div>
                        <div className="text-base font-bold text-white tracking-tight truncate">
                          Alex Morgan
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] font-mono text-cyan-300">
                        <span>VIP ACCESS</span>
                        <span>•</span>
                        <span className="text-white">Seat A-104</span>
                        <span>•</span>
                        <span className="text-cyan-400">Gate 2</span>
                      </div>
                    </div>

                    <div className="bg-white p-1 rounded-lg shadow-md border border-cyan-300/40 shrink-0">
                      <QrPattern className="w-12 h-12" color="#070B14" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-cyan-500/10">
                    <span>Global Tech Directorate</span>
                    <span className="text-cyan-400">Hyper Elements 0.5.2 Engine</span>
                  </div>
                </div>
              ) : selectedFormat === 'page' ? (
                /* Responsive Web Pass */
                <div className="w-full max-w-lg bg-[#1E1E1E] rounded-2xl border border-neutral-700/80 shadow-xl overflow-hidden transition-all duration-300">
                  <div className="h-7 px-3 bg-[#2A2A2A] border-b border-[#3A3A3A] flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#FF5F56]" />
                      <span className="w-2 h-2 rounded-full bg-[#FFBD2E]" />
                      <span className="w-2 h-2 rounded-full bg-[#27C93F]" />
                    </div>
                    <div className="px-3 py-0.5 rounded bg-[#1E1E1E] text-neutral-400 font-mono text-[10px] border border-neutral-700 flex items-center gap-1.5 max-w-xs truncate">
                      <Globe className="w-2.5 h-2.5 text-neutral-500 shrink-0" />
                      <span>passforge.event/pass/GTS27-VIP-84920</span>
                    </div>
                    <div className="w-6" />
                  </div>

                  <div className="p-4 bg-[#0D1117] text-white space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-neutral-800 text-xs">
                      <span className="text-emerald-400 flex items-center gap-1.5 font-semibold font-mono text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        VERIFIED ADMISSION
                      </span>
                      <span className="text-neutral-400 font-mono text-[11px]">GTS27-VIP-84920</span>
                    </div>

                    <div className="space-y-0.5">
                      <h4 className="text-lg font-bold tracking-tight text-white">Global Tech Summit 2027</h4>
                      <p className="text-xs text-neutral-400">15 February 2027 • Main Auditorium</p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#161B22] border border-neutral-800 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-[10px] text-neutral-400 uppercase font-mono">Attendee</div>
                        <div className="text-base font-bold text-white">Alex Morgan</div>
                        <div className="text-xs text-emerald-400 font-mono">VIP • Gate 2 • Seat A-104</div>
                      </div>
                      <div className="bg-white p-1 rounded-md shrink-0">
                        <QrPattern className="w-11 h-11" color="#0D1117" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="py-1.5 px-3 rounded-lg bg-neutral-800 text-xs font-semibold text-neutral-200 flex items-center justify-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>Apple Wallet</span>
                      </div>
                      <div className="py-1.5 px-3 rounded-lg bg-neutral-800 text-xs font-semibold text-neutral-200 flex items-center justify-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>Google Wallet</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : selectedFormat === 'email' ? (
                /* Email Invitation */
                <div className="w-full max-w-lg bg-white rounded-2xl border border-[#EAEAEA] shadow-xl overflow-hidden transition-all duration-300">
                  <div className="p-3 bg-[#FAF8F5] border-b border-[#EAEAEA] flex items-center justify-between text-xs text-neutral-600">
                    <div className="space-y-0.5 min-w-0">
                      <p className="font-semibold text-neutral-900 text-xs truncate">
                        Subject: Your VIP Pass for Global Tech Summit 2027
                      </p>
                      <p className="text-[10px] text-neutral-500 font-mono">
                        From: tickets@techsummit.org • To: alex.morgan@example.com
                      </p>
                    </div>
                    <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-white text-neutral-500 border border-neutral-200 shrink-0">
                      Table HTML
                    </span>
                  </div>

                  <div className="p-4 bg-neutral-50/60 text-[#252525] space-y-3">
                    <div className="text-center space-y-1 pb-2 border-b border-[#F0EDE6]">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#B86E52] font-semibold">
                        Official Ticket Confirmation
                      </span>
                      <h4 className="text-base font-bold text-[#252525] font-serif">You're going to Global Tech Summit!</h4>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-[#E9E5DC] flex items-center justify-between gap-4 shadow-2xs">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-[#9E9A90] uppercase">Attendee</span>
                        <div className="text-base font-bold text-[#252525]">Alex Morgan</div>
                        <div className="text-xs text-[#B86E52] font-semibold">VIP Pass • Row A, Seat 104</div>
                      </div>
                      <div className="bg-white p-1 rounded-md border border-[#DDD8CD] shrink-0">
                        <QrPattern className="w-11 h-11" color="#252525" />
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-3 pt-1">
                      <span className="px-3.5 py-1.5 rounded-lg bg-[#252525] text-white text-xs font-semibold">
                        Add to Calendar
                      </span>
                      <span className="px-3.5 py-1.5 rounded-lg bg-[#F7F5F0] text-[#5F5B54] border border-[#DDD8CD] text-xs font-semibold">
                        View in Browser
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Print PDF */
                <div className="w-full max-w-lg bg-white rounded-xl border border-neutral-300 shadow-xl p-4 sm:p-5 transition-all duration-300 flex flex-col justify-between">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-200 mb-3">
                    <div className="flex items-center gap-2">
                      <Printer className="w-3.5 h-3.5 text-[#B86E52]" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-800">
                        Physical Admission Document (A4)
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-500">
                      Doc ID: GTS27-PDF-84920
                    </span>
                  </div>

                  <div className="py-2 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-[#B86E52] font-bold">
                          Official Access Voucher
                        </span>
                        <h3 className="text-xl font-bold font-serif text-neutral-900 leading-tight">
                          Global Tech Summit 2027
                        </h3>
                        <p className="text-xs text-neutral-600">
                          15 February 2027 • Convention Center Auditorium
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded border border-neutral-900 text-[10px] font-mono font-bold uppercase">
                        VIP Admit
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 text-xs">
                      <div>
                        <span className="text-neutral-400 text-[9px] block font-mono">ATTENDEE</span>
                        <span className="font-bold text-neutral-900 text-xs">Alex Morgan</span>
                      </div>
                      <div>
                        <span className="text-neutral-400 text-[9px] block font-mono">SEAT NUMBER</span>
                        <span className="font-bold text-neutral-900 text-xs">Row A • 104</span>
                      </div>
                      <div>
                        <span className="text-neutral-400 text-[9px] block font-mono">GATE</span>
                        <span className="font-bold text-neutral-900 text-xs">Gate 2</span>
                      </div>
                    </div>
                  </div>

                  <div className="my-2 border-t border-dashed border-neutral-300 relative flex items-center justify-center">
                    <span className="absolute bg-white px-2 text-[9px] font-mono text-neutral-400 uppercase tracking-widest">
                      ✂ Tear for check-in
                    </span>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-mono uppercase text-neutral-500">Check-in Stub</span>
                      <p className="text-xs font-bold text-neutral-900">Alex Morgan • VIP Pass</p>
                    </div>
                    <div className="bg-white p-1 border border-neutral-300 rounded shrink-0">
                      <QrPattern className="w-9 h-9" color="#000000" />
                    </div>
                  </div>
                </div>
              )
            ) : (
              /* PREMIUM EDITORIAL PASS PREVIEWS */
              selectedFormat === 'png' ? (
                /* Editorial PNG */
                <div className="w-full max-w-lg bg-[#FAF8F5] text-[#252525] rounded-2xl p-5 sm:p-6 border border-[#DDD8CD] shadow-xl relative overflow-hidden transition-all duration-300">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E9E5DC]">
                    <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#FBF2EE] text-[#B86E52] border border-[#F0D5C9]">
                      OFFICIAL ADMISSION
                    </span>
                    <span className="text-xs font-mono text-[#77736C]">
                      2000×1040 PNG
                    </span>
                  </div>

                  <div className="space-y-0.5 mb-5">
                    <p className="text-[10px] uppercase tracking-widest text-[#B86E52] font-semibold">
                      Design Leadership Council Presents
                    </p>
                    <h3 className="text-2xl sm:text-3xl font-bold font-serif text-[#252525]">
                      Design Leadership Summit
                    </h3>
                    <p className="text-xs text-[#77736C]">
                      Saturday, 15 February 2027 • Grand Auditorium
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-white border border-[#E9E5DC] items-center mb-4">
                    <div className="col-span-2 space-y-1.5">
                      <div>
                        <div className="text-[9px] uppercase tracking-wider text-[#9E9A90]">Admit One</div>
                        <div className="text-base sm:text-lg font-bold font-serif text-[#252525]">Alex Morgan</div>
                      </div>
                      <div className="flex items-center gap-4 text-xs">
                        <div>
                          <span className="text-[#9E9A90] text-[9px] block">CATEGORY</span>
                          <span className="text-[#B86E52] font-bold">VIP Pass</span>
                        </div>
                        <div>
                          <span className="text-[#9E9A90] text-[9px] block">RESERVED SEAT</span>
                          <span className="text-[#252525] font-semibold">Row A • Seat 104</span>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-1 flex justify-end">
                      <div className="bg-white p-1 rounded-xl border border-[#DDD8CD] shadow-2xs flex items-center justify-center">
                        <QrPattern className="w-12 h-12" color="#252525" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-[#77736C] pt-1">
                    <span>Single Entry Admission</span>
                    <span className="text-[#B86E52] font-semibold">PassForge Editorial Engine</span>
                  </div>
                </div>
              ) : selectedFormat === 'page' ? (
                /* Editorial Web Pass */
                <div className="w-full max-w-lg bg-[#F7F5F0] rounded-2xl border border-[#DDD8CD] shadow-xl overflow-hidden transition-all duration-300">
                  <div className="h-7 px-3 bg-[#EFECE4] border-b border-[#DDD8CD] flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#B86E52]" />
                      <span className="w-2 h-2 rounded-full bg-[#77866F]" />
                      <span className="w-2 h-2 rounded-full bg-[#DDD8CD]" />
                    </div>
                    <div className="px-3 py-0.5 rounded bg-white text-neutral-600 font-mono text-[10px] border border-[#DDD8CD] flex items-center gap-1.5 max-w-xs truncate">
                      <Globe className="w-2.5 h-2.5 text-[#B86E52] shrink-0" />
                      <span>passforge.event/pass/DLS27-VIP-104</span>
                    </div>
                    <div className="w-6" />
                  </div>

                  <div className="p-4 bg-white text-[#252525] space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-[#E9E5DC] text-xs">
                      <span className="text-[#2E683E] flex items-center gap-1.5 font-semibold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2E683E]" />
                        VERIFIED CREDENTIAL
                      </span>
                      <span className="text-[#9E9A90] font-mono text-[11px]">DLS27-VIP-104</span>
                    </div>

                    <div className="space-y-0.5">
                      <h4 className="text-lg font-bold font-serif text-[#252525]">Design Leadership Summit</h4>
                      <p className="text-xs text-[#77736C]">15 February 2027 • Grand Hall</p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E9E5DC] flex items-center justify-between gap-3">
                      <div>
                        <div className="text-[10px] text-[#9E9A90] uppercase font-sans">Pass Holder</div>
                        <div className="text-base font-bold font-serif text-[#252525]">Alex Morgan</div>
                        <div className="text-xs text-[#B86E52] font-semibold">VIP Pass • Row A, Seat 104</div>
                      </div>
                      <div className="bg-white p-1 rounded-md border border-[#DDD8CD] shrink-0">
                        <QrPattern className="w-11 h-11" color="#252525" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="py-1.5 px-3 rounded-lg bg-[#FAF8F5] border border-[#DDD8CD] text-xs font-semibold text-[#252525] flex items-center justify-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5 text-[#77866F]" />
                        <span>Apple Wallet</span>
                      </div>
                      <div className="py-1.5 px-3 rounded-lg bg-[#FAF8F5] border border-[#DDD8CD] text-xs font-semibold text-[#252525] flex items-center justify-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5 text-[#77866F]" />
                        <span>Google Wallet</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : selectedFormat === 'email' ? (
                /* Editorial Email */
                <div className="w-full max-w-lg bg-white rounded-2xl border border-[#EAEAEA] shadow-xl overflow-hidden transition-all duration-300">
                  <div className="p-3 bg-[#FAF8F5] border-b border-[#EAEAEA] flex items-center justify-between text-xs text-neutral-600">
                    <div className="space-y-0.5 min-w-0">
                      <p className="font-semibold text-neutral-900 text-xs truncate">
                        Your Official Invitation: Design Leadership Summit
                      </p>
                      <p className="text-[10px] text-neutral-500 font-mono">
                        From: invite@designsummit.org • To: alex.morgan@example.com
                      </p>
                    </div>
                    <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-white text-neutral-500 border border-neutral-200 shrink-0">
                      Table HTML
                    </span>
                  </div>

                  <div className="p-4 bg-white text-[#252525] space-y-3">
                    <div className="text-center space-y-1 pb-2 border-b border-[#F0EDE6]">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#B86E52] font-semibold">
                        Exclusive Admission
                      </span>
                      <h4 className="text-base font-bold font-serif text-[#252525]">Design Leadership Summit 2027</h4>
                    </div>

                    <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E9E5DC] flex items-center justify-between gap-4 shadow-2xs">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-[#9E9A90] uppercase">Guest</span>
                        <div className="text-base font-bold font-serif text-[#252525]">Alex Morgan</div>
                        <div className="text-xs text-[#B86E52] font-semibold">VIP Pass • Seat A-104</div>
                      </div>
                      <div className="bg-white p-1 rounded-md border border-[#DDD8CD] shrink-0">
                        <QrPattern className="w-11 h-11" color="#252525" />
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-3 pt-1">
                      <span className="px-3.5 py-1.5 rounded-lg bg-[#B86E52] text-white text-xs font-semibold">
                        Confirm Attendance
                      </span>
                      <span className="px-3.5 py-1.5 rounded-lg bg-[#FAF8F5] text-[#5F5B54] border border-[#DDD8CD] text-xs font-semibold">
                        Download PDF
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Editorial Print PDF */
                <div className="w-full max-w-lg bg-white rounded-xl border border-neutral-300 shadow-xl p-4 sm:p-5 transition-all duration-300 flex flex-col justify-between">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-200 mb-3">
                    <div className="flex items-center gap-2">
                      <Printer className="w-3.5 h-3.5 text-[#B86E52]" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-800">
                        Official Admission Document (A4)
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-500">
                      Doc ID: DLS27-PDF-104
                    </span>
                  </div>

                  <div className="py-2 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-[#B86E52] font-bold">
                          Design Leadership Council
                        </span>
                        <h3 className="text-xl font-bold font-serif text-neutral-900 leading-tight">
                          Design Leadership Summit
                        </h3>
                        <p className="text-xs text-neutral-600">
                          15 February 2027 • Grand Hall
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded border border-neutral-900 text-[10px] font-mono font-bold uppercase">
                        VIP Pass
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 text-xs">
                      <div>
                        <span className="text-neutral-400 text-[9px] block font-mono">GUEST</span>
                        <span className="font-bold text-neutral-900 text-xs">Alex Morgan</span>
                      </div>
                      <div>
                        <span className="text-neutral-400 text-[9px] block font-mono">SEAT</span>
                        <span className="font-bold text-neutral-900 text-xs">Row A • 104</span>
                      </div>
                      <div>
                        <span className="text-neutral-400 text-[9px] block font-mono">ENTRY</span>
                        <span className="font-bold text-neutral-900 text-xs">Main Gate</span>
                      </div>
                    </div>
                  </div>

                  <div className="my-2 border-t border-dashed border-neutral-300 relative flex items-center justify-center">
                    <span className="absolute bg-white px-2 text-[9px] font-mono text-neutral-400 uppercase tracking-widest">
                      ✂ Tear for check-in
                    </span>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-mono uppercase text-neutral-500">Check-in Voucher</span>
                      <p className="text-xs font-bold text-neutral-900">Alex Morgan • VIP Admit</p>
                    </div>
                    <div className="bg-white p-1 border border-neutral-300 rounded shrink-0">
                      <QrPattern className="w-9 h-9" color="#000000" />
                    </div>
                  </div>
                </div>
              )
            )}
          </div>

          {/* Bottom Action Area (Premium Linear / Framer / Vercel Layout) */}
          <div
            className="mt-4 -mx-4 -mb-4 sm:-mx-6 sm:-mb-6 px-4 sm:px-6 py-3.5 border-t border-[#E9E5DC] rounded-b-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            style={{ backgroundColor: '#FAF8F5' }}
          >
            {/* Left: Headline & Supporting Text */}
            <div className="space-y-0.5">
              <h3 className="text-xs sm:text-sm font-bold text-neutral-900 tracking-tight">
                Multi-Format Ready
              </h3>
              <p className="text-[11px] text-neutral-500">
                Available as Web Pass, Email HTML, PDF and PNG.
              </p>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => onNavigate('/app')}
                className="whitespace-nowrap shrink-0 px-4 py-2 rounded-xl border border-neutral-300/80 bg-white hover:bg-neutral-50 text-xs font-semibold text-neutral-700 hover:text-neutral-900 shadow-2xs hover:shadow-xs transition-all cursor-pointer text-center"
                style={{ backgroundColor: '#ffffff', color: '#262626' }}
              >
                Edit Template
              </button>

              <button
                onClick={() => onNavigate('/app')}
                className="whitespace-nowrap shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
                style={{ backgroundColor: '#18181b', color: '#ffffff', paddingLeft: '20px', paddingRight: '20px' }}
              >
                <span>Open Ticket Studio</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
