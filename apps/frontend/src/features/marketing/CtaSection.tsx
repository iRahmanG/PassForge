import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface CtaSectionProps {
  onNavigate: (path: string) => void;
}

export const CtaSection: React.FC<CtaSectionProps> = ({ onNavigate }) => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#B86E52] text-white rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-xl">
          {/* Subtle Decorative Pattern */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-2xl pointer-events-none -ml-16 -mb-16" />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            <span className="text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm inline-block">
              Free • Open Engine • Instant Live Preview
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-serif">
              Ready to create personalized passes for your event?
            </h2>

            <p className="text-sm sm:text-base text-white/90 max-w-xl mx-auto leading-relaxed">
              Launch the PassForge Studio right now. Upload your CSV attendee list, choose between
              Cyber Tech and Editorial layouts, and inspect all four rendering formats in seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                onClick={() => onNavigate('/app')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-[#B86E52] bg-white hover:bg-[#FAF8F5] shadow-md transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#B86E52]" />
                <span>Launch PassForge Studio</span>
                <ArrowRight className="w-4 h-4 text-[#B86E52]" />
              </button>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-white/80">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                In-memory privacy
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                Production Hyper Elements 0.5.2
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
