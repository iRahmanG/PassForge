import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is Hyper Elements and why does PassForge use it?',
      a: 'Hyper Elements compiles a single React component tree into four production formats: table-based Email HTML, responsive Web passes, printable vector PDFs, and high-resolution Canvas PNGs — with zero template duplication.',
    },
    {
      q: 'Do I need an account or database to use PassForge?',
      a: 'No. PassForge runs as a client-first, in-memory studio. You can configure an event, upload attendee CSV data, and render full ticket previews immediately without signup, database setup, or payment credentials.',
    },
    {
      q: 'What CSV column formats are supported?',
      a: 'PassForge accepts any standard CSV file. The intelligent column mapper automatically detects headers for attendee names, email addresses, ticket tiers, and seat assignments, with an interactive remapping step for custom layouts.',
    },
    {
      q: 'How does live preview work?',
      a: 'Previews are rendered server-side on demand through Hyper Elements. Selecting an attendee or format instantly streams the true production artifact — HTML, vector PDF, or 2000px PNG badge — directly into your workspace.',
    },
    {
      q: 'Can attendees download their own tickets directly?',
      a: 'Yes. In both the Studio preview and the standalone responsive web view, organizers and guests can download the vector PDF admission document or high-resolution PNG pass with one click.',
    },
    {
      q: 'When will bulk ZIP batch generation be available?',
      a: 'Batch generation and unified ZIP exports are scheduled for Milestone 4. The core rendering engine, Zod validation pipelines, and column mapping systems are fully complete and verified.',
    },
  ];

  return (
    <section id="faq" className="py-16 md:py-20 bg-white border-t border-[#E9E5DC] scroll-mt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-10 space-y-3">
          <p className="text-xs font-semibold tracking-wider uppercase text-[#B86E52]">
            Got Questions?
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#252525] font-serif">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-[#77736C] max-w-lg mx-auto">
            Everything you need to know about PassForge, template rendering, and output formats.
          </p>
        </div>

        {/* Clean, Compact Accordion List */}
        <div className="divide-y divide-[#E9E5DC] border-y border-[#E9E5DC]">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={idx} className="transition-colors">
                <button
                  id={`faq-question-${idx}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setOpenIdx(isOpen ? null : idx);
                    }
                  }}
                  className="w-full py-4 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B86E52] focus-visible:ring-offset-2 touch-manipulation group"
                >
                  <span className="text-sm sm:text-base font-semibold text-[#252525] group-hover:text-[#B86E52] transition-colors leading-snug">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#77736C] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'transform rotate-180 text-[#B86E52]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${idx}`}
                    role="region"
                    aria-labelledby={`faq-question-${idx}`}
                    className="pb-4 pt-1 text-xs sm:text-sm text-[#5F5B54] leading-relaxed pr-8 animate-fade-in"
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
