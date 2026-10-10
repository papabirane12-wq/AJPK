'use client';

import { getCurrentUser } from '@/lib/data/store';
import { Settings, Lock, Bell, User } from 'lucide-react';

export default function MemberParametresPage() {
  const user = getCurrentUser();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Paramètres du Compte</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Gérez vos préférences de confidentialité et notifications.</p>
      </div>

      <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-6 shadow-sm">
        
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Annuaire des Talents Public</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Rendre mon profil visible auprès des recrueteurs et entreprises partenaires</p>
          </div>
          <input type="checkbox" defaultChecked className="w-5 h-5 accent-brand-600 rounded" />
        </div>

        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Alertes Opportunités & Emploi</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Recevoir un notification lorsqu’une nouvelle offre correspondant à mes compétences est publiée</p>
          </div>
          <input type="checkbox" defaultChecked className="w-5 h-5 accent-brand-600 rounded" />
        </div>

        <div>
          <button className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-md">
            Enregistrer les modifications
          </button>
        </div>

      </div>
    </div>
  );
}
