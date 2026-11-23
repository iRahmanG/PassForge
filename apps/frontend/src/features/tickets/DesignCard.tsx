import React from 'react';
import { DesignMetadata, TicketDesignId } from '@passforge/shared';
import { CheckCircle2, Terminal, BookOpen, QrCode, Feather } from 'lucide-react';

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
      className={`relative cursor-pointer rounded-2xl border-2 transition-all duration-150 flex flex-col justify-between overflow-hidden group ${
        isSelected
          ? 'border-[#B86E52] bg-white shadow-md ring-2 ring-[#B86E52]/20'
          : 'border-[#E9E5DC] bg-white hover:border-[#DDD8CD] hover:bg-[#FAF8F5]'
      }`}
    >
      {/* Top Banner & Status Header */}
      <div className="p-4 pb-3">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                isTech
                  ? 'bg-slate-900 text-cyan-400 border border-slate-800'
                  : 'bg-[#FBF2EE] text-[#B86E52] border border-[#F0D5C9]'
              }`}
            >
              {isTech ? <Terminal className="w-3.5 h-3.5" /> : <BookOpen className="w-3.5 h-3.5" />}
            </div>
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#77736C] block">
                {isTech ? 'Cyber Tech' : 'Editorial'}
              </span>
              <h3 className="text-sm font-bold text-[#252525] tracking-tight leading-snug">
                {design.name}
              </h3>
            </div>
          </div>

          {isSelected ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FBF2EE] text-[#B86E52] border border-[#F0D5C9] shrink-0">
              <CheckCircle2 className="w-3 h-3 text-[#B86E52]" />
              Active
            </span>
          ) : (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-[#77736C] bg-[#FAF8F5] border border-[#E9E5DC] group-hover:border-[#DDD8CD] group-hover:text-[#252525] transition-colors shrink-0">
              Select
            </span>
          )}
        </div>

        {/* AUTHENTIC MINIATURE TICKET PREVIEW */}
        {isTech ? (
          /* Tech / Hackathon Miniature Mockup (Preserving its true dark cyber navy identity) */
          <div className="rounded-xl border border-cyan-500/30 bg-[#070b14] p-3 text-white shadow-sm relative overflow-hidden transition-all group-hover:border-cyan-500/50 my-2">
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, #06b6d4 1px, transparent 0)',
                backgroundSize: '10px 10px',
              }}
            />

            <div className="relative z-10 space-y-2">
              <div className="flex justify-between items-center pb-1.5 border-b border-cyan-500/20">
                <span className="text-[9px] font-mono uppercase font-bold tracking-wider text-cyan-300">
                  TECHFEST 2027
                </span>
                <span className="text-[8px] font-mono px-1.5 py-0.2 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-600/40 font-bold uppercase">
                  VIP PASS
                </span>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[8px] font-mono text-slate-400 uppercase">ATTENDEE</p>
                  <p className="text-xs font-extrabold text-white tracking-tight">
                    Maksud Rahman
                  </p>
                  <p className="text-[9px] font-mono text-cyan-400 mt-0.5">
                    SEAT: A-104
                  </p>
                </div>
                <div className="w-7 h-7 rounded bg-black/60 border border-cyan-500/30 flex items-center justify-center p-0.5">
                  <QrCode className="w-full h-full text-cyan-400" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Editorial Luxury Miniature Mockup (Preserving its authentic warm cream aesthetic) */
          <div className="rounded-xl border border-[#DDD8CD] bg-[#FAF8F5] p-3 text-stone-900 shadow-sm relative overflow-hidden transition-all group-hover:border-[#B86E52]/40 my-2">
            <div className="border border-stone-200/90 rounded-lg p-2 bg-white/80 space-y-1.5">
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
                <div className="w-7 h-7 rounded bg-stone-50 border border-stone-300 p-0.5 flex items-center justify-center">
                  <QrCode className="w-full h-full text-stone-800" />
                </div>
              </div>
            </div>
          </div>
        )}

        <p className="text-[11px] text-[#77736C] leading-relaxed line-clamp-2 mt-1">
          {design.description}
        </p>
      </div>

      {/* Visual Direction Tags */}
      <div className="p-3 pt-2 border-t border-[#E9E5DC] flex flex-wrap gap-1 bg-[#FAF8F5]/60">
        {design.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-[9px] px-2 py-0.5 rounded-md bg-white text-[#504D47] border border-[#E9E5DC]"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};