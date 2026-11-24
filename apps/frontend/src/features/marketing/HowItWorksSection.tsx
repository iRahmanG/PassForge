import React from 'react';
import { Calendar, UploadCloud, Sparkles, Archive, ArrowRight } from 'lucide-react';

interface HowItWorksSectionProps {
  onNavigate: (path: string) => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ onNavigate }) => {
  const steps = [
    {
      number: '01',
      title: 'Configure Event Details',
      icon: <Calendar className="w-5 h-5 text-[#B86E52]" />,
      description:
        'Set title, schedule, venue location, organizer branding, and primary color accents with instant state sync.',
    },
    {
      number: '02',
      title: 'Import Attendee CSV',
      icon: <UploadCloud className="w-5 h-5 text-[#2E683E]" />,
      description:
        'Drag and drop any spreadsheet. Automatic column detection maps headers and validates records against strict Zod contracts.',
    },
    {
      number: '03',
      title: 'Customize & Preview Passes',
      icon: <Sparkles className="w-5 h-5 text-[#77866F]" />,
      description:
        'Select Cyber Tech or Premium Editorial. Inspect real personalized passes across Web, Email, Vector PDF, and PNG Canvas.',
    },
    {
      number: '04',
      title: 'Bulk Export & Delivery',
      isUpcoming: true,
      icon: <Archive className="w-5 h-5 text-[#945B0E]" />,
      description:
        'Milestone 4: High-throughput background generation queue with organized single-click ZIP archive packaging.',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-[#FAF8F5] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <p className="text-xs font-semibold tracking-wider uppercase text-[#77866F]">
            Workflow
          </p>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#252525] font-serif">
            From spreadsheet to personalized passes
          </h2>
          <p className="text-sm sm:text-base text-[#77736C] leading-relaxed">
            A reliable 4-step pipeline engineered to prevent data errors and deliver consistent tickets across every format.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-6 border transition-all flex flex-col justify-between ${
                step.isUpcoming
                  ? 'bg-white/60 border-dashed border-[#DDD8CD]'
                  : 'bg-white border-[#E9E5DC] shadow-xs hover:border-[#DDD8CD]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xl font-bold text-[#B86E52]/40">
                    {step.number}
                  </span>
                  {step.isUpcoming && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FDF6E8] text-[#945B0E] border border-[#F3E0BA] uppercase">
                      Upcoming
                    </span>
                  )}
                </div>

                <div className="h-10 w-10 rounded-xl bg-[#FAF8F5] border border-[#E9E5DC] flex items-center justify-center mb-4">
                  {step.icon}
                </div>

                <h3 className="text-base font-bold text-[#252525] mb-2 font-sans">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#5F5B54] leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Action CTA */}
        <div className="mt-12 text-center" style={{ marginTop: '48px' }}>
          <button
            onClick={() => onNavigate('/app')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#B86E52] hover:bg-[#A15D43] transition-all cursor-pointer shadow-sm hover:shadow-md"
            style={{ backgroundColor: '#B86E52', color: '#ffffff' }}
          >
            <span>Start with Event Setup</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
        </div>
      </div>
    </section>
  );
};
