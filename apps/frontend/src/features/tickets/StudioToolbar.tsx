import React, { useState, useRef, useEffect } from 'react';
import {
  Ticket,
  ArrowLeft,
  Calendar,
  Users,
  Download,
  Check,
  Sparkles,
  ChevronDown,
  FileText,
  Image as ImageIcon,
  Globe,
  Mail,
  Sliders,
  UploadCloud,
} from 'lucide-react';
import { ActiveTab } from '../../types/index.js';
import { OutputFormat } from '@passforge/shared';

interface StudioToolbarProps {
  eventName?: string;
  attendeeCount?: number;
  serverOnline?: boolean;
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onNavigateHome: () => void;
  isDirty?: boolean;
  saving?: boolean;
  saveSuccess?: boolean;
  onSaveConfig?: () => void;
  ticketId?: string;
  onOpenBulkExport?: () => void;
  onLoadDemo?: () => void;
}

export const StudioToolbar: React.FC<StudioToolbarProps> = ({
  eventName = 'KIET TechFest 2027',
  attendeeCount = 1,
  serverOnline = true,
  activeTab,
  onSelectTab,
  onNavigateHome,
  isDirty = false,
  saving = false,
  saveSuccess = false,
  onSaveConfig,
  ticketId = 'KTF27-VIP-84920',
  onOpenBulkExport,
  onLoadDemo,
}) => {
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setExportMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const exportOptions = [
    {
      format: 'png' as OutputFormat,
      label: 'Canvas Badge (PNG)',
      desc: '2000×1040 retina badge image',
      icon: <ImageIcon className="w-4 h-4 text-[#B86E52]" />,
    },
    {
      format: 'pdf' as OutputFormat,
      label: 'Printable Document (PDF)',
      desc: 'Vector admission document with stub',
      icon: <FileText className="w-4 h-4 text-[#2E683E]" />,
    },
    {
      format: 'page' as OutputFormat,
      label: 'Web Pass (HTML)',
      desc: 'Responsive digital wallet pass',
      icon: <Globe className="w-4 h-4 text-[#0E7490]" />,
    },
    {
      format: 'email' as OutputFormat,
      label: 'Email Invite (HTML)',
      desc: 'Tested email table layout',
      icon: <Mail className="w-4 h-4 text-[#945B0E]" />,
    },
  ];

  return (
    <header className="bg-white border-b border-[#E9E5DC] sticky top-0 z-30 shadow-xs">
      <div className="w-full px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Left Section: Logo, Home Return & Workspace Navigation */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2 text-left cursor-pointer group"
            title="Return to Public Website"
          >
            <div className="h-8 w-8 rounded-lg bg-[#B86E52] text-white flex items-center justify-center shadow-xs group-hover:bg-[#A15D43] transition-colors shrink-0">
              <Ticket className="w-4 h-4" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight text-[#252525]">
                  PassForge
                </span>
                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-[#FBF2EE] text-[#B86E52] border border-[#F0D5C9] uppercase">
                  Studio
                </span>
              </div>
            </div>
          </button>

          <div className="h-4 w-px bg-[#E9E5DC] hidden sm:block" />

          {/* Quick Workspace Switcher */}
          <div className="flex items-center gap-1 bg-[#FAF8F5] p-1 rounded-lg border border-[#E9E5DC]">
            <button
              data-testid="toolbar-tab-tickets"
              onClick={() => onSelectTab('tickets')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'tickets'
                  ? 'bg-white text-[#B86E52] shadow-xs'
                  : 'text-[#77736C] hover:text-[#252525]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Design Studio</span>
            </button>
            <button
              data-testid="toolbar-tab-event"
              onClick={() => onSelectTab('event')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'event'
                  ? 'bg-white text-[#B86E52] shadow-xs'
                  : 'text-[#77736C] hover:text-[#252525]'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Event</span>
            </button>
            <button
              data-testid="toolbar-tab-import"
              onClick={() => onSelectTab('import')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'import'
                  ? 'bg-white text-[#B86E52] shadow-xs'
                  : 'text-[#77736C] hover:text-[#252525]'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Import</span>
            </button>
            <button
              onClick={() => onSelectTab('attendees')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'attendees'
                  ? 'bg-white text-[#B86E52] shadow-xs'
                  : 'text-[#77736C] hover:text-[#252525]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Roster</span>
            </button>
          </div>
        </div>

        {/* Center Section: Event Title & Session Save Status */}
        <div className="hidden lg:flex items-center gap-2.5 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FAF8F5] border border-[#E9E5DC]">
            <Calendar className="w-3.5 h-3.5 text-[#B86E52]" />
            <span className="font-semibold text-[#252525] truncate max-w-[200px]">
              {eventName}
            </span>
          </div>



          {/* Session Persistence Status */}
          {saving ? (
            <span className="text-[11px] font-medium text-[#77736C] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#B86E52] animate-pulse" />
              Saving...
            </span>
          ) : isDirty ? (
            <button
              onClick={onSaveConfig}
              className="text-[11px] font-semibold text-[#945B0E] bg-[#FDF6E8] hover:bg-[#FBEFCF] border border-[#F3E0BA] px-2 py-0.5 rounded-full flex items-center gap-1 cursor-pointer transition-colors"
              title="Click to save design configuration"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#945B0E]" />
              Save Changes
            </button>
          ) : saveSuccess ? (
            <span className="text-[11px] font-semibold text-[#2E683E] bg-[#EEF6F0] border border-[#C6E2CD] px-2 py-0.5 rounded-full flex items-center gap-1">
              <Check className="w-3 h-3 text-[#2E683E]" />
              Saved to session
            </span>
          ) : (
            <span className="text-[11px] text-[#77736C] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2E683E]" />
              Saved in session
            </span>
          )}
        </div>

        {/* Right Section: Attendee Count & Export Action */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => onSelectTab('attendees')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#E9E5DC] bg-[#FAF8F5] hover:bg-white text-xs text-[#5F5B54] transition-colors cursor-pointer"
            title="View attendee roster"
          >
            <Users className="w-3.5 h-3.5 text-[#77866F]" />
            <span className="font-semibold text-[#252525]">{attendeeCount}</span>
            <span className="hidden sm:inline text-[#77736C]">Attendees</span>
          </button>

          {/* Export Dropdown Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setExportMenuOpen(!exportMenuOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#B86E52] hover:bg-[#A15D43] transition-colors cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-80" />
            </button>

            {exportMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-[#DDD8CD] rounded-xl shadow-lg p-2 z-50 animate-fade-in">
                {/* Batch Export Action Button */}
                <button
                  type="button"
                  data-testid="export-dropdown-bulk-btn"
                  onClick={() => {
                    setExportMenuOpen(false);
                    onOpenBulkExport?.();
                  }}
                  className="w-full flex items-start gap-2.5 p-2 rounded-lg bg-[#FAF8F5] hover:bg-[#FBF2EE] border border-[#E9E5DC] hover:border-[#F0D5C9] transition-all group text-left mb-2 cursor-pointer shadow-2xs"
                >
                  <div className="p-1.5 rounded-md bg-white border border-[#E9E5DC] group-hover:border-[#F0D5C9] group-hover:text-[#B86E52] text-[#B86E52] mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#252525] group-hover:text-[#B86E52]">
                        Batch Export (ZIP)
                      </span>
                      <span className="text-[9px] font-semibold px-1 py-0.2 rounded bg-[#FBF2EE] text-[#B86E52] uppercase">
                        Bulk
                      </span>
                    </div>
                    <p className="text-[10px] text-[#77736C] leading-snug mt-0.5">
                      Generate & download personalized tickets for roster
                    </p>
                  </div>
                </button>

                <div className="px-2.5 py-1.5 border-t border-[#F0EDE6] mb-1">
                  <p className="text-[11px] font-bold text-[#252525] uppercase tracking-wider">
                    Download Current Pass
                  </p>
                  <p className="text-[10px] text-[#77736C]">Ticket #{ticketId}</p>
                </div>

                <div className="space-y-1">
                  {exportOptions.map((opt) => (
                    <a
                      key={opt.format}
                      href={`/api/download/${opt.format}?ticketId=${ticketId}`}
                      download
                      onClick={() => setExportMenuOpen(false)}
                      className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-[#FAF8F5] transition-colors group"
                    >
                      <div className="p-1 rounded bg-[#FAF8F5] border border-[#E9E5DC] group-hover:bg-white mt-0.5">
                        {opt.icon}
                      </div>
                      <div className="min-w-0 flex-1 text-left">
                        <p className="text-xs font-semibold text-[#252525] group-hover:text-[#B86E52]">
                          {opt.label}
                        </p>
                        <p className="text-[10px] text-[#77736C] leading-snug">
                          {opt.desc}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
