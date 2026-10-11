'use client';

import { getPartners } from '@/lib/data/store';
import { formatDateFr } from '@/lib/utils/formatters';
import { Handshake, ShieldCheck, Globe } from 'lucide-react';

export default function AdminPartenairesPage() {
  const partners = getPartners();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Gestion des Partenaires ({partners.length})</h1>
        <p className="text-xs text-slate-400 mt-1">Validez les demandes et gérez l’annuaire des entreprises partenaires.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {partners.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Handshake className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-300">Aucun partenaire enregistré</p>
            <p className="text-xs text-slate-500 mt-1">Les conventions et partenariats signés s’afficheront ici au fur et à mesure.</p>
          </div>
        ) : (
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800 text-slate-400 uppercase font-bold text-[10px]">
              <tr>
                <th className="px-6 py-4">Organisation</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Secteur</th>
                <th className="px-6 py-4">Email / Phone</th>
                <th className="px-6 py-4">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {partners.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/50">
                  <td className="px-6 py-4 font-bold text-white flex items-center gap-3">
                    <img src={p.logo_url} alt={p.name} className="w-8 h-8 rounded-lg object-contain bg-slate-800 p-1" />
                    <span>{p.name}</span>
                  </td>
                  <td className="px-6 py-4 text-emerald-400 font-semibold">{p.type}</td>
                  <td className="px-6 py-4">{p.sector}</td>
                  <td className="px-6 py-4">{p.email}</td>
                  <td className="px-6 py-4 font-bold text-emerald-400">Officiel ✓</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
