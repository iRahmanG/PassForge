import React, { useEffect } from 'react';
import { Navbar } from './Navbar.js';
import { HeroSection } from './HeroSection.js';
import { FeaturesSection } from './FeaturesSection.js';
import { HowItWorksSection } from './HowItWorksSection.js';
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
        <HeroSection onNavigate={onNavigate} />
        <FeaturesSection onNavigate={onNavigate} />
        <HowItWorksSection onNavigate={onNavigate} />
        <DesignShowcaseSection onNavigate={onNavigate} />
        <UseCasesSection />
        <FaqSection />
        <CtaSection onNavigate={onNavigate} />
      </main>
      <PublicFooter onNavigate={onNavigate} />
    </div>
  );
};
