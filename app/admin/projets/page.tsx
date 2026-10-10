'use client';

import { useState } from 'react';
import { getProjects, updateProjectStatus } from '@/lib/data/store';
import { formatFCFA, getStatusBadgeColor } from '@/lib/utils/formatters';
import { Rocket, ShieldCheck, Mail, Phone } from 'lucide-react';

export default function AdminProjetsPage() {
  const [projects, setProjects] = useState(getProjects());

  const handleStatusChange = (id: string, status: any) => {
    updateProjectStatus(id, status);
    setProjects(getProjects());
  };

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-2xl font-extrabold text-white">Gestion des Projets Jeunes ({projects.length})</h1>
        <p className="text-xs text-slate-400 mt-1">Examinez et mettez à jour le statut des dossiers soumis par les membres.</p>
      </div>

      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-800 text-slate-400 uppercase font-bold text-[10px]">
            <tr>
              <th className="px-6 py-4">Titre du Projet</th>
              <th className="px-6 py-4">Porteur</th>
              <th className="px-6 py-4">Catégorie</th>
              <th className="px-6 py-4">Budget</th>
              <th className="px-6 py-4">Changer Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {projects.map((proj) => (
              <tr key={proj.id} className="hover:bg-slate-800/50">
                <td className="px-6 py-4 font-bold text-white max-w-[200px] truncate">{proj.title}</td>
                <td className="px-6 py-4">{proj.author_name}</td>
                <td className="px-6 py-4 text-emerald-400">{proj.category}</td>
                <td className="px-6 py-4 font-extrabold text-amber-400">{formatFCFA(proj.budget_fcfa)}</td>
                <td className="px-6 py-4">
                  <select
                    value={proj.status}
                    onChange={(e) => handleStatusChange(proj.id, e.target.value)}
                    className="bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-1 text-xs font-bold focus:outline-none"
                  >
                    <option value="Soumis">Soumis</option>
                    <option value="En étude">En étude</option>
                    <option value="Accepté">Accepté</option>
                    <option value="En accompagnement">En accompagnement</option>
                    <option value="Réalisé">Réalisé</option>
                    <option value="Refusé">Refusé</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
