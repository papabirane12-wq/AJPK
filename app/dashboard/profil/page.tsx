'use client';

import { getCurrentUser } from '@/lib/data/store';
import { User, Mail, Phone, MapPin, Briefcase, Calendar } from 'lucide-react';
import { formatDateFr } from '@/lib/utils/formatters';

export default function ProfilDashboardPage() {
  const user = getCurrentUser();

  if (!user) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3 max-w-md mx-auto my-12">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Connexion requise</h2>
        <p className="text-xs text-slate-500">Connectez-vous pour visualiser et gérer votre profil membre.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Mon Profil Membre
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Vos informations personnelles enregistrées dans l’annuaire de l’association.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-850 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center gap-6">
          <img
            src={user.avatar_url}
            alt={user.first_name}
            className="w-24 h-24 rounded-2xl object-cover ring-4 ring-brand-500/30"
          />
          <div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300">
              {user.role}
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {user.first_name} {user.last_name}
            </h2>
            <p className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
              {user.member_number}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div>
            <p className="text-slate-400 font-semibold">Email</p>
            <p className="font-bold text-slate-900 dark:text-white mt-0.5">{user.email}</p>
          </div>
          <div>
            <p className="text-slate-400 font-semibold">Téléphone</p>
            <p className="font-bold text-slate-900 dark:text-white mt-0.5">{user.phone}</p>
          </div>
          <div>
            <p className="text-slate-400 font-semibold">Adresse</p>
            <p className="font-bold text-slate-900 dark:text-white mt-0.5">{user.address}</p>
          </div>
          <div>
            <p className="text-slate-400 font-semibold">Profession</p>
            <p className="font-bold text-slate-900 dark:text-white mt-0.5">{user.profession}</p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs font-semibold text-slate-400">Bio & Présentation</p>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{user.bio}</p>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs font-semibold text-slate-400 mb-2">Compétences</p>
          <div className="flex flex-wrap gap-2">
            {user.skills.map((s, i) => (
              <span key={i} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
