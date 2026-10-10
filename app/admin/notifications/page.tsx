'use client';

import { getNotifications } from '@/lib/data/store';
import { formatDateFr } from '@/lib/utils/formatters';
import { Bell, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

export default function AdminNotificationsPage() {
  const notifications = getNotifications();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Centre de Notifications & Log System</h1>
        <p className="text-xs text-slate-400 mt-1">Alertes d’inscription, activités récentes et décisions administrateur.</p>
      </div>

      <div className="space-y-3">
        {notifications.map((notif) => (
          <div key={notif.id} className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex items-start gap-4">
            <div className="p-2.5 bg-brand-500/20 text-brand-400 rounded-xl shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-white text-sm">{notif.title}</h4>
              <p className="text-xs text-slate-300 mt-0.5">{notif.message}</p>
              <p className="text-[10px] text-slate-500 mt-2">{formatDateFr(notif.created_at)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
