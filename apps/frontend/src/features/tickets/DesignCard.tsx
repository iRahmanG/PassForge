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

  // Template Information mapping
  const templateTitle = isTech ? 'Cyber Tech Hackathon' : 'Editorial Formal Gala';
  const templateCategory = isTech ? 'Terminal • Event Pass' : 'Letterpress • Formal Gala';

  // Curated concise feature pills (max 3, auto-wrap, no technical jargon)
  const pills = ['QR Enabled', 'Printable', 'Multi Format'];

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
              /* Cyber Tech Minimal Ticket Preview */
              <div className="relative w-full h-full bg-[#090D16] text-white p-3.5 sm:p-4 flex flex-col justify-between">
                {/* Subtle cyber dot grid & ambient glow */}
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, #38bdf8 1px, transparent 0)',
                    backgroundSize: '12px 12px',
                  }}
                />
                {/* Subtle dark gradient overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                {/* Top Row: Event Name & VIP Badge */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-[11px] sm:text-xs font-mono font-bold tracking-wider text-cyan-300 uppercase">
                    TECHFEST 2027
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-cyan-950/90 text-cyan-300 border border-cyan-500/30">
                    VIP PASS
                  </span>
                </div>

                {/* Bottom Row: Attendee Name + Seat and Clean QR Code */}
                <div className="relative z-10 flex items-end justify-between pt-1">
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-white tracking-tight">
                      Maksud Rahman
                    </p>
                    <p className="text-[10px] sm:text-[11px] font-mono text-cyan-400/90 font-medium mt-0.5">
                      A-104
                    </p>
                  </div>
                  <div className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-lg bg-black/80 border border-cyan-500/40 flex items-center justify-center p-1 text-cyan-300 shrink-0">
                    <QrCode className="w-full h-full" />
                  </div>
                </div>
              </div>
            ) : (
              /* Editorial Formal Gala Minimal Ticket Preview */
              <div className="relative w-full h-full bg-[#FAF8F5] text-stone-900 p-3.5 sm:p-4 flex flex-col justify-between border border-[#E8E3D9]">
                {/* Subtle dark vignette overlay for soft readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/5 via-transparent to-transparent pointer-events-none" />

                {/* Top Row: Event Name & VIP Badge */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-[11px] sm:text-xs font-serif font-bold tracking-wider text-stone-900">
                    TechFest 2027
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-serif font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-300">
                    VIP PASS
                  </span>
                </div>

                {/* Bottom Row: Attendee Name + Seat and Clean QR Code */}
                <div className="relative z-10 flex items-end justify-between pt-1">
                  <div>
                    <p className="text-xs sm:text-sm font-serif font-bold text-stone-900 tracking-tight">
                      Maksud Rahman
                    </p>
                    <p className="text-[10px] sm:text-[11px] font-serif italic text-stone-600 mt-0.5">
                      A-104
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

        {/* Middle Section: Template Information */}
        <div className="mt-4 space-y-1">
          <h3 className="text-base sm:text-[17px] font-semibold text-neutral-900 truncate tracking-tight">
            {templateTitle}
          </h3>
          <p className="text-[13px] text-neutral-500 font-normal">
            {templateCategory}
          </p>
        </div>

        {/* Feature Pills (Max 2-3, auto-wrap, 12px) */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3">
          {pills.map((pill) => (
            <span
              key={pill}
              className="inline-flex items-center text-[12px] font-medium px-2.5 py-0.5 rounded-md bg-neutral-100 text-neutral-600 border border-neutral-200/60"
            >
              {pill}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Section: Footer (Active Badge & Use Button) */}
      <div className="mt-4 pt-3.5 border-t border-[#EAEAEA] flex items-center justify-between gap-2">
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
