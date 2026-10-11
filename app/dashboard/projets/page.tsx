'use client';

import Link from 'next/link';
import { getProjects, getCurrentUser } from '@/lib/data/store';
import { ProjectCard } from '@/components/cards/ProjectCard';
import { PlusCircle } from 'lucide-react';

export default function MemberProjetsPage() {
  const user = getCurrentUser();
  const projects = getProjects();

  if (!user) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3 max-w-md mx-auto my-12">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Connexion requise</h2>
        <p className="text-xs text-slate-500">Connectez-vous pour visualiser et déposer vos projets.</p>
      </div>
    );
  }

  const userProjects = projects.filter(p => p.author_id === user.id || p.author_name.includes(user.last_name));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Mes Projets Déposés</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Suivez l’avancement et le statut de vos projets d’entreprise.</p>
        </div>

        <Link
          href="/projets/nouveau"
          className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" /> Soumettre un Projet
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {userProjects.map((proj) => (
          <ProjectCard key={proj.id} project={proj} />
        ))}
      </div>
    </div>
  );
}
