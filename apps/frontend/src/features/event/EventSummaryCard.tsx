import React from 'react';
import { EventInfo } from '@passforge/shared';
import { Calendar, MapPin, Building, Globe, ExternalLink, Edit2, Sparkles, CheckCircle2 } from 'lucide-react';

interface EventSummaryCardProps {
  event: EventInfo;
  onEditClick?: () => void;
}

export const EventSummaryCard: React.FC<EventSummaryCardProps> = ({ event, onEditClick }) => {
  return (
    <div className="bg-[#FAF8F5] border border-[#E9E5DC] rounded-2xl p-6 shadow-sm space-y-5">
      {/* Top Specification Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E9E5DC]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#2E683E]" />
          <span className="text-[11px] font-mono font-bold text-[#2E683E] uppercase tracking-wider">
            Verified Event Brief
          </span>
        </div>

        {onEditClick && (
          <button
            onClick={onEditClick}
            className="flex items-center gap-1.5 text-xs text-[#B86E52] hover:text-[#A15D43] font-semibold px-2.5 py-1 rounded-lg bg-[#FBF2EE] hover:bg-[#F5E6DF] border border-[#F0D5C9] transition-all cursor-pointer"
          >
            <Edit2 className="w-3 h-3" />
            <span>Edit</span>
          </button>
        )}
      </div>

      {/* Main Event Title Banner */}
      <div className="space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#77736C]">
          Event Name
        </span>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#252525] tracking-tight leading-snug break-words">
          {event.name}
        </h2>
        {event.tagline && (
          <p className="text-xs text-[#77736C] font-serif italic break-words mt-1">
            "{event.tagline}"
          </p>
        )}
      </div>

      {/* Structured Details Sheet */}
      <div className="space-y-3 pt-2 text-xs">
        {/* Date & Schedule */}
        <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-[#E9E5DC]">
          <div className="p-2 rounded-lg bg-[#FBF2EE] text-[#B86E52] border border-[#F0D5C9] shrink-0 mt-0.5">
            <Calendar className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-bold text-[#77736C] uppercase tracking-wider block">
              Date & Schedule
            </span>
            <p className="font-semibold text-[#252525] mt-0.5 break-words">{event.date}</p>
            <p className="text-[11px] text-[#77736C]">{event.time}</p>
          </div>
        </div>

        {/* Venue & Location */}
        <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-[#E9E5DC]">
          <div className="p-2 rounded-lg bg-[#F2F5F0] text-[#55684D] border border-[#D8E0D4] shrink-0 mt-0.5">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-bold text-[#77736C] uppercase tracking-wider block">
              Venue Location
            </span>
            <p className="font-semibold text-[#252525] mt-0.5 break-words">{event.venue}</p>
            <p className="text-[11px] text-[#77736C] break-words">{event.location}</p>
          </div>
        </div>

        {/* Presented by */}
        <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-[#E9E5DC]">
          <div className="p-2 rounded-lg bg-[#FAF8F5] text-[#77736C] border border-[#DDD8CD] shrink-0 mt-0.5">
            <Building className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-bold text-[#77736C] uppercase tracking-wider block">
              Presented By
            </span>
            <p className="font-semibold text-[#252525] mt-0.5 break-words">{event.organizer}</p>
          </div>
        </div>

        {/* Website Portal */}
        {event.website && (
          <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-[#E9E5DC]">
            <div className="p-2 rounded-lg bg-[#EEF6F0] text-[#2E683E] border border-[#C6E2CD] shrink-0 mt-0.5">
              <Globe className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold text-[#77736C] uppercase tracking-wider block">
                Official Website
              </span>
              <a
                href={event.website}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-[#B86E52] hover:text-[#A15D43] flex items-center gap-1.5 mt-0.5 truncate group"
              >
                <span className="truncate">{event.website}</span>
                <ExternalLink className="w-3 h-3 shrink-0 opacity-60 group-hover:opacity-100" />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Verification Note */}
      <div className="pt-3 border-t border-[#E9E5DC] flex items-center gap-2 text-[11px] text-[#77736C]">
        <CheckCircle2 className="w-3.5 h-3.5 text-[#2E683E] shrink-0" />
        <span>Synchronized with Hyper Elements SSR generator</span>
      </div>
    </div>
  );
};