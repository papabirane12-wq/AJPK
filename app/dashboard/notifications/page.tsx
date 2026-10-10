'use client';

import { getNotifications } from '@/lib/data/store';
import { formatDateFr } from '@/lib/utils/formatters';
import { Bell, CheckCircle2 } from 'lucide-react';

export default function MemberNotificationsPage() {
  const notifications = getNotifications();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Notifications</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Confirmations d’inscriptions, nouvelles formations et alertes.</p>
      </div>

      <div className="space-y-3">
        {notifications.map((notif) => (
          <div key={notif.id} className="p-4 bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-start gap-4">
            <div className="p-2.5 bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-300 rounded-xl shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">{notif.title}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{notif.message}</p>
              <p className="text-[10px] text-slate-400 mt-2">{formatDateFr(notif.created_at)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
