import React, { useState } from 'react';
import { Ticket, Menu, X, ArrowRight, Sparkles, BookOpen } from 'lucide-react';

interface NavbarProps {
  onNavigate: (path: string) => void;
  activePath?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, activePath = '/' }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Ticket Designs', href: '#designs' },
    { label: 'Use Cases', href: '#use-cases' },
    { label: 'FAQ', href: '#faq' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    onNavigate(href);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#E9E5DC] transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand Logo */}
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center gap-2 sm:gap-3 text-left cursor-pointer group shrink-0"
          >
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-[#B86E52] text-white flex items-center justify-center shadow-sm group-hover:bg-[#A15D43] transition-colors shrink-0">
              <Ticket className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-extrabold text-base tracking-tight text-[#252525] font-sans">
                  PassForge
                </span>
                <span className="hidden sm:inline text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FBF2EE] text-[#B86E52] border border-[#F0D5C9] uppercase tracking-wider">
                  Open Engine
                </span>
              </div>
              <p className="text-[11px] text-[#77736C] hidden sm:block">
                Personalized bulk event ticketing
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="px-3.5 py-2 text-xs font-medium text-[#504D47] hover:text-[#252525] hover:bg-[#FAF8F5] rounded-lg transition-colors cursor-pointer"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => onNavigate('/app')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#B86E52] hover:bg-[#A15D43] shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FBF2EE]" />
              <span>Open Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-1.5 md:hidden">
            <button
              onClick={() => onNavigate('/app')}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#B86E52] shrink-0"
            >
              Studio
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-[#4A4641] hover:text-[#252525] hover:bg-[#FAF8F5] rounded-lg cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E9E5DC] bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg animate-fade-in">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.href);
              }}
              className="block px-3 py-2 text-sm font-medium text-[#4A4641] hover:text-[#252525] hover:bg-[#FAF8F5] rounded-lg"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2 border-t border-[#F0EDE6]">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('/app');
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#B86E52]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch Ticket Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
