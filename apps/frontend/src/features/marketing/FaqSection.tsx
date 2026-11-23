import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is Hyper Elements and why does PassForge use it?',
      a: 'Hyper Elements is a multi-format rendering engine for React. Instead of maintaining separate HTML email templates, web pages, canvas scripts, and PDF generators, PassForge writes one JSX template hierarchy that compiles into Email HTML, Responsive Web HTML, Vector PDF Documents, and Node Canvas PNGs natively.',
    },
    {
      q: 'Do I need to create an account, configure a database, or connect payment processors?',
      a: 'No. PassForge is deliberately engineered as a lightweight, zero-login ticket studio. The current release runs with high-performance in-memory state. You can immediately launch the studio, configure an event, upload a CSV, and preview tickets without creating an account or storing sensitive payment data.',
    },
    {
      q: 'What CSV spreadsheet formats and column names are supported?',
      a: 'PassForge supports any standard CSV format. During upload, our smart column mapper automatically recognizes common variations for Attendee Name, Email Address, Ticket Tier (e.g. VIP, General, Speaker), and Seat/Table assignments. If your columns have custom names, you can map them in seconds.',
    },
    {
      q: 'How does live preview work?',
      a: 'When you select an attendee and an output format, the PassForge backend renders the ticket server-side using Hyper Elements and streams back the exact artifact (HTML, PNG, or PDF). You can toggle between formats in real time or view the rendered web pass directly.',
    },
    {
      q: 'Can attendees download their own tickets?',
      a: 'Yes. In the ticket preview and responsive web ticket view, organizers and attendees can directly download the high-resolution Canvas PNG badge or print-ready PDF document.',
    },
    {
      q: 'When will bulk ZIP batch generation and background processing be available?',
      a: 'Bulk batch rendering and single-click ZIP export are currently in development as Milestone 4. The underlying rendering engine and CSV data layer are already verified and ready to scale.',
    },
  ];

  return (
    <section id="faq" className="py-20 bg-[#FAF8F5] border-t border-[#E9E5DC] scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#DDD8CD] text-xs font-semibold text-[#B86E52]">
            Questions & Answers
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#252525] font-serif">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-[#5F5B54] leading-relaxed">
            Everything you need to know about PassForge architecture, templates, and rendering capabilities.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-[#E9E5DC] rounded-2xl overflow-hidden transition-all shadow-xs"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#FAF8F5]/60 transition-colors"
                >
                  <span className="text-sm sm:text-base font-bold text-[#252525] font-sans">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#77736C] transition-transform duration-200 shrink-0 ${
                      isOpen ? 'transform rotate-180 text-[#B86E52]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-[#5F5B54] leading-relaxed border-t border-[#F0EDE6] bg-[#FAF8F5]/30 animate-fade-in">
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
