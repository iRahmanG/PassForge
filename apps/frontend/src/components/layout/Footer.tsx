import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-6 mt-12 text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="font-bold text-slate-400">PassForge</span> — Monorepo Architecture Separation (Milestone 2)
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>Frontend: Vite + React 19</span>
          <span>•</span>
          <span>Backend: Express + Node 24</span>
          <span>•</span>
          <span>Renderer: Hyper Elements v0.5.2</span>
        </div>
      </div>
    </footer>
  );
};
