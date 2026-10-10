'use client';

import Link from 'next/link';
import { Formation } from '@/types';
import { formatDateFr, formatFCFA, getStatusBadgeColor } from '@/lib/utils/formatters';
import { BookOpen, UserCheck, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';
import { registerForFormation, isRegisteredForFormation } from '@/lib/data/store';
import { useState } from 'react';

interface FormationCardProps {
  formation: Formation;
}

export function FormationCard({ formation }: FormationCardProps) {
  const [registered, setRegistered] = useState(isRegisteredForFormation(formation.id));
  const [count, setCount] = useState(formation.registered_count);

  const handleRegister = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!registered) {
      registerForFormation(formation.id, 'usr-1');
      setRegistered(true);
      setCount(prev => prev + 1);
    }
  };

  return (
    <div className="group bg-white dark:bg-slate-850 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      
      {/* Thumbnail */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
        <img
          src={formation.image_url}
          alt={formation.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
        
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 shadow">
            {formation.price_fcfa === 0 ? 'Gratuit (Subventionné)' : formatFCFA(formation.price_fcfa)}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadgeColor(formation.status)}`}>
            {formation.status === 'ouvert' ? 'Inscriptions Ouvertes' : formation.status}
          </span>
        </div>

        <div className="absolute bottom-4 left-4 text-white text-xs font-semibold">
          <span className="flex items-center gap-1 bg-slate-900/80 px-2.5 py-1 rounded-lg backdrop-blur">
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> {formation.duration}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
            {formation.title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
            {formation.description}
          </p>
        </div>

        <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
          <p className="flex items-center gap-1.5 font-medium">
            <UserCheck className="w-4 h-4 text-brand-600 shrink-0" />
            <span>Formateur : <strong className="text-slate-900 dark:text-white">{formation.instructor}</strong></span>
          </p>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-amber-500" /> Début: {formatDateFr(formation.start_date)}
            </span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {count} / {formation.max_spots} places
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-2 flex items-center justify-between gap-2">
          <Link
            href={`/formations/${formation.id}`}
            className="text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-emerald-400 flex items-center gap-1"
          >
            Programme <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleRegister}
            disabled={registered}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
              registered
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-gradient-to-r from-brand-600 to-emerald-500 text-white hover:opacity-90'
            }`}
          >
            {registered ? 'S’inscrire ✓' : 'S’inscrire à la formation'}
          </button>
        </div>

      </div>

    </div>
  );
}
