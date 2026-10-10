'use client';

import { useState } from 'react';
import { getCurrentUser, addProject } from '@/lib/data/store';
import { YouthProject } from '@/types';
import { Rocket, CheckCircle2, AlertCircle } from 'lucide-react';

export function ProjectSubmissionForm({ onSuccess }: { onSuccess?: () => void }) {
  const user = getCurrentUser();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Agriculture & Énergie',
    summary: '',
    problem: '',
    solution: '',
    team_members: `${user.first_name} ${user.last_name}`,
    budget_fcfa: 2500000,
    funding_needed_fcfa: 1000000,
    needs_description: '',
    image_url: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&q=80&w=800',
    contact_email: user.email,
    contact_phone: user.phone,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProject(formData, user);
    setSubmitted(true);
    if (onSuccess) onSuccess();
  };

  if (submitted) {
    return (
      <div className="p-8 bg-emerald-50 dark:bg-emerald-950/60 rounded-3xl border border-emerald-200 dark:border-emerald-800 text-center space-y-4 animate-fade-in">
        <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
        <h3 className="text-2xl font-extrabold text-emerald-900 dark:text-emerald-200">
          Projet Soumis avec Succès !
        </h3>
        <p className="text-sm text-emerald-700 dark:text-emerald-300 max-w-md mx-auto">
          Votre dossier est désormais enregistré sous le statut <strong className="underline">Soumis</strong>. La Commission Économie & Incubation AJPK étudiera votre projet et vous recontactera sous 5 jours ouvrés.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            window.location.href = '/projets';
          }}
          className="px-6 py-3 rounded-2xl bg-brand-600 text-white font-bold text-xs hover:bg-brand-700"
        >
          Voir tous les projets
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-850 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-lg space-y-6">
      
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Rocket className="w-6 h-6 text-brand-600" /> Formulaire de Dépôt de Projet
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Soumettez votre idée ou entreprise pour bénéficier de l’accompagnement et du réseau de financement AJPK.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Nom du projet *</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Ex: Unitée de Transformation d'Oignons Kelle"
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Catégorie *</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white"
          >
            <option value="Agriculture & Énergie">Agriculture & Énergie</option>
            <option value="Technologie & Artisanat">Technologie & Artisanat</option>
            <option value="Éducation & Inclusion Digital">Éducation & Inclusion Digital</option>
            <option value="Santé & Environnement">Santé & Environnement</option>
            <option value="Commerce & Services">Commerce & Services</option>
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Résumé Exécutif *</label>
        <textarea
          required
          rows={3}
          value={formData.summary}
          onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
          placeholder="Décrivez votre projet en 2 ou 3 phrases synthétiques..."
          className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Problème identifié *</label>
          <textarea
            required
            rows={3}
            value={formData.problem}
            onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
            placeholder="Quel problème local résolvez-vous à Kelle ?"
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Solution proposée *</label>
          <textarea
            required
            rows={3}
            value={formData.solution}
            onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
            placeholder="Quelle est votre réponse ou produit innovant ?"
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Budget Global Estimé (FCFA) *</label>
          <input
            type="number"
            required
            value={formData.budget_fcfa}
            onChange={(e) => setFormData({ ...formData, budget_fcfa: Number(e.target.value) })}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Financement Recherché (FCFA) *</label>
          <input
            type="number"
            required
            value={formData.funding_needed_fcfa}
            onChange={(e) => setFormData({ ...formData, funding_needed_fcfa: Number(e.target.value) })}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Besoins spécifiques & Équipements *</label>
        <textarea
          required
          rows={2}
          value={formData.needs_description}
          onChange={(e) => setFormData({ ...formData, needs_description: e.target.value })}
          placeholder="Ex: Panneaux solaires, motopompe, ordinateurs, mentorat juridique..."
          className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white"
        />
      </div>

      <button
        type="submit"
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-700 hover:to-emerald-600 text-white font-extrabold text-sm shadow-lg shadow-brand-600/30 transition"
      >
        Soumettre mon Projet à l’AJPK
      </button>

    </form>
  );
}
