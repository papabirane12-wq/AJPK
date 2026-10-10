'use client';

import { useParams } from 'next/navigation';
import { getFormations, registerForFormation, isRegisteredForFormation } from '@/lib/data/store';
import { formatDateFr, formatFCFA } from '@/lib/utils/formatters';
import { BookOpen, UserCheck, Calendar, Award, CheckCircle2, ArrowLeft, Shield } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function FormationDetailPage() {
  const params = useParams();
  const formations = getFormations();
  const formation = formations.find(f => f.id === params.id) || formations[0];

  const [registered, setRegistered] = useState(isRegisteredForFormation(formation.id));

  const handleRegister = () => {
    if (!registered) {
      registerForFormation(formation.id, 'usr-1');
      setRegistered(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      <Link href="/formations" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-600">
        <ArrowLeft className="w-4 h-4" /> Retour au catalogue
      </Link>

      <div className="bg-white dark:bg-slate-850 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="relative h-80 w-full bg-slate-900">
          <img src={formation.image_url} alt={formation.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-400 text-slate-950 shadow">
              {formation.price_fcfa === 0 ? 'Gratuit (Subventionné)' : formatFCFA(formation.price_fcfa)}
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white mt-3 leading-tight">
              {formation.title}
            </h1>
          </div>
        </div>

        <div className="p-8 space-y-8">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <p className="text-slate-400 font-medium">Formateur Lead</p>
              <p className="font-extrabold text-slate-900 dark:text-white mt-0.5">{formation.instructor}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Durée</p>
              <p className="font-extrabold text-brand-600 dark:text-emerald-400 mt-0.5">{formation.duration}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Niveau requis</p>
              <p className="font-extrabold text-slate-900 dark:text-white mt-0.5">{formation.level}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Date de début</p>
              <p className="font-extrabold text-amber-600 dark:text-amber-400 mt-0.5">{formatDateFr(formation.start_date)}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Objectifs & Description</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
              {formation.description}
            </p>
          </div>

          {formation.syllabus && (
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-4">Programme / Syllabus</h3>
              <div className="space-y-3">
                {formation.syllabus.map((module, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Module {idx + 1} : {module}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-6 bg-gradient-to-br from-brand-950 to-slate-900 text-white rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-amber-400 shrink-0" />
              <div>
                <h4 className="font-extrabold text-sm">Attestation Numérique Incluse</h4>
                <p className="text-xs text-slate-400">Délivrée avec QR Code de vérification à la validation de la formation.</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={handleRegister}
              disabled={registered}
              className={`w-full py-4 rounded-2xl font-extrabold text-sm shadow-xl transition ${
                registered
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-700 hover:to-emerald-600 text-white'
              }`}
            >
              {registered ? 'Inscription enregistrée à la formation ✓' : 'M’inscrire dès maintenant'}
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
