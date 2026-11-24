import React from 'react';
import { ActiveTab } from '../../types/index.js';
import { Ticket, Calendar, UploadCloud, Users, Sparkles, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onNavigateHome?: () => void;
  eventName?: string;
  attendeeCount?: number;
  serverOnline?: boolean;
  onLoadDemo?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onNavigateHome,
  eventName = 'KIET TechFest 2027',
  attendeeCount = 1,
  serverOnline = true,
  onLoadDemo,
}) => {
  const steps = [
    {
      id: 'event' as ActiveTab,
      number: '1',
      title: 'Event Details',
      subtitle: 'Schedule & Venue',
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      id: 'import' as ActiveTab,
      number: '2',
      title: 'Import Attendees',
      subtitle: 'CSV Mapping',
      icon: <UploadCloud className="w-4 h-4" />,
    },
    {
      id: 'tickets' as ActiveTab,
      number: '3',
      title: 'Ticket Design',
      subtitle: 'Layouts & Preview',
      icon: <Sparkles className="w-4 h-4" />,
    },
  ];

  return (
    <header className="bg-white border-b border-[#E9E5DC] sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Product Bar */}
        <div className="flex items-center justify-between h-15 sm:h-16 border-b border-[#F0EDE6]">
          {/* Logo & PassForge Wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-3 text-left cursor-pointer group"
              title="Return to Public Website"
            >
              <div className="h-9 w-9 rounded-xl bg-[#B86E52] text-white flex items-center justify-center shadow-sm group-hover:bg-[#A15D43] transition-colors shrink-0">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base tracking-tight text-[#252525] font-sans">
                    PassForge
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FBF2EE] text-[#B86E52] border border-[#F0D5C9] uppercase tracking-wider">
                    Ticket Studio
                  </span>
                </div>
                <p className="text-[11px] text-[#77736C] hidden sm:block">
                  Personalized bulk event ticket publishing platform
                </p>
              </div>
            </button>
          </div>

          {/* Context Badges & System Health */}
          <div className="flex items-center gap-2 sm:gap-3">
            {onNavigateHome && (
              <button
                onClick={onNavigateHome}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#DDD8CD] bg-white text-xs font-semibold text-[#4A4641] hover:text-[#252525] hover:bg-[#FAF8F5] transition-all cursor-pointer shadow-xs"
                title="Return to PassForge website"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden xs:inline sm:inline">Website</span>
              </button>
            )}

            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#E9E5DC] text-xs text-[#4A4641]">
              <Calendar className="w-3.5 h-3.5 text-[#B86E52] shrink-0" />
              <span className="font-semibold text-[#252525] truncate max-w-[220px]">{eventName}</span>
            </div>



            <button
              onClick={() => onSelectTab('attendees')}
              className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-colors cursor-pointer ${activeTab === 'attendees'
                  ? 'bg-[#F2F5F0] border-[#D8E0D4] text-[#2E683E] font-semibold'
                  : 'bg-[#FAF8F5] border-[#E9E5DC] text-[#4A4641] hover:bg-[#F2F5F0]'
                }`}
              title="View Attendee Directory"
            >
              <Users className="w-3.5 h-3.5 text-[#77866F] shrink-0" />
              <span>{attendeeCount} Attendee{attendeeCount === 1 ? '' : 's'}</span>
            </button>

            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#E9E5DC] text-[11px] text-[#77736C]">
              <span
                className={`w-2 h-2 rounded-full ${serverOnline ? 'bg-[#2E683E]' : 'bg-[#A83232]'
                  }`}
              />
              <span className="font-mono">{serverOnline ? 'Live API' : 'Offline'}</span>
            </div>
          </div>
        </div>

        {/* Workflow Stages Navigation */}
        <nav className="flex items-center justify-between -mb-px overflow-x-auto py-1">
          <div className="flex items-center space-x-1 sm:space-x-2">
            {steps.map((step) => {
              const isActive = activeTab === step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => onSelectTab(step.id)}
                  className={`flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${isActive
                      ? 'bg-[#FBF2EE] text-[#B86E52] border border-[#F0D5C9] shadow-sm'
                      : 'text-[#77736C] hover:text-[#252525] hover:bg-[#FAF8F5] border border-transparent'
                    }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${isActive
                        ? 'bg-[#B86E52] text-white'
                        : 'bg-[#EAE6DC] text-[#77736C]'
                      }`}
                  >
                    {step.number}
                  </span>
                  <div className="text-left">
                    <span className="block leading-tight">{step.title}</span>
                  </div>
                </button>
              );
            })}

            {/* Stage 4: Upcoming Generation Step */}
            <div
              className="flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-xs text-[#9E9A90] border border-dashed border-[#DDD8CD] shrink-0 opacity-80 cursor-default select-none"
              title="Bulk ZIP & Background Export — Milestone 4"
            >
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold bg-[#EAE6DC] text-[#9E9A90]">
                4
              </span>
              <div className="text-left">
                <span className="block leading-tight font-medium">Generate Passes</span>
              </div>
              <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-[#F0EDE6] text-[#77736C]">
                Next
              </span>
            </div>
          </div>

          {/* Quick link to Attendee Directory */}
          <div className="hidden lg:flex items-center pl-4">
            <button
              onClick={() => onSelectTab('attendees')}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${activeTab === 'attendees'
                  ? 'text-[#B86E52] bg-[#FBF2EE]'
                  : 'text-[#77736C] hover:text-[#252525] hover:bg-[#FAF8F5]'
                }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Directory</span>
              <span className="ml-1 text-[10px] font-mono px-1.5 py-0.2 bg-[#F0EDE6] text-[#504D47] rounded-full">
                {attendeeCount}
              </span>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};