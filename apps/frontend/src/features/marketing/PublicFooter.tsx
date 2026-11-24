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
    <footer className="bg-white border-t border-[#EAEAEA] text-neutral-600 select-none">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* 3-Column Footer Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12 pb-12">
          {/* Column 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-neutral-900 text-white flex items-center justify-center shadow-xs">
                <Ticket className="w-4 h-4" />
              </div>
              <span className="font-bold text-base tracking-tight text-neutral-900 font-sans">
                PassForge
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed max-w-xs">
              Personalized event ticket generation for modern organizers.
            </p>
          </div>

          {/* Column 2: Product */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">
              Product
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a
                  href="#designs"
                  className="text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                  Templates
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#designs"
                  className="text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                  Gallery
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Exports */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">
              Exports
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-neutral-500">
              <li className="hover:text-neutral-900 transition-colors cursor-default">
                Web Pass
              </li>
              <li className="hover:text-neutral-900 transition-colors cursor-default">
                Email HTML
              </li>
              <li className="hover:text-neutral-900 transition-colors cursor-default">
                PDF
              </li>
              <li className="hover:text-neutral-900 transition-colors cursor-default">
                PNG
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#EAEAEA] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-3">
            <p>© {new Date().getFullYear()} PassForge</p>
            <span className="text-neutral-300">•</span>
            <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200">
              v1.0 Demo
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/iRahmanG/PassForge"
              target="_blank"
              rel="noreferrer"
              className="text-neutral-500 hover:text-neutral-900 transition-colors inline-flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>GitHub</span>
            </a>

            <button
              onClick={scrollToTop}
              className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-neutral-600 hover:text-neutral-900 bg-neutral-50 hover:bg-neutral-100 border border-[#EAEAEA] transition-all cursor-pointer"
              title="Back to top"
              aria-label="Back to top"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3 h-3 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
