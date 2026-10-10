'use client';

import { getEvents } from '@/lib/data/store';
import { EventCard } from '@/components/cards/EventCard';

export default function MemberEventsPage() {
  const events = getEvents();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Mes Événements</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Liste des événements auxquels vous êtes inscrit.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.slice(0, 2).map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
