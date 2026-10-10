'use client';

import { useState } from 'react';
import { getOpportunities, addOpportunity } from '@/lib/data/store';
import { formatDateFr } from '@/lib/utils/formatters';
import { Briefcase, PlusCircle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

export default function AdminOpportunitesPage() {
  const [opps, setOpps] = useState(getOpportunities());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Emploi' as const,
    organization: '',
    location: 'Kelle',
    deadline: '2026-12-31',
    description: ''
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    addOpportunity(formData);
    setOpps(getOpportunities());
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Gestion des Opportunités ({opps.length})</h1>
          <p className="text-xs text-slate-400 mt-1">Publiez les offres d’emploi, bourses, concours et appels à projets.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" /> Publier une Opportunité
        </button>
      </div>

      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-800 text-slate-400 uppercase font-bold text-[10px]">
            <tr>
              <th className="px-6 py-4">Titre</th>
              <th className="px-6 py-4">Catégorie</th>
              <th className="px-6 py-4">Organisation</th>
              <th className="px-6 py-4">Localisation</th>
              <th className="px-6 py-4">Date Limite</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {opps.map((o) => (
              <tr key={o.id} className="hover:bg-slate-800/50">
                <td className="px-6 py-4 font-bold text-white max-w-[200px] truncate">{o.title}</td>
                <td className="px-6 py-4 text-emerald-400">{o.category}</td>
                <td className="px-6 py-4">{o.organization}</td>
                <td className="px-6 py-4">{o.location}</td>
                <td className="px-6 py-4 font-bold text-rose-400">{formatDateFr(o.deadline)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Publier une Opportunité">
        <form onSubmit={handleCreate} className="space-y-4 text-slate-900 dark:text-white">
          <div>
            <label className="text-xs font-bold">Titre de l’offre *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold">Catégorie *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs mt-1"
              >
                <option value="Emploi">Emploi</option>
                <option value="Stage">Stage</option>
                <option value="Formation">Formation</option>
                <option value="Bourse">Bourse</option>
                <option value="Concours">Concours</option>
                <option value="Financement">Financement</option>
                <option value="Appel à projets">Appel à projets</option>
                <option value="Volontariat">Volontariat</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold">Organisation *</label>
              <input
                type="text"
                required
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs mt-1"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold">Description *</label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs mt-1"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-brand-600 text-white font-extrabold text-xs"
          >
            Publier l’opportunité
          </button>
        </form>
      </Modal>

    </div>
  );
}
