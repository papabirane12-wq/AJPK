'use client';

import { getCurrentUser } from '@/lib/data/store';
import { MemberCardDigital } from '@/components/cards/MemberCardDigital';

export default function CarteMembreDashboardPage() {
  const user = getCurrentUser();

  if (!user) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3 max-w-md mx-auto my-12">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Connexion requise</h2>
        <p className="text-xs text-slate-500">Connectez-vous pour visualiser votre carte de membre numérique officielle.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-xl mx-auto py-6">
      <div className="text-center">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Ma Carte Membre Numérique
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Scannez le QR Code pour vérifier l’authenticité de votre statut membre AJPK auprès des partenaires.
        </p>
      </div>

      <MemberCardDigital member={user} showActions={true} />
    </div>
  );
}
