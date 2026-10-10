'use client';

import Link from 'next/link';
import { getProjects } from '@/lib/data/store';
import { ProjectCard } from '@/components/cards/ProjectCard';
import { Rocket, PlusCircle } from 'lucide-react';

export default function ProjetsPage() {
  const projects = getProjects();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-gradient-to-r from-brand-900 to-slate-900 p-8 rounded-3xl text-white">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Incubateur & Innovation
          </span>
          <h1 className="text-3xl font-extrabold mt-2">Projets de la Jeunesse de Kelle</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Découvrez les initiatives innovantes portées par les membres et soumettez votre propre projet pour obtenir l’accompagnement de l’AJPK.
          </p>
        </div>
        <Link
          href="/projets/nouveau"
          className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs shadow-lg transition shrink-0 flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" /> Soumettre un Projet
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

    </div>
  );
}
