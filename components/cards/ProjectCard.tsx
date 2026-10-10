'use client';

import Link from 'next/link';
import { YouthProject } from '@/types';
import { formatFCFA, getStatusBadgeColor } from '@/lib/utils/formatters';
import { Rocket, Target, Users, ArrowRight } from 'lucide-react';

interface ProjectCardProps {
  project: YouthProject;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="group bg-white dark:bg-slate-850 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
        <img
          src={project.image_url}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-white backdrop-blur shadow">
            {project.category}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadgeColor(project.status)}`}>
            {project.status}
          </span>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
            {project.title}
          </h3>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">
            Porteur : <span className="text-slate-800 dark:text-slate-200">{project.author_name}</span>
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
            {project.summary}
          </p>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-400 font-medium">Budget global :</span>
            <span className="font-extrabold text-slate-900 dark:text-white">{formatFCFA(project.budget_fcfa)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 font-medium">Financement recherché :</span>
            <span className="font-extrabold text-amber-600 dark:text-amber-400">{formatFCFA(project.funding_needed_fcfa)}</span>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <Link
            href={`/projets/${project.id}`}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition"
          >
            Découvrir le projet <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
