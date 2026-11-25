import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2, Eye } from 'lucide-react';

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
          <p className="text-base sm:text-lg text-[#5F5B54] max-w-2xl mx-auto leading-relaxed font-sans text-pretty">
            PassForge transforms raw attendee spreadsheets into crafted, personalized event tickets
            rendered natively into Email HTML, Responsive Web, Printable Vector PDF, and High-Res PNG Badges.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              data-testid="hero-create-tickets-btn"
              onClick={() => onNavigate('/app?action=create')}
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
          <div className="pt-4 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-[#77736C]">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2E683E]" />
              <span>Zero account or database signup</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2E683E]" />
              <span>Instant CSV drag-and-drop mapping</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2E683E]" />
              <span>Live server-side JSX preview</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
