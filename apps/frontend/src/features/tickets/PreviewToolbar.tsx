import React from 'react';
import { AttendeeInfo, OutputFormat } from '@passforge/shared';
import {
  Image as ImageIcon,
  Globe,
  Mail,
  FileText,
  Smartphone,
  Monitor,
  RefreshCw,
  Save,
  Check,
  User,
} from 'lucide-react';

interface PreviewToolbarProps {
  attendees: AttendeeInfo[];
  selectedAttendeeId?: string;
  onSelectAttendee: (id: string | undefined) => void;
  activeFormat: OutputFormat;
  onSelectFormat: (format: OutputFormat) => void;
  isMobileView: boolean;
  onToggleMobileView: (mobile: boolean) => void;
  onRefresh: () => void;
  onSaveConfig: () => void;
  isDirty: boolean;
  saving: boolean;
  saveSuccess: boolean;
  loading: boolean;
}

export const PreviewToolbar: React.FC<PreviewToolbarProps> = ({
  attendees,
  selectedAttendeeId,
  onSelectAttendee,
  activeFormat,
  onSelectFormat,
  isMobileView,
  onToggleMobileView,
  onRefresh,
  onSaveConfig,
  isDirty,
  saving,
  saveSuccess,
  loading,
}) => {
  const formats: { id: OutputFormat; label: string; icon: React.ReactNode }[] = [
    { id: 'png', label: 'Canvas PNG', icon: <ImageIcon className="w-3.5 h-3.5" /> },
    { id: 'page', label: 'Responsive Web', icon: <Globe className="w-3.5 h-3.5" /> },
    { id: 'email', label: 'Email HTML', icon: <Mail className="w-3.5 h-3.5" /> },
    { id: 'pdf', label: 'Printable PDF', icon: <FileText className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="bg-white border border-[#E9E5DC] rounded-2xl p-3.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-sm">
      {/* Left: Attendee Selector */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <User className="w-3.5 h-3.5 text-[#B86E52] shrink-0" />
        <select
          value={selectedAttendeeId || ''}
          onChange={(e) => onSelectAttendee(e.target.value || undefined)}
          className="bg-[#FAF8F5] border border-[#DDD8CD] text-[#252525] text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-[#B86E52] font-medium truncate flex-1 max-w-xs transition-colors"
        >
          {attendees.map((att) => (
            <option key={att.id || att.name} value={att.id || ''}>
              {att.name} ({att.ticketType} • {att.seat || 'Open Seating'})
            </option>
          ))}
        </select>
      </div>

      {/* Middle: Segmented Format Switcher Tabs */}
      <div className="flex items-center gap-1 bg-[#FAF8F5] p-1 rounded-xl border border-[#E9E5DC] self-center overflow-x-auto max-w-full">
        {formats.map((f) => {
          const isActive = activeFormat === f.id;
          return (
            <button
              key={f.id}
              onClick={() => onSelectFormat(f.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#B86E52] text-white shadow-sm'
                  : 'text-[#77736C] hover:text-[#252525] hover:bg-[#F0EDE6]'
              }`}
            >
              {f.icon}
              <span className="hidden md:inline">{f.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right: Viewport Toggle, Refresh & Save */}
      <div className="flex items-center gap-2 justify-end shrink-0">
        {activeFormat === 'page' && (
          <div className="flex items-center bg-[#FAF8F5] p-0.5 rounded-lg border border-[#E9E5DC]">
            <button
              onClick={() => onToggleMobileView(false)}
              className={`p-1 rounded text-xs transition-colors cursor-pointer ${
                !isMobileView ? 'bg-white text-[#252525] shadow-xs' : 'text-[#9E9A90] hover:text-[#252525]'
              }`}
              title="Desktop View"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onToggleMobileView(true)}
              className={`p-1 rounded text-xs transition-colors cursor-pointer ${
                isMobileView ? 'bg-white text-[#252525] shadow-xs' : 'text-[#9E9A90] hover:text-[#252525]'
              }`}
              title="Mobile View"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#F0EDE6] text-[#77736C] hover:text-[#252525] border border-[#DDD8CD] transition cursor-pointer"
          title="Refresh Preview"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>

        <button
          onClick={onSaveConfig}
          disabled={saving}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer ${
            saveSuccess
              ? 'bg-[#EEF6F0] text-[#2E683E] border border-[#C6E2CD]'
              : isDirty
              ? 'bg-[#B86E52] hover:bg-[#A15D43] text-white'
              : 'bg-[#FAF8F5] hover:bg-[#F0EDE6] text-[#4A4641] border border-[#DDD8CD]'
          }`}
        >
          {saveSuccess ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Saved</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              <span>{isDirty ? 'Save' : 'Saved'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};