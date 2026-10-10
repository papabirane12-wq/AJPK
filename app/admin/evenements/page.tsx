'use client';

import { useState } from 'react';
import { getEvents, addEvent } from '@/lib/data/store';
import { formatDateFr } from '@/lib/utils/formatters';
import { Calendar, PlusCircle, Users, MapPin, Edit, Trash2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

export default function AdminEvenementsPage() {
  const [events, setEvents] = useState(getEvents());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800',
    event_date: '2026-11-20',
    event_time: '09:00 - 16:00',
    location: 'Foyer des Jeunes de Kelle',
    max_spots: 150,
    organizer: 'Bureau AJPK',
    category: 'Forum & Conférence'
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    addEvent(formData);
    setEvents(getEvents());
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Gestion des Événements ({events.length})</h1>
          <p className="text-xs text-slate-400 mt-1">Créez et publiez les événements de la jeunesse de Kelle.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" /> Créer un Événement
        </button>
      </div>

      {/* Events Table */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-800 text-slate-400 uppercase font-bold text-[10px]">
            <tr>
              <th className="px-6 py-4">Titre</th>
              <th className="px-6 py-4">Catégorie</th>
              <th className="px-6 py-4">Date & Heure</th>
              <th className="px-6 py-4">Lieu</th>
              <th className="px-6 py-4">Inscrits</th>
              <th className="px-6 py-4">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {events.map((evt) => (
              <tr key={evt.id} className="hover:bg-slate-800/50">
                <td className="px-6 py-4 font-bold text-white max-w-[200px] truncate">{evt.title}</td>
                <td className="px-6 py-4 text-emerald-400">{evt.category}</td>
                <td className="px-6 py-4">{formatDateFr(evt.event_date)} ({evt.event_time})</td>
                <td className="px-6 py-4">{evt.location}</td>
                <td className="px-6 py-4 font-extrabold text-amber-400">{evt.registered_count} / {evt.max_spots}</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    {evt.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Créer un Nouvel Événement">
        <form onSubmit={handleCreate} className="space-y-4 text-slate-900 dark:text-white">
          <div>
            <label className="text-xs font-bold">Titre de l’événement *</label>
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
              <label className="text-xs font-bold">Date *</label>
              <input
                type="date"
                required
                value={formData.event_date}
                onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-bold">Lieu *</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs mt-1"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-brand-600 text-white font-extrabold text-xs"
          >
            Publier l’événement
          </button>
        </form>
      </Modal>

    </div>
  );
}
