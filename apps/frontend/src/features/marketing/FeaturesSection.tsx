import React from 'react';
import {
  UploadCloud,
  ShieldCheck,
  UserCheck,
  Palette,
  Sliders,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface FeaturesSectionProps {
  onNavigate: (path: string) => void;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ onNavigate }) => {
  const features = [
    {
      icon: <UploadCloud className="w-5 h-5 text-[#B86E52]" />,
      title: 'Fast CSV Attendee Import',
      badge: 'PapaParse Engine',
      description:
        'Upload guest lists of any size. Drag and drop your CSV file and map columns dynamically with automatic header recognition for names, emails, ticket tiers, and seat numbers.',
      benefit: 'No manual data entry. Imports hundreds of rows in milliseconds.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#2E683E]" />,
      title: 'Schema-Driven Zod Validation',
      badge: 'Strict Contracts',
      description:
        'Never render a broken ticket. Every imported row is rigorously checked against TypeScript Zod schemas, identifying malformed emails, missing names, or syntax errors upfront.',
      benefit: 'Clean, verified data guarantees 100% render reliability.',
    },
    {
      icon: <UserCheck className="w-5 h-5 text-[#77866F]" />,
      title: 'Deep Attendee Personalization',
      badge: 'Unique Passes',
      description:
        'Every single attendee receives their own customized pass featuring their full name, verified ticket tier (VIP, General, Speaker), dedicated seat, and unique QR code.',
      benefit: 'Handles long names, international characters, and complex seating.',
    },
    {
      icon: <Palette className="w-5 h-5 text-[#B86E52]" />,
      title: 'Dual Design Architectures',
      badge: 'Curated Templates',
      description:
        'Switch between Cyber Tech (modern dark terminal aesthetic with geometric highlights) and Premium Editorial (warm cream serif invitation with refined typography).',
      benefit: 'Purpose-built layouts tailored for both developer & executive events.',
    },
    {
      icon: <Sliders className="w-5 h-5 text-[#4A4641]" />,
      title: 'Live Brand Customization',
      badge: 'Instant Preview',
      description:
        'Fine-tune event branding in real time. Adjust event titles, dates, venues, organizer labels, and primary accent colors with immediate visual feedback.',
      benefit: 'Matches your organization’s identity and color palette effortlessly.',
    },
    {
      icon: <Layers className="w-5 h-5 text-[#2C3E50]" />,
      title: 'Four Native Output Formats',
      badge: 'Hyper Elements 0.5.2',
      description:
        'One template renders simultaneously into responsive web pages, compatible Email HTML tables, printable vector PDF documents, and high-resolution Canvas PNGs.',
      benefit: 'True single-source publishing without maintaining separate templates.',
    },
  ];

  return (
    <section id="features" className="py-20 bg-[#FAF8F5] border-t border-b border-[#E9E5DC] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#DDD8CD] text-xs font-semibold text-[#B86E52]">
            Core Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#252525] font-serif">
            Designed specifically for modern event organizers
          </h2>
          <p className="text-sm sm:text-base text-[#5F5B54] leading-relaxed">
            From raw spreadsheets to multi-channel ticket delivery. Everything you need to craft,
            validate, and render personalized passes without technical friction.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#E9E5DC] rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-md hover:border-[#DDD8CD] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 rounded-xl bg-[#FAF8F5] border border-[#E9E5DC] flex items-center justify-center">
                    {feat.icon}
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#FAF8F5] text-[#77736C] border border-[#E9E5DC]">
                    {feat.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#252525] mb-2 font-sans">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#5F5B54] leading-relaxed mb-4">
                  {feat.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#F0EDE6] text-xs font-medium text-[#77866F] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#77866F]" />
                <span>{feat.benefit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Callout Banner */}
        <div className="mt-12 bg-white border border-[#E9E5DC] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm font-bold text-[#252525]">
              Ready to test your attendee list with PassForge?
            </h4>
            <p className="text-xs text-[#77736C]">
              Load our built-in sample data or upload your custom CSV file in the interactive studio.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/app')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#B86E52] hover:bg-[#A15D43] transition-colors shrink-0 cursor-pointer"
          >
            <span>Launch Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
