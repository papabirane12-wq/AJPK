'use client';

import Link from 'next/link';
import { 
  Users, 
  BookOpen, 
  Briefcase, 
  Rocket, 
  Award, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles,
  Calendar,
  CheckCircle2,
  HeartHandshake,
  TrendingUp,
  Search
} from 'lucide-react';
import { getMembers, getEvents, getFormations, getProjects, getOpportunities } from '@/lib/data/store';
import { mockEvents, mockFormations, mockProjects } from '@/lib/data/mockData';
import { EventCard } from '@/components/cards/EventCard';
import { FormationCard } from '@/components/cards/FormationCard';
import { ProjectCard } from '@/components/cards/ProjectCard';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function HomePage() {
  const [memberCount, setMemberCount] = useState<number>(0);
  const [formationsCount, setFormationsCount] = useState<number>(() => getFormations().length);
  const [opportunitiesCount, setOpportunitiesCount] = useState<number>(() => getOpportunities().length);
  const [projectsCount, setProjectsCount] = useState<number>(() => getProjects().length);

  useEffect(() => {
    // Récupérer le nombre de membres validés/actifs depuis la base de données
    async function fetchDatabaseCounts() {
      try {
        const res = await fetch('/api/members');
        const data = await res.json();
        if (data.success && typeof data.count === 'number') {
          setMemberCount(data.count);
        }
      } catch (e) {
        console.error('Erreur lecture compteurs membres:', e);
      }
    }

    fetchDatabaseCounts();
  }, []);

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 bg-gradient-to-b from-brand-50/70 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        
        {/* Glow Effects */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[650px] h-[380px] bg-gradient-to-tr from-brand-600/25 via-emerald-500/20 to-gold-500/25 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          


          {/* Slogan & Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] max-w-5xl mx-auto">
            Une jeunesse engagée, des compétences au service du <span className="text-gradient-ajpk">développement.</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Bienvenue sur le portail de l’<strong>Association de la Jeunesse Polyvalente de Kelle</strong>. Formations certifiantes, opportunités d’emploi, incubation de projets et réseau des talents locaux.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/inscription"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 via-emerald-600 to-gold-500 hover:from-brand-700 hover:via-emerald-700 hover:to-gold-600 text-white font-extrabold text-base shadow-xl shadow-brand-600/25 transition-all hover:scale-105"
            >
              Rejoindre l’Association
            </Link>
            <Link
              href="/formations"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-white font-extrabold text-base border border-slate-200 dark:border-slate-750 transition hover:border-gold-500/50"
            >
              Découvrir les Formations
            </Link>
          </div>

          {/* Quick Stats Counter Grid */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
              <p className="text-3xl sm:text-4xl font-black text-brand-600 dark:text-emerald-400">
                {memberCount}
              </p>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">Membres Actifs</p>
            </div>
            <div className="p-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
              <p className="text-3xl sm:text-4xl font-black text-amber-500">
                {formationsCount}
              </p>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">Formations Délivrées</p>
            </div>
            <div className="p-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
              <p className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400">
                {opportunitiesCount}
              </p>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">Opportunités Publiées</p>
            </div>
            <div className="p-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
              <p className="text-3xl sm:text-4xl font-black text-indigo-600 dark:text-indigo-400">
                {projectsCount}
              </p>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">Projets en Incubation</p>
            </div>
          </div>

        </div>
      </section>

      {/* 2. PRESENTATION & DOMAINES D'INTERVENTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-brand-600 dark:text-emerald-400">
            AJPK en action
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
            Nos piliers stratégiques pour la jeunesse
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
            L’Association de la Jeunesse Polyvalente de Kelle œuvre quotidiennement à travers quatre commissions d’action thématiques.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-850 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-300 flex items-center justify-center mb-6">
              <BookOpen className="w-7 h-7" />
            </div>
            <h4 className="text-xl font-bold text-slate-900 dark:text-white">Éducation & Numérique</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
              Tutorat scolaire gratuit, ateliers d’initiation au codage, compétences bureautiques et formations aux métiers digitaux d’avenir.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-850 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300 flex items-center justify-center mb-6">
              <Rocket className="w-7 h-7" />
            </div>
            <h4 className="text-xl font-bold text-slate-900 dark:text-white">Entrepreneuriat Jeunes</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
              Incubation de micro-projets ruraux, formation au business plan, recherche de financement auprès des banques et organismes partenaires.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-850 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mb-6">
              <TrendingUp className="w-7 h-7" />
            </div>
            <h4 className="text-xl font-bold text-slate-900 dark:text-white">Environnement & Solaire</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
              Campagnes Kelle Verte, reboisement fruiter, salubrité publique et promotion des énergies propres photovoltaïques.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-850 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 flex items-center justify-center mb-6">
              <HeartHandshake className="w-7 h-7" />
            </div>
            <h4 className="text-xl font-bold text-slate-900 dark:text-white">Culture, Sport & Santé</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
              Tournois inter-quartiers, festivals culturels, dons de sang communautaires et secourisme civique.
            </p>
          </div>
        </div>
      </section>

      {/* 3. PROCHAINS ÉVÉNEMENTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-brand-600 dark:text-emerald-400">
              Agenda Citoyen
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Prochains Événements AJPK
            </h3>
          </div>
          <Link
            href="/evenements"
            className="hidden sm:flex items-center gap-1 font-bold text-sm text-brand-600 dark:text-emerald-400 hover:underline"
          >
            Voir tout l’agenda <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      {/* 4. FORMATIONS CERTIFIANTES */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-widest">
                Montez en compétences
              </span>
              <h3 className="text-3xl sm:text-4xl font-extrabold mt-3">
                Formations & Attestations Numériques
              </h3>
              <p className="text-sm text-slate-400 mt-2 max-w-xl">
                Suivez des programmes pratiques encadrés par des experts et obtenez une attestation certifiée munie d’un QR Code unique.
              </p>
            </div>
            <Link
              href="/formations"
              className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm transition shrink-0 self-start md:self-auto"
            >
              Consulter le Catalogue Complet
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockFormations.map((formation) => (
              <FormationCard key={formation.id} formation={formation} />
            ))}
          </div>
        </div>
      </section>


      {/* 6. PROJETS DE LA JEUNESSE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-brand-600 dark:text-emerald-400">
              Incubateur Local
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Projets Portés par les Jeunes
            </h3>
          </div>
          <Link
            href="/projets"
            className="hidden sm:flex items-center gap-1 font-bold text-sm text-brand-600 dark:text-emerald-400 hover:underline"
          >
            Découvrir tous les projets <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockProjects.map((proj) => (
            <ProjectCard key={proj.id} project={proj} />
          ))}
        </div>
      </section>

      {/* 10. CALL TO ACTION FINAL */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-700 via-brand-600 to-gold-500 p-8 sm:p-12 text-white text-center shadow-2xl shadow-brand-700/20">
          <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Rejoignez la Jeunesse Polyvalente de Kelle dès aujourd’hui !
          </h3>
          <p className="mt-3 text-sm sm:text-base text-emerald-50 max-w-2xl mx-auto font-medium">
            Obtenez votre carte de membre numérique avec QR Code unique, accédez aux formations gratuites, postulez aux opportunités et portez des projets pour votre commune.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/inscription"
              className="px-8 py-4 rounded-2xl bg-white text-slate-900 hover:bg-gold-50 font-extrabold text-base shadow-xl transition-all hover:scale-105"
            >
              Adhérer à l’AJPK
            </Link>
            <Link
              href="/formations"
              className="px-8 py-4 rounded-2xl bg-black/20 hover:bg-black/30 text-white font-extrabold text-base border border-white/25 transition backdrop-blur-sm"
            >
              Voir les Formations
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
