import React from 'react';
import { DesignMetadata, TicketDesignId } from '@passforge/shared';
import { CheckCircle2, Sparkles, Terminal, BookOpen } from 'lucide-react';

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
      onClick={() => onSelect(design.id)}
      className={`relative cursor-pointer rounded-2xl border-2 transition-all p-5 flex flex-col justify-between ${
        isSelected
          ? 'border-indigo-500 bg-slate-900/95 shadow-xl shadow-indigo-500/10 ring-2 ring-indigo-500/20'
          : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/80'
      }`}
    >
      {/* Top Banner / Selection Status */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isTech
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}
            >
              {isTech ? <Terminal className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Layout Option
              </span>
              <h3 className="text-base font-bold text-white tracking-tight leading-tight">
                {design.name}
              </h3>
            </div>
          </div>

          {isSelected ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Active
            </span>
          ) : (
            <span className="text-[11px] font-medium text-slate-500 hover:text-slate-300">
              Select
            </span>
          )}
        </div>

        {/* Visual Mock Card Preview */}
        <div
          className={`h-28 w-full rounded-xl border p-3 flex flex-col justify-between my-3 transition-transform ${
            isTech
              ? 'bg-[#0a0e17] border-cyan-500/30 text-white'
              : 'bg-[#faf8f5] border-amber-900/20 text-slate-900 shadow-sm'
          }`}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: design.defaultAccentColor }}
              />
              <span
                className={`text-[9px] font-mono uppercase tracking-wider font-bold ${
                  isTech ? 'text-cyan-400' : 'text-amber-800'
                }`}
              >
                {isTech ? 'KIET TECHFEST' : 'CURATED GALA SERIES'}
              </span>
            </div>
            <span
              className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                isTech
                  ? 'bg-amber-950/80 text-amber-300 border border-amber-700/50'
                  : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}
            >
              VIP PASS
            </span>
          </div>

          <div className="my-auto">
            <p className={`text-xs font-bold leading-tight ${isTech ? 'text-white' : 'text-stone-900'}`}>
              Maksud Rahman
            </p>
            <p className={`text-[10px] ${isTech ? 'text-slate-400' : 'text-stone-500'}`}>
              Seat A-104 • Auditorium Block A
            </p>
          </div>

          <div
            className={`flex justify-between items-center pt-1 border-t text-[8px] font-mono ${
              isTech ? 'border-slate-800 text-slate-500' : 'border-stone-200 text-stone-400'
            }`}
          >
            <span>REF: KTF27-VIP-84920</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              CONFIRMED
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed mb-3">
          {design.description}
        </p>
      </div>

      {/* Visual Direction Tags */}
      <div className="pt-3 border-t border-slate-800/80 flex flex-wrap gap-1.5">
        {design.tags.map((tag) => (
          <span
            key={tag}
            className="text-[10px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/50"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};
