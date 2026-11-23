import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, FileSpreadsheet, Eye, Layers } from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (path: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  return (
    <section className="relative pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden">
      {/* Decorative Warm Light Background Gradient */}
      <div className="absolute inset-0 pointer-events-none -z-10 opacity-70">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-[#FBF2EE] via-[#FAF8F5] to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Hero Header */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Release & Engine Badge */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-[#FAF8F5] border border-[#DDD8CD] shadow-xs max-w-full justify-center">
            <span className="w-2 h-2 rounded-full bg-[#B86E52] animate-pulse shrink-0" />
            <span className="text-[11px] sm:text-xs font-semibold text-[#4A4641]">
              Powered by Hyper Elements 0.5.2
            </span>
            <span className="text-[#C5BFB2] hidden sm:inline">|</span>
            <span className="text-[11px] sm:text-xs text-[#77736C] hidden sm:inline">Four Formats • Single Source</span>
          </div>

          {/* Primary Editorial Headline */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#252525] font-serif leading-tight">
            <span>One event.</span> <br className="sm:hidden" />
            <span>Hundreds of tickets.</span> <br className="sm:hidden" />
            <span className="text-[#B86E52] italic font-normal">Every one personal.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#5F5B54] max-w-2xl mx-auto leading-relaxed font-sans">
            PassForge transforms raw attendee spreadsheets into crafted, personalized event tickets
            rendered natively into <span className="text-[#252525] font-semibold">Email HTML</span>,{' '}
            <span className="text-[#252525] font-semibold">Responsive Web</span>,{' '}
            <span className="text-[#252525] font-semibold">Printable Vector PDF</span>, and{' '}
            <span className="text-[#252525] font-semibold">High-Res PNG Badges</span>.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('/app')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-[#B86E52] hover:bg-[#A15D43] shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#FBF2EE]" />
              <span>Create your tickets</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#designs"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-[#4A4641] bg-white border border-[#DDD8CD] hover:bg-[#FAF8F5] hover:text-[#252525] shadow-xs transition-all cursor-pointer"
            >
              <Eye className="w-4 h-4 text-[#77866F]" />
              <span>Explore ticket designs</span>
            </a>
          </div>

          {/* Trust & Capability Highlights */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-[#77736C]">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2E683E]" />
              <span>No registration or account needed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2E683E]" />
              <span>Instant CSV drag-and-drop</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2E683E]" />
              <span>Real-time live preview</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2E683E]" />
              <span>Server-side JSX rendering</span>
            </div>
          </div>
        </div>

        {/* Visual Dual Ticket Showcase */}
        <div className="mt-14 max-w-5xl mx-auto">
          <div className="bg-white border border-[#E9E5DC] rounded-3xl p-4 sm:p-8 shadow-lg">
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#F0EDE6] flex-wrap gap-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#B86E52]">
                  Interactive Multi-Architecture Engine
                </span>
                <h3 className="text-lg font-bold text-[#252525]">
                  Two Distinct Ticket Systems, Four Formats
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-[#77736C] bg-[#FAF8F5] px-3 py-1.5 rounded-lg border border-[#E9E5DC]">
                <Layers className="w-3.5 h-3.5 text-[#B86E52]" />
                <span>Live Sample: KIET TechFest 2027</span>
              </div>
            </div>

            {/* Split Visual Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: Cyber Tech */}
              <div className="bg-[#070b14] text-white rounded-2xl p-6 border border-cyan-500/30 shadow-md relative overflow-hidden flex flex-col justify-between min-h-[300px]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-bl-full pointer-events-none" />
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-500/40">
                      CYBER TECH • BADGE
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400 font-semibold">
                      VIP PASS
                    </span>
                  </div>
                  <h4 className="text-xl font-extrabold tracking-tight font-sans text-white mb-1">
                    KIET TechFest 2027
                  </h4>
                  <p className="text-xs text-slate-400 font-mono">15 Feb 2027 • KIET Institutions</p>
                </div>

                <div className="my-6 border-t border-b border-cyan-500/20 py-4 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono uppercase text-slate-400">Attendee</div>
                    <div className="text-base font-bold text-cyan-300">Maksud Rahman</div>
                    <div className="text-[11px] font-mono text-slate-400">Seat A-104</div>
                  </div>
                  <div className="h-14 w-14 bg-white p-1 rounded-lg flex items-center justify-center shrink-0">
                    <img
                      src="/output/sample_ticket_qr.png"
                      alt="QR"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>ID: PF-TECH-2027-01</span>
                  <span className="text-cyan-400">EMAIL / WEB / PDF / PNG</span>
                </div>
              </div>

              {/* Card 2: Premium Editorial */}
              <div className="bg-[#FAF8F5] text-[#252525] rounded-2xl p-6 border border-[#DDD8CD] shadow-md relative overflow-hidden flex flex-col justify-between min-h-[300px]">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#FBF2EE] text-[#B86E52] border border-[#F0D5C9]">
                      PREMIUM EDITORIAL
                    </span>
                    <span className="text-[10px] font-serif text-[#77866F] font-bold">
                      OFFICIAL INVITATION
                    </span>
                  </div>
                  <h4 className="text-xl font-bold font-serif text-[#252525] mb-1">
                    KIET TechFest 2027
                  </h4>
                  <p className="text-xs text-[#77736C]">15 February 2027 • KIET Technical Team</p>
                </div>

                <div className="my-6 border-t border-b border-[#E9E5DC] py-4 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-[#9E9A90] font-sans">Admit One</div>
                    <div className="text-base font-bold font-serif text-[#252525]">Maksud Rahman</div>
                    <div className="text-[11px] text-[#77866F] font-medium">VIP Tier • Seat A-104</div>
                  </div>
                  <div className="h-14 w-14 bg-white p-1.5 rounded-xl border border-[#DDD8CD] flex items-center justify-center shrink-0">
                    <img
                      src="/output/sample_ticket_qr.png"
                      alt="QR"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-[#77736C]">
                  <span>Serial: PF-EDIT-2027-01</span>
                  <span className="text-[#B86E52] font-semibold">ALL 4 FORMATS VERIFIED</span>
                </div>
              </div>
            </div>

            {/* Bottom Format Matrix Pill Strip */}
            <div className="mt-6 pt-5 border-t border-[#F0EDE6] flex flex-wrap items-center justify-between gap-4 text-xs text-[#5F5B54]">
              <span className="font-semibold text-[#252525]">Supported Rendering Outputs:</span>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-[#FAF8F5] border border-[#E9E5DC] font-mono text-[11px]">
                  Canvas PNG (1200×630)
                </span>
                <span className="px-2.5 py-1 rounded-md bg-[#FAF8F5] border border-[#E9E5DC] font-mono text-[11px]">
                  Responsive HTML
                </span>
                <span className="px-2.5 py-1 rounded-md bg-[#FAF8F5] border border-[#E9E5DC] font-mono text-[11px]">
                  Compatible Email HTML
                </span>
                <span className="px-2.5 py-1 rounded-md bg-[#FAF8F5] border border-[#E9E5DC] font-mono text-[11px]">
                  Vector PDF Document
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
