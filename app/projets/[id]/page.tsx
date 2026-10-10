'use client';

import { useParams } from 'next/navigation';
import { getProjects } from '@/lib/data/store';
import { formatFCFA, getStatusBadgeColor } from '@/lib/utils/formatters';
import { Rocket, Target, Users, Mail, Phone, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ProjectDetailPage() {
  const params = useParams();
  const projects = getProjects();
  const project = projects.find(p => p.id === params.id) || projects[0];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      <Link href="/projets" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-600">
        <ArrowLeft className="w-4 h-4" /> Retour aux projets
      </Link>

      <div className="bg-white dark:bg-slate-850 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="relative h-80 w-full bg-slate-900">
          <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 text-slate-900 backdrop-blur shadow">
                {project.category}
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white mt-3 leading-tight">
                {project.title}
              </h1>
              <p className="text-xs text-slate-300 mt-1">Porteur : <strong>{project.author_name}</strong></p>
            </div>
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${getStatusBadgeColor(project.status)}`}>
              {project.status}
            </span>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <p className="text-slate-400 font-medium">Budget Global</p>
              <p className="text-xl font-black text-slate-900 dark:text-white mt-1">{formatFCFA(project.budget_fcfa)}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Financement Recherché</p>
              <p className="text-xl font-black text-amber-600 dark:text-amber-400 mt-1">{formatFCFA(project.funding_needed_fcfa)}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">1. Résumé du projet</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{project.summary}</p>
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">2. Problème identifié</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{project.problem}</p>
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">3. Solution apportée</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{project.solution}</p>
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">4. Besoins prioritaires</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{project.needs_description}</p>
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">5. Équipe & Porte-parole</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{project.team_members}</p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs text-slate-400">Contact direct du porteur</p>
              <div className="flex items-center gap-4 text-xs font-bold mt-1 text-slate-800 dark:text-slate-200">
                <a href={`mailto:${project.contact_email}`} className="hover:text-brand-600 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-brand-600" /> {project.contact_email}
                </a>
                <a href={`tel:${project.contact_phone}`} className="hover:text-brand-600 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-500" /> {project.contact_phone}
                </a>
              </div>
            </div>

            <a
              href={`mailto:${project.contact_email}?subject=Intérêt%20projet%20AJPK%20${encodeURIComponent(project.title)}`}
              className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition"
            >
              Financer ou Accompagner ce projet
            </a>
          </div>

        </div>
      </div>

    </div>
  );
}
