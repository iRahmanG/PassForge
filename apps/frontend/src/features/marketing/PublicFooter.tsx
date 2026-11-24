import React, { useState, useEffect } from 'react';
import {
  Ticket,
  ArrowUp,
  Sparkles,
  ArrowRight,
  Layers,
  Globe,
  FileText,
  Mail,
  Image as ImageIcon,
  CheckCircle2,
} from 'lucide-react';

interface PublicFooterProps {
  onNavigate: (path: string) => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({ onNavigate }) => {
  const [showFloatingTop, setShowFloatingTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <footer className="bg-white border-t border-[#EAEAEA] pt-16 pb-12 text-neutral-600 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#EAEAEA]">
            {/* Brand & Mission Column (Col 1-5) */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center shadow-xs">
                  <Ticket className="w-4.5 h-4.5" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xl tracking-tight text-neutral-900 font-sans">
                    PassForge
                  </span>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200">
                    DEMO v1.0
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed max-w-sm">
                Personalized multi-format ticket generation platform powered by Hyper Elements. Compile single-source JSX into table-tested Email, responsive Web passes, printable vector PDF, and high-resolution PNG badges.
              </p>

              {/* Engine Status Badge */}
              <div className="pt-1">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200/80">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Hyper Elements SSR Engine • Ready</span>
                </div>
              </div>
            </div>

            {/* Navigation & CTA Columns (Col 6-12) */}
            <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8">
              {/* Column 1: Product & Studio */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                  Product
                </h4>

                {/* Prominent Redesigned Studio Button */}
                <div>
                  <button
                    onClick={() => onNavigate('/app')}
                    className="group w-full inline-flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 shadow-sm transition-all hover:-translate-y-0.5 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Launch Studio</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>

                <ul className="space-y-2.5 text-xs">
                  <li>
                    <a
                      href="#designs"
                      className="text-neutral-600 hover:text-neutral-900 transition-colors flex items-center gap-1.5"
                    >
                      <span>Templates Library</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#features"
                      className="text-neutral-600 hover:text-neutral-900 transition-colors flex items-center gap-1.5"
                    >
                      <span>Features & Pipeline</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#how-it-works"
                      className="text-neutral-600 hover:text-neutral-900 transition-colors flex items-center gap-1.5"
                    >
                      <span>How It Works</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#faq"
                      className="text-neutral-600 hover:text-neutral-900 transition-colors flex items-center gap-1.5"
                    >
                      <span>FAQ & Specs</span>
                    </a>
                  </li>
                </ul>
              </div>

              {/* Column 2: 4 Output Formats */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                  Native Formats
                </h4>
                <ul className="space-y-2.5 text-xs">
                  <li className="flex items-center gap-2 text-neutral-600">
                    <ImageIcon className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Canvas Badge (PNG)</span>
                  </li>
                  <li className="flex items-center gap-2 text-neutral-600">
                    <Globe className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Web Pass (HTML5)</span>
                  </li>
                  <li className="flex items-center gap-2 text-neutral-600">
                    <Mail className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Email Invite (Tables)</span>
                  </li>
                  <li className="flex items-center gap-2 text-neutral-600">
                    <FileText className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Print PDF (Vector A4)</span>
                  </li>
                </ul>
              </div>

              {/* Column 3: Technology & Architecture */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                  Technology
                </h4>
                <div className="space-y-2 text-xs text-neutral-500 leading-relaxed">
                  <p>
                    Built with React 19, Hyper Elements SSR, and Tailwind styling. Zero template fragmentation.
                  </p>
                  <div className="pt-1 flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 text-[11px] font-mono border border-neutral-200">
                      Hyper Elements
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 text-[11px] font-mono border border-neutral-200">
                      React 19 SSR
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 text-[11px] font-mono border border-neutral-200">
                      In-Memory
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Copyright & Redesigned Back to Top */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
            <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
              <p>© {new Date().getFullYear()} PassForge. Open personalized event ticketing platform.</p>
              <span className="hidden sm:inline text-neutral-300">•</span>
              <p className="text-neutral-400">Deterministic multi-channel ticket compilation.</p>
            </div>

            {/* Redesigned Back to Top Button */}
            <button
              onClick={scrollToTop}
              className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-semibold text-neutral-700 hover:text-neutral-900 bg-white hover:bg-neutral-50 border border-[#EAEAEA] hover:border-neutral-300 shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer"
              title="Scroll back to top"
              aria-label="Scroll back to top"
            >
              <span>Back to top</span>
              <div className="w-5 h-5 rounded-full bg-neutral-100 text-neutral-700 group-hover:bg-neutral-900 group-hover:text-white flex items-center justify-center transition-colors">
                <ArrowUp className="w-3 h-3 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </footer>

      {/* Floating Back to Top Button (Appears on scroll) */}
      {showFloatingTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-neutral-900/90 hover:bg-neutral-900 text-white shadow-xl hover:shadow-2xl border border-white/20 backdrop-blur-sm transition-all hover:-translate-y-1 cursor-pointer animate-fade-in"
          title="Back to top"
          aria-label="Back to top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </>
  );
};
