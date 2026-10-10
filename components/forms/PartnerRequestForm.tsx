'use client';

import { useState } from 'react';
import { Handshake, CheckCircle2 } from 'lucide-react';
import { addPartner } from '@/lib/data/store';

export function PartnerRequestForm() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Entreprise' as const,
    contact_name: '',
    email: '',
    phone: '',
    sector: '',
    website: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPartner({
      name: formData.name,
      type: formData.type,
      sector: formData.sector || 'Partenaire Réseau',
      description: formData.message || 'Demande de partenariat officielle soumise.',
      website: formData.website,
      email: formData.email,
      phone: formData.phone,
      logo_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=300'
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-8 bg-emerald-50 dark:bg-emerald-950/60 rounded-3xl border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
        <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto" />
        <h3 className="text-xl font-extrabold text-emerald-900 dark:text-emerald-200">Demande de Partenariat Transmise !</h3>
        <p className="text-xs text-emerald-700 dark:text-emerald-300">
          Nous vous remercions pour votre intérêt. Notre bureau de développement prendra contact avec votre organisation sous 48h.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-850 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-md space-y-4">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Handshake className="w-5 h-5 text-brand-600" /> Formulaire « Devenir Partenaire »
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Entreprises, ONG, Institutions et Écoles : soutenez les programmes d’insertion et de formation de l’AJPK.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Nom de l’Organisation *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ex: Fondation Solaire Sénégal"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Type de Partenaire *</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
          >
            <option value="Entreprise">Entreprise Privée</option>
            <option value="ONG">ONG / Fondation</option>
            <option value="Institution">Institution Publique</option>
            <option value="Association">Association</option>
            <option value="Sponsor">Sponsor / Mécène</option>
            <option value="École/Centre">École / Centre de Formation</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Nom du Contact *</label>
          <input
            type="text"
            required
            value={formData.contact_name}
            onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
            placeholder="Mme/M. ..."
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Professionnel *</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="contact@partenaire.com"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Message / Domaine de Partenariat *</label>
        <textarea
          required
          rows={3}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Précisez votre offre de partenariat (Financement, Offres de stage, Don de matériel, Formations...)"
          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
        />
      </div>

      <button
        type="submit"
        className="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-md transition"
      >
        Soumettre la demande de partenariat
      </button>
    </form>
  );
}
