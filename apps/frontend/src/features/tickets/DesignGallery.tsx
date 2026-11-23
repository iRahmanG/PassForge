import React from 'react';
import { DesignMetadata, TicketDesignId } from '@passforge/shared';
import { DesignCard } from './DesignCard.js';
import { Layers } from 'lucide-react';

interface DesignGalleryProps {
  designs: DesignMetadata[];
  selectedDesignId: TicketDesignId;
  onSelectDesign: (id: TicketDesignId) => void;
}

export const DesignGallery: React.FC<DesignGalleryProps> = ({
  designs,
  selectedDesignId,
  onSelectDesign,
}) => {
  return (
    <div className="bg-white border border-[#E9E5DC] rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2.5 pb-3 border-b border-[#E9E5DC]">
        <div className="w-8 h-8 rounded-xl bg-[#FBF2EE] text-[#B86E52] border border-[#F0D5C9] flex items-center justify-center shrink-0">
          <Layers className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-[#252525] tracking-tight">
            1. Ticket Layout
          </h2>
          <p className="text-[11px] text-[#77736C]">
            Select template architecture
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3.5">
        {designs.map((design) => (
          <DesignCard
            key={design.id}
            design={design}
            isSelected={selectedDesignId === design.id}
            onSelect={onSelectDesign}
          />
        ))}
      </div>
    </div>
  );
};