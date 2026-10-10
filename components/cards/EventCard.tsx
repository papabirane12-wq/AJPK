'use client';

import Link from 'next/link';
import { Event } from '@/types';
import { formatDateFr, getStatusBadgeColor } from '@/lib/utils/formatters';
import { Calendar, MapPin, Users, Clock, ArrowRight } from 'lucide-react';
import { registerForEvent, isRegisteredForEvent } from '@/lib/data/store';
import { useState } from 'react';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const [registered, setRegistered] = useState(isRegisteredForEvent(event.id));
  const [count, setCount] = useState(event.registered_count);

  const handleRegister = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!registered) {
      registerForEvent(event.id, 'usr-1');
      setRegistered(true);
      setCount(prev => prev + 1);
    }
  };

  return (
    <div className="group bg-white dark:bg-slate-850 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      
      {/* Image Header */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
        <img
          src={event.image_url}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
        
        {/* Category & Status */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-white backdrop-blur shadow">
            {event.category}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadgeColor(event.status)}`}>
            {event.status === 'a_venir' ? 'À venir' : event.status}
          </span>
        </div>

        {/* Date badge */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white text-xs font-semibold">
          <span className="flex items-center gap-1 bg-brand-600/90 px-2.5 py-1 rounded-lg backdrop-blur">
            <Calendar className="w-3.5 h-3.5" /> {formatDateFr(event.event_date)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
            {event.title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
            {event.description}
          </p>
        </div>

        <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-500">
              <Clock className="w-3.5 h-3.5 text-amber-500" /> {event.event_time}
            </span>
            <span className="flex items-center gap-1 font-semibold text-brand-600 dark:text-emerald-400">
              <Users className="w-3.5 h-3.5" /> {count} / {event.max_spots} inscrits
            </span>
          </div>
        </div>

        {/* Action button */}
        <div className="pt-2 flex items-center justify-between gap-2">
          <Link
            href={`/evenements/${event.id}`}
            className="text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-emerald-400 flex items-center gap-1"
          >
            Détails <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleRegister}
            disabled={registered}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
              registered
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-brand-600 hover:bg-brand-700 text-white'
            }`}
          >
            {registered ? 'Inscrit ✓' : 'S’inscrire'}
          </button>
        </div>

      </div>

    </div>
  );
}
