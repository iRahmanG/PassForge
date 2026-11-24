import React from 'react';
import { Ticket, ArrowUp } from 'lucide-react';

interface PublicFooterProps {
  onNavigate: (path: string) => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-[#E9E5DC] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 pb-10 border-b border-[#F0EDE6]">
          {/* Brand Column */}
          <div className="space-y-3 max-w-sm">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-[#B86E52] text-white flex items-center justify-center shadow-xs">
                <Ticket className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg tracking-tight text-[#252525]">
                PassForge
              </span>
            </div>
            <p className="text-xs text-[#77736C] leading-relaxed">
              Personalized event ticket publishing studio powered by Hyper Elements. Render custom passes natively to Email, Web, Print PDF, and PNG Canvas.
            </p>
          </div>

          {/* Navigation Columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs">
            <div className="space-y-2.5">
              <h5 className="font-semibold text-[#252525]">Product</h5>
              <ul className="space-y-1.5 text-[#77736C]">
                <li>
                  <button onClick={() => onNavigate('/app')} className="hover:text-[#B86E52] cursor-pointer">
                    Studio
                  </button>
                </li>
                <li>
                  <a href="#designs" className="hover:text-[#B86E52]">
                    Templates
                  </a>
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
              </ul>
            </div>

            <div className="space-y-2.5">
              <h5 className="font-semibold text-[#252525]">Formats</h5>
              <ul className="space-y-1.5 text-[#77736C]">
                <li>Email HTML</li>
                <li>Responsive Web</li>
                <li>Printable PDF</li>
                <li>Canvas Badge</li>
              </ul>
            </div>

            <div className="space-y-2.5 col-span-2 sm:col-span-1">
              <h5 className="font-semibold text-[#252525]">Technology</h5>
              <p className="text-[#77736C] text-xs leading-relaxed">
                Powered by Hyper Elements 0.5.2 single-source multi-format JSX compilation.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#77736C]">
          <p>© {new Date().getFullYear()} PassForge. Open event ticketing platform.</p>
          <button
            onClick={scrollToTop}
            className="hover:text-[#252525] inline-flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
