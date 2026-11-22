import React from 'react';
import { EventInfo } from '@passforge/shared';
import { Card } from '../../components/ui/Card.js';
import { Calendar, MapPin, Building, Globe } from 'lucide-react';

interface EventSummaryCardProps {
  event: EventInfo;
  onEditClick?: () => void;
}

export const EventSummaryCard: React.FC<EventSummaryCardProps> = ({ event, onEditClick }) => {
  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <span>Active Event</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-700/30">
            CURRENT
          </span>
        </div>
      }
      action={
        onEditClick && (
          <button
            onClick={onEditClick}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
          >
            Edit Event
          </button>
        )
      }
    >
      <div className="space-y-3">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">{event.name}</h2>
          {event.tagline && <p className="text-xs text-slate-400 mt-0.5">{event.tagline}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>{event.date} • {event.time}</span>
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <Building className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>{event.organizer}</span>
          </div>

          <div className="flex items-center gap-2 text-slate-300 sm:col-span-2">
            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span>{event.venue}, {event.location}</span>
          </div>

          {event.website && (
            <div className="flex items-center gap-2 text-slate-300 sm:col-span-2">
              <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <a href={event.website} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">
                {event.website}
              </a>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
