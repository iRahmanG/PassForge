import React, { useState } from 'react';
import { AttendeeInfo } from '@passforge/shared';
import { Card } from '../../components/ui/Card.js';
import { Badge } from '../../components/ui/Badge.js';
import { Button } from '../../components/ui/Button.js';
import { Search, Sparkles, User, RefreshCw, UploadCloud, X, ArrowUpRight } from 'lucide-react';

interface AttendeeTableProps {
  attendees: AttendeeInfo[];
  onSelectAttendeeForTicket: (attendee: AttendeeInfo) => void;
  onGoToImport: () => void;
  onResetToDefault?: () => void;
  onLoadDemo?: () => void;
  loading?: boolean;
}

export const AttendeeTable: React.FC<AttendeeTableProps> = ({
  attendees,
  onSelectAttendeeForTicket,
  onGoToImport,
  onResetToDefault,
  onLoadDemo,
  loading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState('ALL');

  const tiers = ['ALL', 'VIP', 'General', 'Speaker', 'Student'];

  const filtered = attendees.filter((a) => {
    const matchesTier =
      selectedTier === 'ALL' || a.ticketType.toLowerCase() === selectedTier.toLowerCase();
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !q ||
      a.name.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      (a.seat && a.seat.toLowerCase().includes(q)) ||
      a.ticketType.toLowerCase().includes(q);
    return matchesTier && matchesSearch;
  });

  const getTierVariant = (tier: string) => {
    const t = tier.toLowerCase();
    if (t.includes('vip')) return 'vip' as const;
    if (t.includes('speaker')) return 'speaker' as const;
    if (t.includes('student')) return 'student' as const;
    return 'general' as const;
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <Card
      headerIcon={<User className="w-4 h-4 text-[#B86E52]" />}
      title="Registered Attendee Roster"
      subtitle="Directory of all attendees registered for this event. Click 'Preview Pass' to view individual tickets across all 4 formats."
      action={
        <div className="flex items-center gap-2">
          {onLoadDemo && (
            <Button
              variant="outline"
              size="sm"
              onClick={onLoadDemo}
              icon={<Sparkles className="w-3.5 h-3.5 text-[#B86E52]" />}
            >
              Load Demo Event & Attendees
            </Button>
          )}
          {onResetToDefault && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetToDefault}
              icon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Reset 1 Sample
            </Button>
          )}
          <Button
            size="sm"
            onClick={onGoToImport}
            icon={<UploadCloud className="w-3.5 h-3.5" />}
          >
            Import More CSV
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Search & Category Filter Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 text-[#9E9A90] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, email, seat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 bg-white border border-[#DDD8CD] rounded-xl pl-10 pr-8 text-xs text-[#252525] placeholder-[#9E9A90] focus:outline-none focus:border-[#B86E52] focus:ring-2 focus:ring-[#B86E52]/15 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9E9A90] hover:text-[#252525] p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Ticket Tier Filter Tabs */}
          <div className="flex items-center gap-1 bg-[#FAF8F5] p-1 rounded-xl border border-[#E9E5DC] overflow-x-auto">
            {tiers.map((t) => {
              const isActive = selectedTier === t;
              return (
                <button
                  key={t}
                  onClick={() => setSelectedTier(t)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#B86E52] text-white shadow-sm'
                      : 'text-[#77736C] hover:text-[#252525] hover:bg-[#F0EDE6]'
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        {/* Attendee Data Table */}
        <div className="overflow-x-auto rounded-xl border border-[#E9E5DC] bg-white shadow-sm">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FAF8F5] text-[#77736C] border-b border-[#E9E5DC] font-mono text-[11px] uppercase tracking-wider">
              <tr>
                <th className="p-3.5 pl-4 font-semibold">Attendee</th>
                <th className="p-3.5 font-semibold">Ticket Type</th>
                <th className="p-3.5 font-semibold">Seat Number</th>
                <th className="p-3.5 font-semibold hidden md:table-cell">Email Address</th>
                <th className="p-3.5 pr-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E5DC]">
              {filtered.length > 0 ? (
                filtered.map((attendee, idx) => (
                  <tr
                    key={attendee.id || attendee.email || idx}
                    className="hover:bg-[#FAF8F5] transition-colors group"
                  >
                    {/* Attendee Name & Avatar */}
                    <td className="p-3.5 pl-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-[#FBF2EE] border border-[#F0D5C9] text-[#B86E52] flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                          {getInitials(attendee.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-[#252525] text-sm group-hover:text-[#B86E52] transition-colors truncate max-w-xs">
                            {attendee.name}
                          </p>
                          <p className="text-[11px] text-[#77736C] truncate max-w-xs md:hidden">
                            {attendee.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Ticket Type Badge */}
                    <td className="p-3.5">
                      <Badge variant={getTierVariant(attendee.ticketType)}>
                        {attendee.ticketType}
                      </Badge>
                    </td>

                    {/* Seat Number */}
                    <td className="p-3.5 font-mono text-[#4A4641]">
                      {attendee.seat ? (
                        <span className="px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[#E9E5DC] font-semibold text-[#252525]">
                          {attendee.seat}
                        </span>
                      ) : (
                        <span className="text-[#9E9A90] italic">Open Seating</span>
                      )}
                    </td>

                    {/* Email Address */}
                    <td className="p-3.5 font-mono text-[#77736C] hidden md:table-cell truncate max-w-xs">
                      {attendee.email}
                    </td>

                    {/* Action Button */}
                    <td className="p-3.5 pr-4 text-right">
                      <button
                        onClick={() => onSelectAttendeeForTicket(attendee)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#B86E52] bg-[#FBF2EE] hover:bg-[#B86E52] hover:text-white border border-[#F0D5C9] transition-all cursor-pointer shadow-sm"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Preview Pass</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                /* Empty Search State */
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-[#E9E5DC] text-[#9E9A90] flex items-center justify-center">
                        <Search className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#252525]">No Attendees Found</h4>
                        <p className="text-xs text-[#77736C] mt-1">
                          No registered attendee matches your filter criteria or search keyword.
                        </p>
                      </div>
                      {(searchTerm || selectedTier !== 'ALL') && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setSearchTerm('');
                            setSelectedTier('ALL');
                          }}
                        >
                          Clear Filters
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Summary Info */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-[#77736C] gap-2 pt-2">
          <span>
            Showing {filtered.length} of {attendees.length} registered attendees
          </span>
          <span className="font-mono text-[11px] text-[#9E9A90]">
            Click 'Preview Pass' on any row to open the multi-format inspector
          </span>
        </div>
      </div>
    </Card>
  );
};