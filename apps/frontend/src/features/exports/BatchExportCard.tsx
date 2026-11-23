import React from 'react';
import { Card } from '../../components/ui/Card.js';
import { Layers, Check } from 'lucide-react';

interface BatchExportCardProps {
  attendeeCount: number;
}

export const BatchExportCard: React.FC<BatchExportCardProps> = ({ attendeeCount }) => {
  return (
    <Card
      title="Format Availability & Export Pipelines"
      subtitle="Hyper Elements supports simultaneous generation across all 4 formats"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#FAF8F5] border border-[#E9E5DC]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FBF2EE] border border-[#F0D5C9] flex items-center justify-center text-[#B86E52] shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#252525]">4 Output Formats Verified</h4>
            <p className="text-xs text-[#77736C]">
              Personalized for {attendeeCount} attendee{attendeeCount === 1 ? '' : 's'} with dynamic QR codes and consistent event branding.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold text-[#2E683E] bg-[#EEF6F0] border border-[#C6E2CD] px-3 py-1 rounded-full flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> All Formats Functional
          </span>
        </div>
      </div>
    </Card>
  );
};