'use client';

import { getOpportunities } from '@/lib/data/store';
import { OpportunityCard } from '@/components/cards/OpportunityCard';

export default function MemberOpportunitesPage() {
  const opps = getOpportunities();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Mes Opportunités Sauvegardées</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Vos offres d’emploi, bourses et appels à projets mis de côté.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {opps.slice(0, 2).map((opp) => (
          <OpportunityCard key={opp.id} opportunity={opp} />
        ))}
      </div>
    </div>
  );
}
