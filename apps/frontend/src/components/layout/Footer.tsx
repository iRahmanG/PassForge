import React from 'react';
import { Layers, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-[#E9E5DC] py-8 text-xs text-[#77736C] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#252525]">PassForge</span>
          <span>•</span>
          <span>Hyper Elements SSR Ticket Platform</span>
        </div>

        <div className="flex items-center gap-4 flex-wrap justify-center text-[11px]">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2E683E]" />
            Hyper Elements 0.5.2
          </span>
          <span>•</span>
          <span>React 19 + TypeScript</span>
          <span>•</span>
          <span>Node 24 + Express 5</span>
          <span>•</span>
          <span className="text-[#9E9A90]">4 SSR Formats: Canvas, Page, Email, Document</span>
        </div>
      </div>
    </footer>
  );
};