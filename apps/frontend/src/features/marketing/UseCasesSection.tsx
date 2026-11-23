import React from 'react';
import {
  Code2,
  Users,
  Presentation,
  Award,
  Building2,
  PartyPopper,
} from 'lucide-react';

export const UseCasesSection: React.FC = () => {
  const useCases = [
    {
      icon: <Code2 className="w-5 h-5 text-cyan-600" />,
      title: 'Hackathons & DevFests',
      description:
        'Generate high-energy, futuristic badge passes with attendee handles, developer tracks, team numbers, and scan-ready check-in QR codes.',
      recommendedLayout: 'Cyber Tech',
    },
    {
      icon: <Presentation className="w-5 h-5 text-[#B86E52]" />,
      title: 'Conferences & Summits',
      description:
        'Deliver official credential passes for keynote speakers, general attendees, and VIP press with designated seating and hall access.',
      recommendedLayout: 'Premium Editorial',
    },
    {
      icon: <Users className="w-5 h-5 text-[#77866F]" />,
      title: 'Workshops & Bootcamps',
      description:
        'Personalized admission tickets sent in email or downloaded as responsive web links for hands-on technical masterclasses.',
      recommendedLayout: 'Dual Choice',
    },
    {
      icon: <PartyPopper className="w-5 h-5 text-[#945B0E]" />,
      title: 'Music Festivals & Culture',
      description:
        'Collectible digital ticket passes with vibrant branding, entry gates, wristband redemption markers, and security identifiers.',
      recommendedLayout: 'Cyber Tech',
    },
    {
      icon: <Building2 className="w-5 h-5 text-[#2C3E50]" />,
      title: 'Corporate & Executive Events',
      description:
        'Understated, elegant invitations for board summits, shareholder dinners, private roundtables, and VIP corporate retreats.',
      recommendedLayout: 'Premium Editorial',
    },
    {
      icon: <Award className="w-5 h-5 text-[#A83232]" />,
      title: 'Galas & Award Ceremonies',
      description:
        'Print-ready vector PDF tickets formatted for formal physical presentation, table allocations, and reserved seating.',
      recommendedLayout: 'Premium Editorial',
    },
  ];

  return (
    <section id="use-cases" className="py-20 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#DDD8CD] text-xs font-semibold text-[#B86E52]">
            Versatile Applications
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#252525] font-serif">
            Built for any event where personalization matters
          </h2>
          <p className="text-sm sm:text-base text-[#5F5B54] leading-relaxed">
            Whether welcoming 20 workshop attendees or 500 conference delegates, PassForge delivers
            passes that feel personal and look professional.
          </p>
        </div>

        {/* Use Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((uc, idx) => (
            <div
              key={idx}
              className="bg-[#FAF8F5] border border-[#E9E5DC] rounded-2xl p-6 hover:bg-white hover:shadow-md hover:border-[#DDD8CD] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 rounded-xl bg-white border border-[#E9E5DC] flex items-center justify-center">
                    {uc.icon}
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white text-[#77736C] border border-[#E9E5DC]">
                    {uc.recommendedLayout}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#252525] mb-2 font-sans">
                  {uc.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#5F5B54] leading-relaxed">
                  {uc.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#E9E5DC] text-[11px] font-medium text-[#77736C]">
                Works across Email, Web, PDF, and PNG
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
