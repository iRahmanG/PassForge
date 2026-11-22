import React, { useState } from 'react';
import { AttendeeInfo } from '@passforge/shared';
import { Card } from '../../components/ui/Card.js';
import { Badge } from '../../components/ui/Badge.js';
import { Button } from '../../components/ui/Button.js';
import { Search, Sparkles, User, RefreshCw, UploadCloud } from 'lucide-react';

interface AttendeeTableProps {
  attendees: AttendeeInfo[];
  onSelectAttendeeForTicket: (attendee: AttendeeInfo) => void;
  onGoToImport: () => void;
  onResetToDefault?: () => void;
  loading?: boolean;
}

export const AttendeeTable: React.FC<AttendeeTableProps> = ({
  attendees,
  onSelectAttendeeForTicket,
  onGoToImport,
  onResetToDefault,
  loading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState('ALL');

  const tiers = ['ALL', 'VIP', 'General', 'Speaker', 'Student'];

  const filtered = attendees.filter(a => {
    const matchesTier = selectedTier === 'ALL' || a.ticketType.toLowerCase() === selectedTier.toLowerCase();
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !q ||
      a.name.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      a.seat.toLowerCase().includes(q) ||
      a.ticketType.toLowerCase().includes(q);
    return matchesTier && matchesSearch;
  });

  const getTierVariant = (tier: string) => {
    const t = tier.toLowerCase();
    if (t.includes('vip')) return 'vip';
    if (t.includes('speaker')) return 'speaker';
    if (t.includes('student')) return 'student';
    return 'general';
  };

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <span>Registered Attendees</span>
          <span className="text-xs font-mono font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
            {filtered.length} of {attendees.length}
          </span>
        </div>
      }
      subtitle="Attendees registered for this event. Click 'Render Ticket' on any attendee to generate all 4 formats."
      action={
        <div className="flex items-center gap-2">
          {onResetToDefault && (
            <Button variant="ghost" size="sm" onClick={onResetToDefault} icon={<RefreshCw className="w-3.5 h-3.5" />}>
              Reset Sample
            </Button>
          )}
          <Button size="sm" onClick={onGoToImport} icon={<UploadCloud className="w-3.5 h-3.5" />}>
            Import More CSV
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, seat..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Ticket Tier Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {tiers.map(t => (
              <button
                key={t}
                onClick={() => setSelectedTier(t)}
                className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-all ${
                  selectedTier === t
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Attendees Table */}
        {filtered.length === 0 ? (
          <div className="py-12 text-center rounded-xl border border-dashed border-slate-800 bg-slate-950/40">
            <User className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">No attendees match your criteria</p>
            <p className="text-xs text-slate-500 mt-1">Try clearing search filters or import a new CSV file</p>
            <Button size="sm" variant="outline" className="mt-4" onClick={() => { setSearchTerm(''); setSelectedTier('ALL'); }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 font-mono text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Attendee</th>
                  <th className="p-3.5">Email</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Seat Allocation</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {filtered.map(attendee => (
                  <tr key={attendee.email} className="hover:bg-slate-900/50 transition-colors">
                    <td className="p-3.5 font-bold text-slate-100 flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-indigo-950 border border-indigo-700/50 flex items-center justify-center text-[11px] font-extrabold text-indigo-300">
                        {attendee.name.charAt(0).toUpperCase()}
                      </div>
                      <span>{attendee.name}</span>
                    </td>
                    <td className="p-3.5 font-mono text-slate-300 text-[11px]">{attendee.email}</td>
                    <td className="p-3.5">
                      <Badge variant={getTierVariant(attendee.ticketType)}>
                        {attendee.ticketType}
                      </Badge>
                    </td>
                    <td className="p-3.5 font-mono font-medium text-cyan-300 text-[11px]">
                      {attendee.seat || 'General Admission'}
                    </td>
                    <td className="p-3.5 text-right">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => onSelectAttendeeForTicket(attendee)}
                        icon={<Sparkles className="w-3.5 h-3.5 text-indigo-400" />}
                      >
                        Generate Ticket
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Card>
  );
};
