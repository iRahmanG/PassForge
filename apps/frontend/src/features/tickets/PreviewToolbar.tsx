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
    { id: 'page', label: 'Responsive Page', icon: <Globe className="w-3.5 h-3.5" /> },
    { id: 'email', label: 'Email HTML', icon: <Mail className="w-3.5 h-3.5" /> },
    { id: 'pdf', label: 'Printable PDF', icon: <FileText className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
      {/* Left: Attendee Selector */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">
          <User className="w-3.5 h-3.5 text-indigo-400" />
          <span>Preview Attendee:</span>
        </div>

        <select
          value={selectedAttendeeId || ''}
          onChange={(e) => onSelectAttendee(e.target.value || undefined)}
          className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500 font-medium"
        >
          {attendees.map((att) => (
            <option key={att.id || att.name} value={att.id || ''}>
              {att.name} ({att.ticketType} • {att.seat || 'Open Seating'})
            </option>
          ))}
          {/* Preset test cases */}
          <option value="test-long-name">
            🧪 Stress Test: Extreme Long Name (Prof. Dr. Alexandrina...)
          </option>
          <option value="test-open-seating">
            🧪 Fallback Test: Missing Seat Number (Open Seating)
          </option>
        </select>
      </div>

      {/* Middle: Format Switcher Tabs */}
      <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-center">
        {formats.map((f) => {
          const isActive = activeFormat === f.id;
          return (
            <button
              key={f.id}
              onClick={() => onSelectFormat(f.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {f.icon}
              <span>{f.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right: Viewport Toggle & Save Button */}
      <div className="flex items-center gap-2.5 justify-end">
        {/* Mobile Viewport Toggle (Only visible for 'page') */}
        {activeFormat === 'page' && (
          <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 mr-1">
            <button
              onClick={() => onToggleMobileView(false)}
              className={`p-1.5 rounded text-xs transition ${
                !isMobileView ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Desktop View"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onToggleMobileView(true)}
              className={`p-1.5 rounded text-xs transition ${
                isMobileView ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
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
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
          title="Refresh Preview"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>

        <button
          onClick={onSaveConfig}
          disabled={saving}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md ${
            saveSuccess
              ? 'bg-emerald-600 text-white border border-emerald-500'
              : isDirty
              ? 'bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-400 animate-pulse'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
          }`}
        >
          {saveSuccess ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Config Saved</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              <span>{isDirty ? 'Save Design' : 'Design Saved'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
