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
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              1. Choose Ticket Layout
            </h2>
            <p className="text-xs text-slate-400">
              Select between two distinct visual architectures — both render into all 4 Hyper Elements formats.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
