'use client';

import { getFormations } from '@/lib/data/store';
import { FormationCard } from '@/components/cards/FormationCard';

export default function MemberFormationsPage() {
  const formations = getFormations();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Mes Formations</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Vos programmes en cours et attestations obtenues.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {formations.slice(0, 2).map((formation) => (
          <FormationCard key={formation.id} formation={formation} />
        ))}
      </div>
    </div>
  );
}
