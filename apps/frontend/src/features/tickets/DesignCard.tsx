import React from 'react';
import { DesignMetadata, TicketDesignId } from '@passforge/shared';
import { QrCode, ArrowRight, Check } from 'lucide-react';

interface DesignCardProps {
  design: DesignMetadata;
  isSelected: boolean;
  onSelect: (id: TicketDesignId) => void;
}

export const DesignCard: React.FC<DesignCardProps> = ({
  design,
  isSelected,
  onSelect,
}) => {
  const isTech = design.id === 'tech';
  const isVintage = design.id === 'vintage';
  const isFestival = design.id === 'festival';

  // Template Information mapping
  let templateTitle = 'Editorial Formal Gala';
  let templateCategory = 'Letterpress • Formal Gala';

  if (isTech) {
    templateTitle = 'Cyber Tech Hackathon';
    templateCategory = 'Terminal • Event Pass';
  } else if (isVintage) {
    templateTitle = 'Vintage Cinema Stub';
    templateCategory = 'Classic • Perforated Stub';
  } else if (isFestival) {
    templateTitle = 'Neon Festival Pass';
    templateCategory = 'Concert • Fast-Track VIP';
  }

  return (
    <div
      data-testid={`design-card-${design.id}`}
      onClick={() => onSelect(design.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(design.id);
        }
      }}
      className={`group relative cursor-pointer rounded-[20px] bg-white border transition-all duration-300 ease-out flex flex-col justify-between overflow-hidden p-4 sm:p-5 select-none hover:-translate-y-1 ${
        isSelected
          ? 'border-neutral-900 ring-2 ring-neutral-900/10 shadow-lg'
          : 'border-[#EAEAEA] hover:border-neutral-300 hover:shadow-xl shadow-xs'
      }`}
    >
      {/* Top Section: Hero Preview Area (16:9, ~70% visual hero weight) */}
      <div className="w-full">
        <div className="relative w-full aspect-video rounded-[16px] overflow-hidden">
          {/* Zoom container on card hover */}
          <div className="w-full h-full transition-transform duration-300 ease-out group-hover:scale-103">
            {isTech ? (
              /* 1. Cyber Tech Minimal Ticket Preview */
              <div
                className="relative w-full h-full p-3.5 sm:p-4 flex flex-col justify-between"
                style={{ backgroundColor: '#090D16', color: '#ffffff' }}
              >
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, #38bdf8 1px, transparent 0)',
                    backgroundSize: '12px 12px',
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-[11px] sm:text-xs font-mono font-bold tracking-wider text-cyan-300 uppercase">
                    TECHFEST 2027
                  </span>
                  <span
                    className="text-[9px] sm:text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: '#083344', color: '#67e8f9', border: '1px solid #06b6d4' }}
                  >
                    VIP PASS
                  </span>
                </div>

                <div className="relative z-10 flex items-end justify-between pt-1">
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-white tracking-tight">
                      Alex Morgan
                    </p>
                    <p className="text-[10px] sm:text-[11px] font-mono text-cyan-400 font-medium mt-0.5">
                      Seat A-104
                    </p>
                  </div>
                  <div
                    className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-lg flex items-center justify-center p-1 shrink-0"
                    style={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid #06b6d4', color: '#67e8f9' }}
                  >
                    <QrCode className="w-full h-full" />
                  </div>
                </div>
              </div>
            ) : isVintage ? (
              /* 2. Vintage Cinema & Event Stub Preview (Images 1 & 2) */
              <div
                className="relative w-full h-full p-2.5 sm:p-3 flex items-stretch overflow-hidden"
                style={{ backgroundColor: '#FAF4E8', border: '2px solid #C23B38', borderRadius: '12px', color: '#26221F' }}
              >
                {/* Left perforated tear stub */}
                <div
                  className="w-11 pr-2 flex flex-col justify-between items-center text-center shrink-0"
                  style={{ borderRight: '1.5px dashed #C23B38' }}
                >
                  <span className="text-[7px] font-mono font-bold" style={{ color: '#C23B38' }}>№ 324</span>
                  <span
                    className="text-[8px] font-bold tracking-widest uppercase font-serif"
                    style={{ color: '#26221F', transform: 'rotate(-90deg)', whiteSpace: 'nowrap' }}
                  >
                    ADMIT ONE
                  </span>
                  <span className="text-[8px]" style={{ color: '#C23B38' }}>★</span>
                </div>

                {/* Center ticket body */}
                <div className="flex-1 px-3 flex flex-col justify-between min-w-0">
                  <div className="flex items-center justify-between border-b pb-1" style={{ borderColor: 'rgba(194,59,56,0.3)' }}>
                    <span className="text-[9px] font-serif font-bold tracking-widest uppercase" style={{ color: '#C23B38' }}>
                      ★ TICKET ★
                    </span>
                    <span
                      className="text-[7px] font-bold px-1.5 py-0.2 rounded"
                      style={{ backgroundColor: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5' }}
                    >
                      VIP
                    </span>
                  </div>

                  <div className="py-0.5 text-center">
                    <p className="text-xs sm:text-sm font-serif font-bold text-neutral-900 truncate">
                      Alex Morgan
                    </p>
                    <p className="text-[9px] font-serif" style={{ color: '#786F66' }}>
                      Seat A-104 • Gate 2
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[7px] font-mono pt-1 border-t" style={{ borderColor: 'rgba(194,59,56,0.3)', color: '#786F66' }}>
                    <span>15 FEB 2027</span>
                    <span className="font-bold" style={{ color: '#C23B38' }}>STAGE PASS</span>
                  </div>
                </div>

                {/* Right stub with QR */}
                <div
                  className="w-11 pl-2 flex flex-col justify-between items-center shrink-0"
                  style={{ borderLeft: '1.5px dashed #C23B38' }}
                >
                  <span className="text-[7px] font-bold uppercase" style={{ color: '#C23B38' }}>SCAN</span>
                  <div className="w-7 h-7 p-0.5 rounded bg-white" style={{ border: '1px solid #D6CEBE' }}>
                    <QrCode className="w-full h-full text-neutral-900" />
                  </div>
                  <span className="text-[6px] font-mono" style={{ color: '#786F66' }}>VALID</span>
                </div>
              </div>
            ) : isFestival ? (
              /* 3. Neon Festival & Concert Pass Preview (Image 3) */
              <div
                className="relative w-full h-full p-2.5 sm:p-3 flex flex-col justify-between overflow-hidden"
                style={{ backgroundColor: '#131538', border: '2px solid #FF2E93', borderRadius: '12px', color: '#ffffff' }}
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-extrabold tracking-widest uppercase" style={{ color: '#FF2E93' }}>
                    TICKET • 1 PERSON
                  </span>
                  <span
                    className="text-[7px] font-extrabold px-1.5 py-0.5 rounded-full uppercase"
                    style={{ backgroundColor: '#FF2E93', color: '#ffffff' }}
                  >
                    VIP PASS
                  </span>
                </div>

                {/* 3 Iconic Badges: [GATE] [ROW] [SEAT] directly from Image 3 */}
                <div className="flex items-center justify-between gap-1.5 py-1">
                  <div className="flex items-center gap-1">
                    <div
                      className="px-1.5 py-0.5 rounded text-center min-w-7"
                      style={{ backgroundColor: '#FF2E93', color: '#ffffff' }}
                    >
                      <span className="text-[5px] block font-bold text-white/80">GATE</span>
                      <span className="text-[10px] font-black leading-none">01</span>
                    </div>
                    <div
                      className="px-1.5 py-0.5 rounded text-center min-w-7"
                      style={{ backgroundColor: '#FF2E93', color: '#ffffff' }}
                    >
                      <span className="text-[5px] block font-bold text-white/80">ROW</span>
                      <span className="text-[10px] font-black leading-none">02</span>
                    </div>
                    <div
                      className="px-1.5 py-0.5 rounded text-center min-w-7"
                      style={{ backgroundColor: '#FF2E93', color: '#ffffff' }}
                    >
                      <span className="text-[5px] block font-bold text-white/80">SEAT</span>
                      <span className="text-[10px] font-black leading-none">03</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] font-black text-white block">17 MAY</span>
                    <span className="text-[8px] font-bold" style={{ color: '#00D2FF' }}>8:00 PM</span>
                  </div>
                </div>

                {/* Bottom */}
                <div className="flex items-center justify-between pt-1 border-t" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
                  <div>
                    <p className="text-xs font-bold text-white leading-tight">Alex Morgan</p>
                    <p className="text-[8px] font-bold" style={{ color: '#00D2FF' }}>ADMIT ONE</p>
                  </div>
                  <div className="w-7 h-7 p-0.5 rounded bg-white text-neutral-900">
                    <QrCode className="w-full h-full text-neutral-950" />
                  </div>
                </div>
              </div>
            ) : (
              /* 4. Editorial Formal Gala Minimal Ticket Preview */
              <div
                className="relative w-full h-full p-3.5 sm:p-4 flex flex-col justify-between border"
                style={{ backgroundColor: '#FAF8F5', color: '#1c1917', borderColor: '#E8E3D9' }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/5 via-transparent to-transparent pointer-events-none" />

                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-[11px] sm:text-xs font-serif font-bold tracking-wider text-stone-900">
                    TechFest 2027
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-serif font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-300">
                    VIP PASS
                  </span>
                </div>

                <div className="relative z-10 flex items-end justify-between pt-1">
                  <div>
                    <p className="text-xs sm:text-sm font-serif font-bold text-stone-900 tracking-tight">
                      Alex Morgan
                    </p>
                    <p className="text-[10px] sm:text-[11px] font-serif italic text-stone-600 mt-0.5">
                      Seat A-104
                    </p>
                  </div>
                  <div className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-lg bg-white border border-stone-300 flex items-center justify-center p-1 text-stone-800 shrink-0 shadow-xs">
                    <QrCode className="w-full h-full" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Middle Section: Template Information (Clean & Minimal without redundant pills) */}
        <div className="mt-3.5 space-y-0.5">
          <h3 className="text-sm sm:text-base font-bold text-neutral-900 truncate tracking-tight">
            {templateTitle}
          </h3>
          <p className="text-xs text-neutral-500 font-medium">
            {templateCategory}
          </p>
        </div>
      </div>

      {/* Bottom Section: Footer (Active Badge & Use Button) */}
      <div className="mt-3 pt-3 border-t border-[#EAEAEA] flex items-center justify-between gap-2">
        {/* Left: Active Badge */}
        {isSelected ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs text-neutral-400 font-medium px-1">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
            Available
          </span>
        )}

        {/* Right: Use Template Action */}
        <div
          className={`text-xs font-semibold inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
            isSelected
              ? 'bg-neutral-900 text-white'
              : 'bg-neutral-100 text-neutral-700 group-hover:bg-neutral-200 group-hover:text-neutral-900'
          }`}
        >
          {isSelected ? (
            <>
              <span>Selected</span>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            </>
          ) : (
            <>
              <span>Use</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
