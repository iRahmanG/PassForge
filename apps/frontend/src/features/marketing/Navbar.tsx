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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E9E5DC] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center gap-2.5 text-left cursor-pointer group shrink-0 focus-visible:ring-2 focus-visible:ring-[#B86E52] rounded-lg p-1"
          >
            <div className="h-8.5 w-8.5 rounded-xl bg-[#B86E52] text-white flex items-center justify-center shadow-xs group-hover:bg-[#A15D43] transition-colors shrink-0">
              <Ticket className="w-4.5 h-4.5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-[#252525] font-sans leading-none">
                PassForge
              </span>
              <span className="text-[10px] text-[#77736C] hidden sm:block font-medium mt-0.5">
                Bulk Ticket Engine
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="px-3 py-1.5 text-xs font-semibold text-[#504D47] hover:text-[#252525] hover:bg-[#FAF8F5] rounded-lg transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#B86E52]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => onNavigate('/app')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#B86E52] hover:bg-[#A15D43] shadow-xs hover:shadow-sm transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#B86E52]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FBF2EE]" />
              <span>Open Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => onNavigate('/app')}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#B86E52] shrink-0 shadow-xs"
            >
              Studio
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#4A4641] hover:text-[#252525] hover:bg-[#FAF8F5] rounded-lg cursor-pointer focus-visible:ring-2 focus-visible:ring-[#B86E52]"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E9E5DC] bg-white px-4 pt-3 pb-5 space-y-1 shadow-lg animate-fade-in">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.href);
              }}
              className="block px-3 py-2.5 text-xs font-semibold text-[#4A4641] hover:text-[#252525] hover:bg-[#FAF8F5] rounded-lg"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 border-t border-[#F0EDE6] mt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('/app');
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#B86E52] shadow-xs"
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
