'use client';

import { useState } from 'react';
import { getFormations, addFormation } from '@/lib/data/store';
import { formatDateFr, formatFCFA } from '@/lib/utils/formatters';
import { BookOpen, PlusCircle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

export default function AdminFormationsPage() {
  const [formations, setFormations] = useState(getFormations());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: 'Formateur AJPK',
    duration: '4 semaines',
    start_date: '2026-11-15',
    max_spots: 30,
    price_fcfa: 0,
    level: 'Tous niveaux' as const
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    addFormation(formData);
    setFormations(getFormations());
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Gestion des Formations ({formations.length})</h1>
          <p className="text-xs text-slate-400 mt-1">Gérez le catalogue des programmes qualifiants.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" /> Ajouter une Formation
        </button>
      </div>

      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-800 text-slate-400 uppercase font-bold text-[10px]">
            <tr>
              <th className="px-6 py-4">Titre</th>
              <th className="px-6 py-4">Formateur</th>
              <th className="px-6 py-4">Durée</th>
              <th className="px-6 py-4">Prix</th>
              <th className="px-6 py-4">Inscrits</th>
              <th className="px-6 py-4">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {formations.map((form) => (
              <tr key={form.id} className="hover:bg-slate-800/50">
                <td className="px-6 py-4 font-bold text-white max-w-[200px] truncate">{form.title}</td>
                <td className="px-6 py-4">{form.instructor}</td>
                <td className="px-6 py-4 text-emerald-400">{form.duration}</td>
                <td className="px-6 py-4 font-bold text-amber-400">
                  {form.price_fcfa === 0 ? 'Gratuit' : formatFCFA(form.price_fcfa)}
                </td>
                <td className="px-6 py-4 font-extrabold">{form.registered_count} / {form.max_spots}</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    {form.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Créer une Formation">
        <form onSubmit={handleCreate} className="space-y-4 text-slate-900 dark:text-white">
          <div>
            <label className="text-xs font-bold">Titre de la formation *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs mt-1"
            />
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold">Formateur Lead *</label>
              <input
                type="text"
                required
                value={formData.instructor}
                onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-bold">Prix (FCFA) *</label>
              <input
                type="number"
                required
                value={formData.price_fcfa}
                onChange={(e) => setFormData({ ...formData, price_fcfa: Number(e.target.value) })}
                className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs mt-1"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-brand-600 text-white font-extrabold text-xs"
          >
            Créer la formation
          </button>
        </form>
      </Modal>

    </div>
  );
}
