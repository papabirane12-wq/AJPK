'use client';

import { PartnerRequestForm } from '@/components/forms/PartnerRequestForm';
import { Handshake, Building2, CheckCircle, HeartHandshake, ShieldCheck } from 'lucide-react';

export default function PartenairesPage() {
  return (
    <div className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-extrabold text-brand-700 dark:text-emerald-300">
          <Handshake className="w-4 h-4 text-brand-600" />
          <span>Alliance & Coopération</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Devenir <span className="text-gradient-ajpk">Partenaire</span> de l’AJPK
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Entreprises, ONG, institutions publiques, centres de formation ou organisations de la diaspora : 
          unissons nos forces pour accélérer l’employabilité, la formation et le développement local de la jeunesse de Kelle.
        </p>
      </div>

      {/* Avantages / Engagements */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-emerald-400 shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Impact Direct</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Actions concrètes sur le terrain au profit des jeunes et des familles de Kelle.</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-gold-50 dark:bg-gold-950/40 text-gold-600 dark:text-gold-400 shrink-0">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Vivier de Talents</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Accès privilégié aux profils formés et motivés pour vos recrutements et stages.</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Cadre Officiel</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Convention de partenariat officielle et visibilité sur tous nos événements.</p>
          </div>
        </div>
      </div>

      {/* Formulaire Unique */}
      <div className="max-w-2xl mx-auto">
        <PartnerRequestForm />
      </div>
    </div>
  );
}
