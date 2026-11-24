import React, { useEffect } from 'react';
import { Navbar } from './Navbar.js';
import { HeroSection } from './HeroSection.js';
import { DesignShowcaseSection } from './DesignShowcaseSection.js';
import { UseCasesSection } from './UseCasesSection.js';
import { FaqSection } from './FaqSection.js';
import { CtaSection } from './CtaSection.js';
import { PublicFooter } from './PublicFooter.js';

interface LandingPageProps {
  onNavigate: (path: string) => void;
  initialSection?: string;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, initialSection }) => {
  useEffect(() => {
    if (initialSection) {
      const el = document.getElementById(initialSection);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [initialSection]);

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#252525] flex flex-col font-sans selection:bg-[#FBF2EE] selection:text-[#B86E52]">
      <Navbar onNavigate={onNavigate} />
      <main className="flex-1">
        {/* 1) Hero — The overall promise */}
        <HeroSection onNavigate={onNavigate} />

        {/* 2) One platform. Four ways to deliver. */}
        <DesignShowcaseSection onNavigate={onNavigate} />

        {/* 3) Built for any event where personalization matters */}
        <UseCasesSection />

        {/* 4) Frequently Asked Questions */}
        <FaqSection />

        {/* Closing CTA */}
        <CtaSection onNavigate={onNavigate} />
      </main>
      <PublicFooter onNavigate={onNavigate} />
    </div>
  );
};
