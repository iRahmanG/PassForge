import React, { useState } from 'react';
import { DesignMetadata, TicketDesignId } from '@passforge/shared';
import { DesignCard } from './DesignCard.js';
import { Layers, PanelLeftClose, Maximize2, X, Sparkles } from 'lucide-react';

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
  const [filter, setFilter] = useState<'all' | 'tech' | 'editorial' | 'vintage' | 'festival'>('all');
  const [isGridModalOpen, setIsGridModalOpen] = useState(false);

  const filteredDesigns = designs.filter((d) => {
    if (filter === 'tech') return d.id === 'tech';
    if (filter === 'editorial') return d.id === 'editorial';
    if (filter === 'vintage') return d.id === 'vintage';
    if (filter === 'festival') return d.id === 'festival';
    return true;
  });

  return (
    <>
      {/* Sidebar Gallery Container */}
      <div className="bg-white border border-[#EAEAEA] rounded-[20px] shadow-xs h-full flex flex-col overflow-hidden">
        {/* Header with Title, Count, Grid Expand & Collapse */}
        <div className="p-3.5 sm:p-4 border-b border-[#EAEAEA] flex items-center justify-between shrink-0 bg-[#FAF8F5]/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-neutral-100 text-neutral-800 border border-neutral-200/80 flex items-center justify-center shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-[13px] font-bold text-neutral-900 uppercase tracking-wider">
                Templates
              </h3>
              <p className="text-[11px] text-neutral-500 font-medium">
                {designs.length} curated designs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Expand to responsive grid modal */}
            <button
              onClick={() => setIsGridModalOpen(true)}
              className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
              title="Expand template grid"
              aria-label="Expand template grid"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>

            {onCollapse && (
              <button
                onClick={onCollapse}
                className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                title="Collapse template sidebar"
                aria-label="Collapse template sidebar"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Clean Filter Chips (SaaS Neutral Styling) */}
        <div className="px-3.5 py-2.5 flex items-center gap-1.5 border-b border-[#EAEAEA] shrink-0 bg-[#FAF8F5]/30">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold tracking-wide transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'bg-white text-neutral-600 border border-[#EAEAEA] hover:text-neutral-900 hover:border-neutral-300'
            }`}
          >
            All ({designs.length})
          </button>
          <button
            onClick={() => setFilter('tech')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold tracking-wide transition-all cursor-pointer ${
              filter === 'tech'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'bg-white text-neutral-600 border border-[#EAEAEA] hover:text-neutral-900 hover:border-neutral-300'
            }`}
          >
            Terminal Tech
          </button>
          <button
            onClick={() => setFilter('editorial')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold tracking-wide transition-all cursor-pointer ${
              filter === 'editorial'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'bg-white text-neutral-600 border border-[#EAEAEA] hover:text-neutral-900 hover:border-neutral-300'
            }`}
          >
            Editorial
          </button>
          <button
            onClick={() => setFilter('vintage')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold tracking-wide transition-all cursor-pointer ${
              filter === 'vintage'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'bg-white text-neutral-600 border border-[#EAEAEA] hover:text-neutral-900 hover:border-neutral-300'
            }`}
          >
            Vintage Stub
          </button>
          <button
            onClick={() => setFilter('festival')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold tracking-wide transition-all cursor-pointer ${
              filter === 'festival'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'bg-white text-neutral-600 border border-[#EAEAEA] hover:text-neutral-900 hover:border-neutral-300'
            }`}
          >
            Festival
          </button>
        </div>

        {/* Template Cards Scroll Area */}
        <div className="flex-1 min-h-0 overflow-y-auto p-3.5 sm:p-4 space-y-4 pb-6 overscroll-contain">
          {filteredDesigns.map((design) => (
            <DesignCard
              key={design.id}
              design={design}
              isSelected={selectedDesignId === design.id}
              onSelect={onSelectDesign}
            />
          ))}
        </div>

        {/* Templates Footer Note */}
        <div className="p-2.5 border-t border-[#EAEAEA] bg-[#FAF8F5] text-center text-[11px] text-neutral-500 font-medium shrink-0">
          Hyper Elements SSR • 4 Native Formats
        </div>
      </div>

      {/* EXPANDED FULL RESPONSIVE GRID MODAL */}
      {isGridModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-[24px] border border-[#EAEAEA] shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-[#EAEAEA] flex items-center justify-between bg-[#FAF8F5]/60">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-neutral-100 text-neutral-700 border border-neutral-200">
                    <Sparkles className="w-3 h-3" />
                    Template Library
                  </span>
                  <span className="text-xs text-neutral-500">
                    {designs.length} production designs
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-neutral-900">
                  Select Ticket Template
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500">
                  Switch aesthetics instantly. All attendee data, branding tokens, and formats sync automatically.
                </p>
              </div>

              <button
                onClick={() => setIsGridModalOpen(false)}
                className="p-2 rounded-xl text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 border border-[#EAEAEA] transition-colors cursor-pointer"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Bar */}
            <div className="px-6 py-3 border-b border-[#EAEAEA] flex items-center gap-2 bg-white">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filter === 'all'
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                All Templates ({designs.length})
              </button>
              <button
                onClick={() => setFilter('tech')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filter === 'tech'
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                Terminal Tech
              </button>
              <button
                onClick={() => setFilter('editorial')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filter === 'editorial'
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                Editorial
              </button>
              <button
                onClick={() => setFilter('vintage')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filter === 'vintage'
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                Vintage Stub
              </button>
              <button
                onClick={() => setFilter('festival')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filter === 'festival'
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                Festival
              </button>
            </div>

            {/* Responsive Grid: 1 col mobile, 2 cols tablet, 3-4 cols desktop */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
                {filteredDesigns.map((design) => (
                  <div key={design.id} className="h-full">
                    <DesignCard
                      design={design}
                      isSelected={selectedDesignId === design.id}
                      onSelect={(id) => {
                        onSelectDesign(id);
                        setIsGridModalOpen(false);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#EAEAEA] bg-[#FAF8F5] flex items-center justify-between text-xs text-neutral-500">
              <span>Click any card to apply template immediately</span>
              <button
                onClick={() => setIsGridModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-neutral-900 text-white font-semibold text-xs hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
