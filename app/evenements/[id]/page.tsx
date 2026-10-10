'use client';

import { useParams } from 'next/navigation';
import { getEvents, registerForEvent, isRegisteredForEvent } from '@/lib/data/store';
import { formatDateFr, getStatusBadgeColor } from '@/lib/utils/formatters';
import { Calendar, MapPin, Users, Clock, ShieldCheck, Share2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function EventDetailPage() {
  const params = useParams();
  const events = getEvents();
  const event = events.find(e => e.id === params.id) || events[0];

  const [registered, setRegistered] = useState(isRegisteredForEvent(event.id));
  const [count, setCount] = useState(event.registered_count);

  const handleRegister = () => {
    if (!registered) {
      registerForEvent(event.id, 'usr-1');
      setRegistered(true);
      setCount(prev => prev + 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      <Link href="/evenements" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-600">
        <ArrowLeft className="w-4 h-4" /> Retour à l’agenda
      </Link>

      <div className="bg-white dark:bg-slate-850 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="relative h-80 w-full bg-slate-900">
          <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-600 text-white shadow">
              {event.category}
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white mt-3 leading-tight">
              {event.title}
            </h1>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <p className="text-slate-400 font-medium">Date</p>
              <p className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-brand-600" /> {formatDateFr(event.event_date)}
              </p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Horaire</p>
              <p className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-amber-500" /> {event.event_time}
              </p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Lieu</p>
              <p className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1 mt-0.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-emerald-500" /> {event.location}
              </p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Places disponibles</p>
              <p className="font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                <Users className="w-3.5 h-3.5" /> {count} / {event.max_spots} inscrits
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Présentation de l’événement</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">Organisé par</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{event.organizer}</p>
            </div>

            <button
              onClick={handleRegister}
              disabled={registered}
              className={`px-6 py-3 rounded-2xl text-sm font-bold shadow-lg transition ${
                registered
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-brand-600 hover:bg-brand-700 text-white'
              }`}
            >
              {registered ? 'Inscription confirmée ✓' : 'Confirmer ma participation'}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
