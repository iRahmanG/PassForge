import React from 'react';
import {
  UploadCloud,
  ShieldCheck,
  UserCheck,
  Palette,
  Sliders,
  Layers,
} from 'lucide-react';

interface FeaturesSectionProps {
  onNavigate: (path: string) => void;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = () => {
  const features = [
    {
      icon: <UploadCloud className="w-5 h-5 text-[#B86E52]" />,
      title: 'CSV Attendee Ingestion',
      description:
        'Drop in guest spreadsheets of any size. Automatic column header recognition pairs attendee names, emails, ticket tiers, and seat numbers instantly.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#2E683E]" />,
      title: 'Schema-Strict Validation',
      description:
        'Every uploaded row is verified against strict Zod contracts. Missing fields, invalid emails, and malformed data are caught upfront before rendering.',
    },
    {
      icon: <UserCheck className="w-5 h-5 text-[#77866F]" />,
      title: 'Personalized Ticket Passes',
      description:
        'Each attendee receives an individualized pass with their verified tier, assigned seat or table, and a scannable check-in QR code.',
    },
    {
      icon: <Palette className="w-5 h-5 text-[#B86E52]" />,
      title: 'Curated Design Layouts',
      description:
        'Switch between Cyber Tech for hackathons and tech summits, or Premium Editorial for academic ceremonies, corporate dinners, and conferences.',
    },
    {
      icon: <Sliders className="w-5 h-5 text-[#4A4641]" />,
      title: 'Live Event Branding',
      description:
        'Tailor event titles, dates, venues, organizer labels, and primary accent colors with immediate visual feedback in the live preview.',
    },
    {
      icon: <Layers className="w-5 h-5 text-[#2C3E50]" />,
      title: 'Multi-Format Generation',
      description:
        'A single React component tree compiles natively into responsive web pages, compatible email tables, vector PDF documents, and PNG badges.',
    },
  ];

  return (
    <section id="features" className="py-16 md:py-24 bg-white border-t border-b border-[#E9E5DC] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <p className="text-xs font-semibold tracking-wider uppercase text-[#B86E52]">
            Core Platform
          </p>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#252525] font-serif">
            Designed for modern event organizers
          </h2>
          <p className="text-sm sm:text-base text-[#77736C] leading-relaxed">
            From raw spreadsheet to multi-channel ticket delivery, without template fragmentation or data errors.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E9E5DC] transition-all hover:bg-white hover:border-[#DDD8CD] hover:shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="h-10 w-10 rounded-xl bg-white border border-[#E9E5DC] flex items-center justify-center mb-4 shadow-xs">
                  {feat.icon}
                </div>
                <h3 className="text-base font-bold text-[#252525] mb-2 font-sans">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#5F5B54] leading-relaxed">
                  {feat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
