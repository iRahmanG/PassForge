import React from 'react';
import { DesignMetadata, TicketDesignId } from '@passforge/shared';
import { CheckCircle2, QrCode, Feather, Terminal, Sparkles } from 'lucide-react';

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

  return (
    <div
      data-testid={`design-card-${design.id}`}
      onClick={() => onSelect(design.id)}
      className={`relative cursor-pointer rounded-xl border-2 transition-all duration-150 flex flex-col justify-between overflow-hidden group ${
        isSelected
          ? 'border-[#B86E52] bg-white shadow-md ring-2 ring-[#B86E52]/20'
          : 'border-[#E9E5DC] bg-white hover:border-[#DDD8CD] hover:shadow-xs'
      }`}
    >
      {/* Large Visual Ticket Artboard Preview */}
      <div className="p-2.5 bg-[#FAF8F5]/60 border-b border-[#F0EDE6]">
        {isTech ? (
          /* Tech / Hackathon Miniature Mockup */
          <div className="rounded-lg border border-cyan-500/30 bg-[#070b14] p-2.5 text-white shadow-sm relative overflow-hidden transition-all group-hover:border-cyan-500/50">
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, #06b6d4 1px, transparent 0)',
                backgroundSize: '10px 10px',
              }}
            />

            <div className="relative z-10 space-y-1.5">
              <div className="flex justify-between items-center pb-1 border-b border-cyan-500/20">
                <span className="text-[9px] font-mono uppercase font-bold tracking-wider text-cyan-300">
                  TECHFEST 2027
                </span>
                <span className="text-[8px] font-mono px-1.5 py-0.2 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-600/40 font-bold uppercase">
                  VIP PASS
                </span>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[7px] font-mono text-slate-400 uppercase">ATTENDEE</p>
                  <p className="text-xs font-extrabold text-white tracking-tight">
                    Maksud Rahman
                  </p>
                  <p className="text-[8px] font-mono text-cyan-400 mt-0.5">
                    SEAT: A-104
                  </p>
                </div>
                <div className="w-6 h-6 rounded bg-black/60 border border-cyan-500/30 flex items-center justify-center p-0.5">
                  <QrCode className="w-full h-full text-cyan-400" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Editorial Luxury Miniature Mockup */
          <div className="rounded-lg border border-[#DDD8CD] bg-[#FAF8F5] p-2.5 text-stone-900 shadow-sm relative overflow-hidden transition-all group-hover:border-[#B86E52]/40">
            <div className="border border-stone-200/90 rounded-lg p-2 bg-white/80 space-y-1">
              <div className="flex justify-between items-center pb-1 border-b border-stone-200">
                <div className="flex items-center gap-1">
                  <Feather className="w-3 h-3 text-[#B86E52]" />
                  <span className="text-[9px] font-serif uppercase tracking-widest text-stone-800 font-semibold">
                    TechFest • MMXXVII
                  </span>
                </div>
                <span className="text-[8px] font-serif uppercase px-1.5 py-0.2 rounded bg-amber-50 text-[#B86E52] border border-amber-300 font-bold">
                  VIP Pass
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[7px] uppercase tracking-widest text-stone-500">
                    Honored Guest
                  </p>
                  <p className="text-xs font-serif font-bold text-stone-900 tracking-tight">
                    Maksud Rahman
                  </p>
                  <p className="text-[8px] text-stone-600 font-serif italic">
                    Reserved Seat A-104
                  </p>
                </div>
                <div className="w-6 h-6 rounded bg-stone-50 border border-stone-300 p-0.5 flex items-center justify-center">
                  <QrCode className="w-full h-full text-stone-800" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Card Info Bar & Feature Badges */}
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-[#252525] truncate">
              {design.name}
            </h4>
            <span className="text-[10px] text-[#77736C]">
              {isTech ? 'Terminal / Hackathon Matrix' : 'Letterpress & Formal Gala'}
            </span>
          </div>

          {isSelected ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FBF2EE] text-[#B86E52] border border-[#F0D5C9] shrink-0">
              <CheckCircle2 className="w-3 h-3 text-[#B86E52]" />
              Active
            </span>
          ) : (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full text-[#77736C] bg-[#FAF8F5] border border-[#E9E5DC] group-hover:border-[#DDD8CD] transition-colors shrink-0">
              Apply
            </span>
          )}
        </div>

        {/* Feature Tags */}
        <div className="flex items-center gap-1.5 pt-1 text-[9px] font-mono text-[#77736C] border-t border-[#F0EDE6]">
          <span className="px-1.5 py-0.2 rounded bg-[#FAF8F5] border border-[#E9E5DC]">
            {isTech ? 'Terminal HUD' : 'Foil Stamp'}
          </span>
          <span className="px-1.5 py-0.2 rounded bg-[#FAF8F5] border border-[#E9E5DC]">
            Dynamic QR
          </span>
          <span className="px-1.5 py-0.2 rounded bg-[#FAF8F5] border border-[#E9E5DC]">
            4 Formats
          </span>
        </div>
      </div>
    </div>
  );
};
