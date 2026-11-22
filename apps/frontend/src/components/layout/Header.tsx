import React from 'react';
import { ActiveTab } from '../../types/index.js';
import { Ticket, Calendar, UploadCloud, Users, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  eventName?: string;
  attendeeCount?: number;
  serverOnline?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  eventName = 'KIET TechFest 2027',
  attendeeCount = 1,
  serverOnline = true,
}) => {
  return (
    <header className="bg-slate-900/90 border-b border-slate-800/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Product Title */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white">PassForge</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-700/40 uppercase tracking-wider">
                  Milestone 3
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Bulk Personalized Event Ticket Generator</p>
            </div>
          </div>

          {/* Active Context Badges */}
          <div className="hidden md:flex items-center gap-3">
            <div className="px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs flex items-center gap-2 text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-semibold text-slate-200">{eventName}</span>
            </div>
            <div className="px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs flex items-center gap-2 text-slate-300">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>{attendeeCount} Attendee{attendeeCount === 1 ? '' : 's'}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/60 border border-slate-700/40 text-[11px] text-slate-400">
              <span className={`w-2 h-2 rounded-full ${serverOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              <span>API {serverOnline ? '3000' : 'Offline'}</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 border-t border-slate-800/60 -mb-px">
          <button
            onClick={() => onSelectTab('event')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'event'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Event Settings</span>
          </button>

          <button
            onClick={() => onSelectTab('import')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'import'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>CSV Attendee Import</span>
          </button>

          <button
            onClick={() => onSelectTab('attendees')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'attendees'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Attendee Directory</span>
            <span className="ml-1 px-1.5 py-0.2 bg-slate-800 text-[10px] rounded-full text-slate-300">
              {attendeeCount}
            </span>
          </button>

          <button
            onClick={() => onSelectTab('tickets')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'tickets'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Ticket Designer & Preview</span>
          </button>
        </div>
      </div>
    </header>
  );
};
