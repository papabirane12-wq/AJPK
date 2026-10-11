import { mockCommissions } from '@/lib/data/mockData';
import { Target, Eye, Shield, Users, Award, Heart, CheckCircle2 } from 'lucide-react';

export default function AProposPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300">
          Notre Identité
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mt-3">
          À propos de l’AJPK
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 mt-4 leading-relaxed">
          L’<strong>Association de la Jeunesse Polyvalente de Kelle (AJPK)</strong> est une organisation citoyenne à but non lucratif fédérant les jeunes de la commune de Kelle au Sénégal pour promouvoir l’éducation, la formation professionnelle, l’entrepreneuriat et le développement local durable.
        </p>
      </div>

      {/* Vision & Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-slate-850 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-emerald-400 flex items-center justify-center mb-6">
            <Eye className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Notre Vision</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
            Faire de Yene une commune pilote où chaque jeune est autonome, formé aux compétences du XXIe siècle et acteur direct de la prospérité économique et sociale de son terroir.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-850 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-6">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Notre Mission</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
            Offrir un cadre structuré de formation, de mentorat, de recherche d’opportunités d’emploi et d’incubation de projets pour éradiquer l’enclavement et le chômage des jeunes.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-850 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Nos Valeurs</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
            Engagement citoyen, Rigueur & Transparence, Inclusivité, Esprit d’innovation, Solidarité communautaire et Patriotisme local.
          </p>
        </div>
      </div>

      {/* Commissions Section */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Nos Commissions de Travail
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Des pôles opérationnels animés par des responsables compétents pour exécuter la feuille de route de l’association.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockCommissions.map((comm) => (
            <div key={comm.id} className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 flex items-start gap-4">
              <div className="p-3 bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-300 rounded-2xl shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">{comm.name}</h4>
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">Responsable : {comm.lead_name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{comm.description}</p>
                <span className="inline-block mt-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {comm.members_count} membres actifs
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bureau Exécutif */}
      <div className="bg-slate-900 text-white p-10 rounded-3xl">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl font-extrabold">Le Bureau Exécutif AJPK</h2>
          <p className="text-xs text-slate-400 mt-2">Élu pour coordonner les actions au service de la jeunesse de Kelle.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-slate-800 p-6 rounded-2xl text-center space-y-2">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400" alt="Président" className="w-20 h-20 rounded-full mx-auto object-cover ring-2 ring-emerald-400" />
            <h4 className="font-extrabold text-base">Moussa Diop</h4>
            <p className="text-xs text-emerald-400 font-bold">Président Exécutif</p>
            <p className="text-[11px] text-slate-400">Ingénieur Logiciel & Entrepreneur</p>
          </div>

          <div className="bg-slate-800 p-6 rounded-2xl text-center space-y-2">
            <img src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400" alt="Secrétaire" className="w-20 h-20 rounded-full mx-auto object-cover ring-2 ring-emerald-400" />
            <h4 className="font-extrabold text-base">Aminata Ndiaye</h4>
            <p className="text-xs text-emerald-400 font-bold">Vice-Présidente & Comm. Formation</p>
            <p className="text-[11px] text-slate-400">Experte Marketing & Projet</p>
          </div>

          <div className="bg-slate-800 p-6 rounded-2xl text-center space-y-2">
            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400" alt="Trésorière" className="w-20 h-20 rounded-full mx-auto object-cover ring-2 ring-emerald-400" />
            <h4 className="font-extrabold text-base">Fatou Sow</h4>
            <p className="text-xs text-emerald-400 font-bold">Trésorière Générale</p>
            <p className="text-[11px] text-slate-400">Comptable & Finance Solidaire</p>
          </div>
        </div>
      </div>

    </div>
  );
}
