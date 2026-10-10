'use client';

import { getCurrentUser, getEvents, getFormations, getProjects, getCertificates, getCotisations } from '@/lib/data/store';
import { StatCard } from '@/components/ui/StatCard';
import { MemberCardDigital } from '@/components/cards/MemberCardDigital';
import { Calendar, BookOpen, Bookmark, Rocket, Award, CreditCard, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function MemberDashboardOverviewPage() {
  const user = getCurrentUser();
  const events = getEvents();
  const formations = getFormations();
  const projects = getProjects();
  const certs = getCertificates();
  const cots = getCotisations();

  if (!user) {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 max-w-lg mx-auto my-12 shadow-xl">
        <div className="w-16 h-16 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Connexion requise</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Veuillez vous connecter avec vos identifiants pour accéder à votre espace membre.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link
            href="/connexion"
            className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition"
          >
            Se Connecter
          </Link>
          <Link
            href="/inscription"
            className="px-6 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs transition"
          >
            Créer un compte
          </Link>
        </div>
      </div>
    );
  }

  const userProjects = projects.filter(p => p.author_id === user.id || p.author_name.includes(user.last_name));
  const userCerts = certs.filter(c => c.member_id === user.id || c.member_name.includes(user.last_name));
  const userCots = cots.filter(c => c.member_id === user.id || c.member_name.includes(user.last_name));

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Welcome banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-brand-900 via-slate-900 to-brand-950 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Espace Membre AJPK
          </span>
          <h1 className="text-3xl font-extrabold mt-2">
            Bienvenue, {user.first_name} {user.last_name} !
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            N° Adhérent : <span className="font-mono font-bold text-amber-400">{user.member_number}</span> • Rôle : <span className="uppercase font-bold">{user.role}</span>
          </p>
        </div>
        <Link
          href="/dashboard/carte"
          className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs shadow-lg transition shrink-0 flex items-center gap-2"
        >
          <CreditCard className="w-4 h-4" /> Voir Ma Carte Membre
        </Link>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Événements Inscrit"
          value={1}
          subtitle="Prochain : Forum Jeunesse 2026"
          icon={<Calendar className="w-6 h-6" />}
        />
        <StatCard
          title="Formations Suivies"
          value={1}
          subtitle="Développement Web & Code"
          icon={<BookOpen className="w-6 h-6" />}
        />
        <StatCard
          title="Projets Déposés"
          value={userProjects.length}
          subtitle="Status : En accompagnement"
          icon={<Rocket className="w-6 h-6" />}
        />
        <StatCard
          title="Attestations Obtenues"
          value={userCerts.length}
          subtitle="QR Code Vérifié"
          icon={<Award className="w-6 h-6" />}
        />
      </div>

      {/* Main Grid: Card preview + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Digital Card Preview */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" /> Aperçu Carte Officielle
          </h3>
          <MemberCardDigital member={user} showActions={false} />
        </div>

        {/* Cotisations & Projects Summary */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Cotisation status */}
          <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Statut des Cotisations Membre</h3>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                1 000 FCFA / mois
              </span>
            </div>

            <div className="space-y-2">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Cotisation Octobre 2026</p>
                  <p className="text-[10px] text-slate-400">Paiement via Wave Sénégal</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Payé ✓
                </span>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/dashboard/formations"
              className="p-5 bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-md transition text-left space-y-1"
            >
              <BookOpen className="w-6 h-6 text-brand-600 mb-2" />
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Mes Formations</h4>
              <p className="text-xs text-slate-400">Accéder aux cours et ressources</p>
            </Link>

            <Link
              href="/dashboard/projets"
              className="p-5 bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-md transition text-left space-y-1"
            >
              <Rocket className="w-6 h-6 text-amber-500 mb-2" />
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Mes Projets</h4>
              <p className="text-xs text-slate-400">Suivre l’étude de mon dossier</p>
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
