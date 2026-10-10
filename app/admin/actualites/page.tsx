'use client';

import { useState } from 'react';
import { getArticles, addArticle } from '@/lib/data/store';
import { formatDateFr } from '@/lib/utils/formatters';
import { Newspaper, PlusCircle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

export default function AdminActualitesPage() {
  const [articles, setArticles] = useState(getArticles());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Actualité',
    summary: '',
    content: '',
    author: 'Bureau AJPK'
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    addArticle(formData);
    setArticles(getArticles());
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Gestion des Actualités CMS ({articles.length})</h1>
          <p className="text-xs text-slate-400 mt-1">Rédigez et publiez les communiqués de l’AJPK.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" /> Rédiger un Article
        </button>
      </div>

      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-800 text-slate-400 uppercase font-bold text-[10px]">
            <tr>
              <th className="px-6 py-4">Titre</th>
              <th className="px-6 py-4">Catégorie</th>
              <th className="px-6 py-4">Auteur</th>
              <th className="px-6 py-4">Date de Publication</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {articles.map((art) => (
              <tr key={art.id} className="hover:bg-slate-800/50">
                <td className="px-6 py-4 font-bold text-white max-w-[250px] truncate">{art.title}</td>
                <td className="px-6 py-4 text-emerald-400">{art.category}</td>
                <td className="px-6 py-4">{art.author}</td>
                <td className="px-6 py-4">{formatDateFr(art.published_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Publier un Article CMS">
        <form onSubmit={handleCreate} className="space-y-4 text-slate-900 dark:text-white">
          <div>
            <label className="text-xs font-bold">Titre de l’article *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs mt-1"
            />
          </div>

          <div>
            <label className="text-xs font-bold">Résumé court *</label>
            <input
              type="text"
              required
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs mt-1"
            />
          </div>

          <div>
            <label className="text-xs font-bold">Contenu complet *</label>
            <textarea
              required
              rows={4}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs mt-1"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-brand-600 text-white font-extrabold text-xs"
          >
            Publier l’article
          </button>
        </form>
      </Modal>
    </div>
  );
}
