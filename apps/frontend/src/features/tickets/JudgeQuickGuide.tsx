import React, { useState, useEffect } from 'react';
import { Sparkles, X, Layers, Palette, RefreshCw, Archive, ArrowRight, CheckCircle2 } from 'lucide-react';

interface JudgeQuickGuideProps {
  onLoadDemo?: () => void;
  attendeeCount?: number;
}

export const JudgeQuickGuide: React.FC<JudgeQuickGuideProps> = ({
  onLoadDemo,
  attendeeCount = 1,
}) => {
  const [dismissed, setDismissed] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('passforge_judge_guide_dismissed') === 'true';
    } catch {
      return false;
    }
  });

  const [demoLoaded, setDemoLoaded] = useState<boolean>(false);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem('passforge_judge_guide_dismissed', 'true');
    } catch {}
  };

  const handleLoadDemo = () => {
    if (onLoadDemo) {
      onLoadDemo();
      setDemoLoaded(true);
      setTimeout(() => setDemoLoaded(false), 4000);
    }
  };

  if (dismissed) return null;

  return (
    <div
      data-testid="judge-quick-guide"
      className="bg-[#FAF8F5] border-b border-[#E9E5DC] px-4 sm:px-6 py-2.5 text-xs text-[#252525] transition-all animate-fade-in"
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Left: Title & Quick Steps */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#FBF2EE] text-[#B86E52] border border-[#F0D5C9] font-bold text-[11px] shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider">Explore PassForge</span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] text-[#555048] flex-wrap">
            <span className="inline-flex items-center gap-1 font-medium bg-white px-2 py-0.5 rounded border border-[#E9E5DC]">
              <span className="font-bold text-[#B86E52]">1.</span> Select Design
            </span>
            <span className="text-[#C5BFB2] hidden sm:inline">→</span>
            <span className="inline-flex items-center gap-1 font-medium bg-white px-2 py-0.5 rounded border border-[#E9E5DC]">
              <span className="font-bold text-[#B86E52]">2.</span> Customize Brand
            </span>
            <span className="text-[#C5BFB2] hidden sm:inline">→</span>
            <span className="inline-flex items-center gap-1 font-medium bg-white px-2 py-0.5 rounded border border-[#E9E5DC]">
              <span className="font-bold text-[#B86E52]">3.</span> Preview 4 Formats
            </span>
            <span className="text-[#C5BFB2] hidden sm:inline">→</span>
            <span className="inline-flex items-center gap-1 font-medium bg-white px-2 py-0.5 rounded border border-[#E9E5DC]">
              <span className="font-bold text-[#B86E52]">4.</span> Batch Export ZIP
            </span>
          </div>
        </div>

        {/* Right: Quick Demo Action & Dismiss */}
        <div className="flex items-center gap-2.5 shrink-0 self-end lg:self-auto">
          {onLoadDemo && (
            <button
              type="button"
              onClick={handleLoadDemo}
              data-testid="guide-load-demo-btn"
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-2xs ${
                demoLoaded
                  ? 'bg-[#EEF6F0] text-[#2E683E] border border-[#C6E2CD]'
                  : 'bg-[#B86E52] hover:bg-[#A15D43] text-white'
              }`}
            >
              {demoLoaded ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2E683E]" />
                  <span>Demo Event & 12 Attendees Loaded!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    Load Demo Event & Attendees{' '}
                    <span className="opacity-80 font-normal">({attendeeCount} currently)</span>
                  </span>
                </>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={handleDismiss}
            data-testid="dismiss-guide-btn"
            className="p-1 rounded-md text-[#9E9A90] hover:text-[#252525] hover:bg-[#EAE6DC] transition-colors cursor-pointer"
            title="Dismiss guide for this session"
            aria-label="Dismiss guide"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
