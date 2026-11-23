import React from 'react';
import { Ticket, ExternalLink, Heart, Github, Terminal, ArrowUp } from 'lucide-react';

interface PublicFooterProps {
  onNavigate: (path: string) => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-[#E9E5DC] pt-14 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-[#F0EDE6]">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-[#B86E52] text-white flex items-center justify-center shadow-sm shrink-0">
                <Ticket className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-[#252525] font-sans">
                PassForge
              </span>
            </div>
            <p className="text-xs text-[#5F5B54] max-w-sm leading-relaxed">
              Open personalized event ticketing platform powered by Hyper Elements. Compiling single-source
              React templates into responsive web pages, compatible HTML emails, printable vector PDFs,
              and canvas badges.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#77736C]">
              <span className="w-2 h-2 rounded-full bg-[#2E683E]" />
              <span>Hyper Elements 0.5.2 Engine • 28 Automated Verifications</span>
            </div>
          </div>

          {/* Links: Product */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#252525]">Product</h5>
            <ul className="space-y-2 text-xs text-[#5F5B54]">
              <li>
                <button onClick={() => onNavigate('/app')} className="hover:text-[#B86E52] cursor-pointer">
                  PassForge Studio
                </button>
              </li>
              <li>
                <a href="#features" className="hover:text-[#B86E52]">
                  Capabilities
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-[#B86E52]">
                  Workflow
                </a>
              </li>
              <li>
                <a href="#designs" className="hover:text-[#B86E52]">
                  Ticket Templates
                </a>
              </li>
              <li>
                <a href="#use-cases" className="hover:text-[#B86E52]">
                  Supported Events
                </a>
              </li>
            </ul>
          </div>

          {/* Links: Formats */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#252525]">Render Formats</h5>
            <ul className="space-y-2 text-xs text-[#5F5B54]">
              <li>
                <span className="text-[#252525] font-medium">Canvas PNG</span> — 1200×630 Badge
              </li>
              <li>
                <span className="text-[#252525] font-medium">Responsive Web</span> — Mobile Pass
              </li>
              <li>
                <span className="text-[#252525] font-medium">Email HTML</span> — Universal Tables
              </li>
              <li>
                <span className="text-[#252525] font-medium">Printable PDF</span> — Vector Document
              </li>
            </ul>
          </div>

          {/* Links: Developer / System */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#252525]">Engineering</h5>
            <ul className="space-y-2 text-xs text-[#5F5B54]">
              <li>
                <span className="text-[#77736C]">Frontend:</span> React 19 • Vite • TypeScript
              </li>
              <li>
                <span className="text-[#77736C]">Backend:</span> Node 24 • Express 5
              </li>
              <li>
                <span className="text-[#77736C]">Engine:</span> @hyper-elements/react
              </li>
              <li>
                <span className="text-[#77736C]">Validation:</span> Zod 3.24
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#77736C]">
          <div className="flex items-center gap-2">
            <span>PassForge — Built for the Hyper Elements Template Challenge.</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="hover:text-[#252525] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
