import React, { useState } from 'react';
import { DesignMetadata, TicketDesignId } from '@passforge/shared';
import { DesignCard } from './DesignCard.js';
import { Layers, PanelLeftClose, Sparkles } from 'lucide-react';

interface DesignGalleryProps {
  designs: DesignMetadata[];
  selectedDesignId: TicketDesignId;
  onSelectDesign: (id: TicketDesignId) => void;
  onCollapse?: () => void;
}

export const DesignGallery: React.FC<DesignGalleryProps> = ({
  designs,
  selectedDesignId,
  onSelectDesign,
  onCollapse,
}) => {
  const [filter, setFilter] = useState<'all' | 'tech' | 'editorial'>('all');

  const filteredDesigns = designs.filter((d) => {
    if (filter === 'tech') return d.id === 'tech';
    if (filter === 'editorial') return d.id === 'editorial';
    return true;
  });

  return (
    <div className="bg-white border border-[#E9E5DC] rounded-2xl shadow-xs h-full flex flex-col overflow-hidden">
      {/* Header with Title, Count & Collapse Button */}
      <div className="p-3 border-b border-[#E9E5DC] flex items-center justify-between shrink-0 bg-[#FAF8F5]/60">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#FBF2EE] text-[#B86E52] border border-[#F0D5C9] flex items-center justify-center shrink-0">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#252525] uppercase tracking-wider">
              Templates
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F0EDE6] text-[#77736C] font-semibold">
            {designs.length} layouts
          </span>
          {onCollapse && (
            <button
              onClick={onCollapse}
              className="p-1 rounded-md text-[#77736C] hover:text-[#252525] hover:bg-white transition-colors cursor-pointer"
              title="Collapse template sidebar"
              aria-label="Collapse template sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Canva-Style Category Filter Chips */}
      <div className="px-3 pt-2.5 pb-1 flex items-center gap-1.5 border-b border-[#F0EDE6] shrink-0 bg-[#FAF8F5]/30">
        <button
          onClick={() => setFilter('all')}
          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
            filter === 'all'
              ? 'bg-[#B86E52] text-white shadow-xs'
              : 'bg-white text-[#77736C] border border-[#E9E5DC] hover:text-[#252525]'
          }`}
        >
          All ({designs.length})
        </button>
        <button
          onClick={() => setFilter('tech')}
          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
            filter === 'tech'
              ? 'bg-[#0E7490] text-white shadow-xs'
              : 'bg-white text-[#77736C] border border-[#E9E5DC] hover:text-[#252525]'
          }`}
        >
          Tech
        </button>
        <button
          onClick={() => setFilter('editorial')}
          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
            filter === 'editorial'
              ? 'bg-[#B45309] text-white shadow-xs'
              : 'bg-white text-[#77736C] border border-[#E9E5DC] hover:text-[#252525]'
          }`}
        >
          Editorial
        </button>
      </div>

      {/* Visual Template Cards Scroll Area */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-3 pb-6">
        {filteredDesigns.map((design) => (
          <DesignCard
            key={design.id}
            design={design}
            isSelected={selectedDesignId === design.id}
            onSelect={onSelectDesign}
          />
        ))}
      </div>

      {/* Templates Footer Quick Note */}
      <div className="p-2.5 border-t border-[#E9E5DC] bg-[#FAF8F5] text-center text-[10px] text-[#77736C] font-mono shrink-0">
        Multi-format Hyper Elements SSR
      </div>
    </div>
  );
};
