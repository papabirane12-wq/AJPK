'use client';

import Link from 'next/link';
import { getProjects, getCurrentUser } from '@/lib/data/store';
import { ProjectCard } from '@/components/cards/ProjectCard';
import { PlusCircle } from 'lucide-react';

export default function MemberProjetsPage() {
  const user = getCurrentUser();
  const projects = getProjects();
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
