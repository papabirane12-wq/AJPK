'use client';

import { useState } from 'react';
import { addMember, setCurrentUser } from '@/lib/data/store';
import { Profile } from '@/types';
import { MemberCardDigital } from '@/components/cards/MemberCardDigital';
import { PhoneInput } from '@/components/ui/PhoneInput';
import { UserPlus, CheckCircle2, ShieldCheck } from 'lucide-react';

export function InscriptionForm() {
  const [createdMember, setCreatedMember] = useState<Profile | null>(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
    const autoEmail = `${formData.first_name.toLowerCase().replace(/\s+/g, '')}.${formData.last_name.toLowerCase().replace(/\s+/g, '') || cleanPhone}@ajpk.sn`;

    const member = addMember({
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: autoEmail,
      phone: formData.phone,
      address: formData.address || 'Commune de Kelle',
      profession: 'Membre AJPK',
      date_of_birth: '',
      sex: 'M',
      education_level: '',
      bio: '',
      skills: [],
      interest_domains: [],
    });

    setCurrentUser(member);
    setCreatedMember(member);
  };

  if (createdMember) {
    return (
      <div className="space-y-6 text-center animate-fade-in">
        <div className="p-6 bg-emerald-50 dark:bg-emerald-950/60 rounded-3xl border border-emerald-200 dark:border-emerald-800">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
          <h2 className="text-2xl font-extrabold text-emerald-900 dark:text-emerald-200 mt-2">
            Félicitations {createdMember.first_name} ! Adhésion Réussie
          </h2>
          <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
            Votre numéro unique d’adhérent est <strong className="font-mono font-black text-amber-600">{createdMember.member_number}</strong>. Votre carte de membre numérique est générée ci-dessous :
          </p>
        </div>

        <MemberCardDigital member={createdMember} />

        <div className="pt-4">
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="px-8 py-3.5 rounded-2xl bg-brand-600 text-white font-extrabold text-sm hover:bg-brand-700 shadow-lg"
          >
            Accéder à mon Espace Membre / Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-850 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <UserPlus className="w-6 h-6 text-brand-600" /> Formulaire d’Adhésion Officiel AJPK
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Remplissez vos informations pour générer votre numéro de membre AJPK-XXXXX et votre carte QR Code.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Prénom *</label>
          <input
            type="text"
            required
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            placeholder="Ex: Babacar"
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Nom *</label>
          <input
            type="text"
            required
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            placeholder="Ex: Ndiaye"
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        <PhoneInput
          value={formData.phone}
          onChange={(fullNumber) => setFormData({ ...formData, phone: fullNumber })}
          required
        />

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Adresse *</label>
          <input
            type="text"
            required
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Kelle"
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-700 hover:to-emerald-600 text-white font-extrabold text-sm shadow-xl shadow-brand-600/30 transition"
      >
        Valider mon Adhésion & Générer ma Carte Membre
      </button>
    </form>
  );
}
