import React from 'react';
import { Calendar, UploadCloud, Sparkles, Archive, ArrowRight, Check } from 'lucide-react';

interface HowItWorksSectionProps {
  onNavigate: (path: string) => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ onNavigate }) => {
  const steps = [
    {
      number: '01',
      title: 'Configure Event Details',
      status: 'Active in Studio',
      statusType: 'active',
      icon: <Calendar className="w-5 h-5 text-[#B86E52]" />,
      description:
        'Set up your event title, schedule dates, venue location, organizer brand, and primary color accents in the event dashboard.',
      details: ['Dynamic venue & time handling', 'Customizable organizer names', 'Instant live state sync'],
    },
    {
      number: '02',
      title: 'Import Attendee CSV',
      status: 'Active in Studio',
      statusType: 'active',
      icon: <UploadCloud className="w-5 h-5 text-[#2E683E]" />,
      description:
        'Drag and drop any spreadsheet. PassForge automatically maps columns and verifies every attendee record against strict Zod schemas.',
      details: ['Handles any CSV column names', 'Identifies malformed rows', 'Instant sample data preset'],
    },
    {
      number: '03',
      title: 'Customize & Preview Passes',
      status: 'Active in Studio',
      statusType: 'active',
      icon: <Sparkles className="w-5 h-5 text-[#77866F]" />,
      description:
        'Choose between Cyber Tech or Premium Editorial ticket templates. Inspect personalized passes across Web, Email, Vector PDF, and PNG.',
      details: ['Two production layouts', 'Full attendee switcher', 'Direct format downloads'],
    },
    {
      number: '04',
      title: 'Bulk Generation & ZIP Export',
      status: 'Milestone 4 • Upcoming',
      statusType: 'upcoming',
      icon: <Archive className="w-5 h-5 text-[#945B0E]" />,
      description:
        'Batch render hundreds or thousands of personalized tickets with background workers and download them as a unified ZIP archive.',
      details: ['Background rendering queue', 'Organized ZIP directory structure', 'Automated email dispatch API'],
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#DDD8CD] text-xs font-semibold text-[#77866F]">
            Workflow Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#252525] font-serif">
            From spreadsheet to personalized passes in 4 steps
          </h2>
          <p className="text-sm sm:text-base text-[#5F5B54] leading-relaxed">
            A frictionless organizer journey engineered to prevent data errors and produce beautiful,
            consistent tickets across every medium.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-6 border transition-all flex flex-col justify-between relative ${
                step.statusType === 'upcoming'
                  ? 'bg-[#FAF8F5]/80 border-dashed border-[#DDD8CD]'
                  : 'bg-white border-[#E9E5DC] shadow-xs hover:shadow-md hover:border-[#DDD8CD]'
              }`}
            >
              <div>
                {/* Step Top Bar */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-2xl font-black text-[#B86E52]/40">
                    {step.number}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                      step.statusType === 'upcoming'
                        ? 'bg-[#FDF6E8] text-[#945B0E] border-[#F3E0BA]'
                        : 'bg-[#EEF6F0] text-[#2E683E] border-[#C6E2CD]'
                    }`}
                  >
                    {step.status}
                  </span>
                </div>

                <div className="h-10 w-10 rounded-xl bg-[#FAF8F5] border border-[#E9E5DC] flex items-center justify-center mb-4">
                  {step.icon}
                </div>

                <h3 className="text-base font-bold text-[#252525] mb-2 font-sans">
                  {step.title}
                </h3>
                <p className="text-xs text-[#5F5B54] leading-relaxed mb-4">
                  {step.description}
                </p>
              </div>

              {/* Step Checklist */}
              <div className="pt-4 border-t border-[#F0EDE6] space-y-1.5">
                {step.details.map((item, dIdx) => (
                  <div key={dIdx} className="flex items-center gap-2 text-[11px] text-[#77736C]">
                    <Check className="w-3 h-3 text-[#2E683E] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Workflow Action CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={() => onNavigate('/app')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#B86E52] hover:bg-[#A15D43] shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <span>Start Step 1: Event Details</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
