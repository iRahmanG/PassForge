import React, { useState, useEffect } from 'react';
import {
  Mail,
  Globe,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  ArrowRight,
  Check,
  Layers,
} from 'lucide-react';

interface DesignShowcaseSectionProps {
  onNavigate: (path: string) => void;
}

export const DesignShowcaseSection: React.FC<DesignShowcaseSectionProps> = ({ onNavigate }) => {
  // Animation cycle: 0 = EMAIL, 1 = WEB, 2 = PDF, 3 = PNG, 4 = ALL READY
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Smooth sequential looping animation
  useEffect(() => {
    if (prefersReducedMotion || isPaused) return;

    // Step 0..3: 1500ms each, Step 4 (all ready): 2600ms
    const duration = activeStep === 4 ? 2600 : 1500;
    const timer = setTimeout(() => {
      setActiveStep((prev) => (prev + 1) % 5);
    }, duration);

    return () => clearTimeout(timer);
  }, [activeStep, isPaused, prefersReducedMotion]);

  const formatTiles = [
    {
      id: 0,
      format: 'EMAIL',
      tag: 'HTML',
      subtitle: 'Email-compatible HTML',
      detail: 'Table-based markup tested across Gmail, Outlook & Apple Mail',
      icon: <Mail className="w-5 h-5 sm:w-5.5 sm:h-5.5" />,
      color: '#B86E52',
      bgColor: '#FFF5F0',
      borderColor: '#F6D0C3',
      activeBorderColor: '#B86E52',
      iconBg: '#FCE7DF',
      tagBg: '#FCE7DF',
      tagColor: '#9C5338',
    },
    {
      id: 1,
      format: 'WEB',
      tag: 'HTML',
      subtitle: 'Responsive HTML',
      detail: 'Interactive digital pass for mobile wallets & desktop check-in',
      icon: <Globe className="w-5 h-5 sm:w-5.5 sm:h-5.5" />,
      color: '#2563EB',
      bgColor: '#F0F7FF',
      borderColor: '#BAE6FD',
      activeBorderColor: '#2563EB',
      iconBg: '#DBEAFE',
      tagBg: '#DBEAFE',
      tagColor: '#1D4ED8',
    },
    {
      id: 2,
      format: 'PDF',
      tag: 'PRINT-READY',
      subtitle: 'Print-ready document',
      detail: 'Crisp vector A4 layout with verification stubs & barcode',
      icon: <FileText className="w-5 h-5 sm:w-5.5 sm:h-5.5" />,
      color: '#7C3AED',
      bgColor: '#F5F3FF',
      borderColor: '#DDD6FE',
      activeBorderColor: '#7C3AED',
      iconBg: '#EDE9FE',
      tagBg: '#EDE9FE',
      tagColor: '#6D28D9',
    },
    {
      id: 3,
      format: 'PNG',
      tag: '2000 × 1040',
      subtitle: '2000 × 1040 high-res badge',
      detail: 'Pixel-perfect digital asset for instant social sharing & badges',
      icon: <ImageIcon className="w-5 h-5 sm:w-5.5 sm:h-5.5" />,
      color: '#059669',
      bgColor: '#F0FDF4',
      borderColor: '#BBF7D0',
      activeBorderColor: '#059669',
      iconBg: '#DCFCE7',
      tagBg: '#DCFCE7',
      tagColor: '#047857',
    },
  ];

  return (
    <section
      id="designs"
      className="py-16 md:py-24 border-t border-b overflow-hidden relative"
      style={{
        backgroundColor: '#FAF8F5',
        borderColor: '#E9E5DC',
      }}
    >
      {/* Background subtle radial texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: 'radial-gradient(#DDD8CD 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* ================= LEFT CONTENT COLUMN ================= */}
          <div className="lg:col-span-5 space-y-6">
            {/* Eyebrow Pill */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full shadow-2xs"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E9E5DC',
              }}
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: '#B86E52' }}
              />
              <span className="text-[11px] font-bold tracking-wider uppercase" style={{ color: '#77736C' }}>
                PassForge • Features
              </span>
            </div>

            {/* Editorial Headline */}
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-serif leading-[1.12]"
              style={{ color: '#252525' }}
            >
              One platform.
              <br />
              <span style={{ color: '#B86E52' }}>Four ways to deliver.</span>
            </h2>

            {/* Editorial Description */}
            <p className="text-sm sm:text-base leading-relaxed" style={{ color: '#5F5B54' }}>
              Turn attendee data into personalized tickets in seconds. Generate email invitations,
              responsive web passes, print-ready PDFs, and high-resolution PNG badges — individually
              or in bulk.
            </p>

            {/* Key Value Propositions */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium" style={{ color: '#252525' }}>
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: '#EBF5ED',
                    border: '1px solid #CDE5D2',
                    color: '#2E683E',
                  }}
                >
                  <Check className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span>Individual and bulk generation</span>
              </div>

              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium" style={{ color: '#252525' }}>
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: '#EBF5ED',
                    border: '1px solid #CDE5D2',
                    color: '#2E683E',
                  }}
                >
                  <Check className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span>Zero template duplication across formats</span>
              </div>

              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium" style={{ color: '#252525' }}>
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: '#EBF5ED',
                    border: '1px solid #CDE5D2',
                    color: '#2E683E',
                  }}
                >
                  <Check className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span>Compiled via Hyper Elements SSR engine</span>
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-3">
              <button
                onClick={() => onNavigate('/app')}
                style={{
                  backgroundColor: '#B86E52',
                  color: '#FFFFFF',
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 shadow-md cursor-pointer group hover:opacity-95 hover:-translate-y-0.5"
              >
                <span>Create your tickets</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* ================= RIGHT-SIDE ILLUSTRATION ================= */}
          <div className="lg:col-span-7 flex flex-col items-center">
            {/* Unified Card Container with Clean Bezel (Vocova Reference Inspired) */}
            <div
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              className="w-full max-w-xl rounded-[28px] sm:rounded-[32px] p-4 sm:p-7 flex flex-col justify-between shadow-2xl relative overflow-hidden select-none"
              style={{
                backgroundColor: '#18191E',
                border: '8px solid #EAE6DC',
                outline: '1px solid #DDD8CD',
                boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.18)',
                color: '#FFFFFF',
              }}
            >
              {/* Subtle ambient spotlight in background */}
              <div
                className="absolute -top-24 -right-24 w-64 h-64 rounded-full pointer-events-none opacity-25 blur-3xl"
                style={{
                  background:
                    activeStep === 0
                      ? '#B86E52'
                      : activeStep === 1
                      ? '#2563EB'
                      : activeStep === 2
                      ? '#7C3AED'
                      : activeStep === 3
                      ? '#059669'
                      : '#10B981',
                  transition: 'background 0.5s ease',
                }}
              />

              {/* Top Bar: PassForge Export & Status Pill */}
              <div
                className="flex items-center justify-between pb-4 sm:pb-5 relative z-10"
                style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: '#262832',
                      border: '1px solid rgba(255,255,255,0.15)',
                    }}
                  >
                    <Layers className="w-3.5 h-3.5" style={{ color: '#B86E52' }} />
                  </div>
                  <span className="text-sm sm:text-base font-bold text-white tracking-tight">
                    PassForge Export
                  </span>
                </div>

                <div
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                  style={{
                    backgroundColor: 'rgba(5, 150, 105, 0.2)',
                    border: '1px solid rgba(5, 150, 105, 0.5)',
                    color: '#34D399',
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#34D399' }} />
                  <span>Ready</span>
                </div>
              </div>

              {/* 2x2 Floating Format Tiles Grid */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 my-4 sm:my-6 relative z-10">
                {formatTiles.map((tile) => {
                  const isActive = activeStep === tile.id || activeStep === 4;
                  return (
                    <div
                      key={tile.id}
                      onClick={() => {
                        setActiveStep(tile.id);
                        setIsPaused(true);
                      }}
                      className={`rounded-2xl p-3.5 sm:p-5 flex flex-col justify-between transition-all duration-300 ease-out cursor-pointer select-none min-h-[145px] sm:min-h-[165px] ${
                        isActive
                          ? 'shadow-lg -translate-y-1 scale-[1.02]'
                          : 'opacity-85 hover:opacity-100 hover:-translate-y-0.5'
                      }`}
                      style={{
                        backgroundColor: tile.bgColor,
                        border: `2px solid ${isActive ? tile.activeBorderColor : tile.borderColor}`,
                        color: '#252525',
                        boxShadow: isActive
                          ? `0 12px 28px -6px ${tile.color}33, 0 4px 12px -2px rgba(0,0,0,0.15)`
                          : '0 2px 6px rgba(0,0,0,0.06)',
                      }}
                    >
                      {/* Top: Format Icon & Tag */}
                      <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <div
                          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200"
                          style={{
                            backgroundColor: tile.iconBg,
                            color: tile.color,
                          }}
                        >
                          {tile.icon}
                        </div>

                        <span
                          className="text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md uppercase tracking-wider font-mono"
                          style={{
                            backgroundColor: tile.tagBg,
                            color: tile.tagColor,
                          }}
                        >
                          {tile.tag}
                        </span>
                      </div>

                      {/* Middle: Format Label & Subtitle */}
                      <div className="space-y-0.5 mb-1 sm:mb-2">
                        <h4
                          className="text-sm sm:text-lg font-black tracking-wider uppercase font-sans"
                          style={{ color: tile.color }}
                        >
                          {tile.format}
                        </h4>
                        <p className="text-[11px] sm:text-xs font-bold text-neutral-800 tracking-tight leading-tight">
                          {tile.subtitle}
                        </p>
                      </div>

                      {/* Bottom: Technical specification */}
                      <p className="text-[10px] sm:text-[11px] text-neutral-600 font-medium leading-snug line-clamp-2">
                        {tile.detail}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Bar: 4 Formats Ready / Generated Status */}
              <div
                className="flex items-center justify-between pt-3 sm:pt-4 text-xs relative z-10"
                style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[11px] sm:text-xs" style={{ color: '#9CA3AF' }}>
                    {activeStep === 4 ? (
                      <span className="font-bold flex items-center gap-1.5" style={{ color: '#34D399' }}>
                        <span
                          className="w-2 h-2 rounded-full animate-ping inline-block"
                          style={{ backgroundColor: '#34D399' }}
                        />
                        All 4 formats ready
                      </span>
                    ) : (
                      <span>4 formats generated</span>
                    )}
                  </span>
                </div>

                <div className="inline-flex items-center gap-1.5 font-semibold text-xs" style={{ color: '#34D399' }}>
                  <span className="hidden sm:inline text-[11px] font-mono" style={{ color: '#6B7280' }}>
                    Hyper Elements SSR
                  </span>
                  <CheckCircle2
                    className={`w-4 h-4 transition-transform duration-300 ${
                      activeStep === 4 ? 'scale-125' : 'scale-100'
                    }`}
                    style={{ color: '#34D399' }}
                  />
                </div>
              </div>
            </div>

            {/* Conceptual Layout Footnote - Generous Margin to Avoid Any Overlap */}
            <p
              className="text-[11px] sm:text-xs text-center mt-5 text-[#77736C] max-w-md font-medium leading-relaxed"
            >
              Conceptual layout — illustrates multi-channel export capabilities, not actual ticket previews.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};
