import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface CtaSectionProps {
  onNavigate: (path: string) => void;
}

export const CtaSection: React.FC<CtaSectionProps> = ({ onNavigate }) => {
  return (
    <section className="py-20 sm:py-24 bg-[#FAF8F5] border-t border-[#EAEAEA]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-neutral-900">
          Ready to create professional event passes?
        </h2>

        <p className="text-sm sm:text-base text-neutral-600 max-w-xl mx-auto leading-relaxed">
          Design, customize, and generate personalized tickets in seconds. No account or setup required.
        </p>

        <div className="pt-2">
          <button
            onClick={() => onNavigate('/app')}
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white bg-neutral-900 hover:bg-neutral-800 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Launch Studio</span>
            <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
