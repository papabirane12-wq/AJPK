'use client';

import { useState } from 'react';
import { getCotisations, markCotisationPaid } from '@/lib/data/store';
import { formatFCFA, getStatusBadgeColor } from '@/lib/utils/formatters';
import { DollarSign, CheckCircle2, Clock, Smartphone } from 'lucide-react';

export default function AdminCotisationsPage() {
  const [cotisations, setCotisations] = useState(getCotisations());

  const handleMarkPaid = (id: string) => {
    markCotisationPaid(id, 'Wave Sénégal');
    setCotisations(getCotisations());
  };

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Suivi des Cotisations Membres</h1>
          <p className="text-xs text-slate-400 mt-1">
            Cotisation standard : <strong className="text-emerald-400 font-bold">1 000 FCFA / mois</strong> (Architecture prête pour Wave / Orange Money Sénégal).
          </p>
        </div>

        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-400 text-xs font-bold flex items-center gap-2">
          <Smartphone className="w-5 h-5" /> Module de Règlement Local Sénégal
        </div>
      </div>

      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-800 text-slate-400 uppercase font-bold text-[10px]">
            <tr>
              <th className="px-6 py-4">Membre</th>
              <th className="px-6 py-4">N° Adhérent</th>
              <th className="px-6 py-4">Période</th>
              <th className="px-6 py-4">Montant</th>
              <th className="px-6 py-4">Moyen de Paiement</th>
              <th className="px-6 py-4">Statut</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {cotisations.map((cot) => (
              <tr key={cot.id} className="hover:bg-slate-800/50">
                <td className="px-6 py-4 font-bold text-white">{cot.member_name}</td>
                <td className="px-6 py-4 font-mono font-bold text-amber-400">{cot.member_number}</td>
                <td className="px-6 py-4">{cot.period}</td>
                <td className="px-6 py-4 font-extrabold text-emerald-400">{formatFCFA(cot.amount_fcfa)}</td>
                <td className="px-6 py-4 text-slate-400">{cot.method || 'En attente'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadgeColor(cot.status)}`}>
                    {cot.status === 'paye' ? 'Payé ✓' : cot.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {cot.status !== 'paye' && (
                    <button
                      onClick={() => handleMarkPaid(cot.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px]"
                    >
                      Valider Paiement
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
