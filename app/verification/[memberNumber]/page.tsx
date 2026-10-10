'use client';

import { useParams } from 'next/navigation';
import { getMembers } from '@/lib/data/store';
import { ShieldCheck, CheckCircle2, AlertTriangle, Building, Calendar } from 'lucide-react';
import { formatDateFr } from '@/lib/utils/formatters';

export default function VerificationPage() {
  const params = useParams();
  const rawNum = params.memberNumber as string;
  const members = getMembers();

  // Find member by number
  const member = members.find(m => m.member_number.toLowerCase() === rawNum.toLowerCase() || m.id === rawNum);

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      <div className="bg-white dark:bg-slate-850 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl space-y-6 text-center">
        
        {member ? (
          <>
            <div className="flex justify-center mb-2">
              <img
                src="/logo.png"
                alt="Logo AJPK"
                className="h-12 w-auto object-contain"
              />
            </div>

            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 mx-auto flex items-center justify-center border-4 border-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">
                CARTE AUTHENTIQUE & OFFICIELLE
              </span>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-3">
                Membre Officiel de l’AJPK
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                La carte ci-dessous appartient à un membre actif en règle de l’Association de la Jeunesse Polyvalente de Kelle.
              </p>
            </div>

            {/* Public details card */}
            <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-left space-y-3">
              <div className="flex items-center gap-4">
                <img
                  src={member.avatar_url}
                  alt={member.first_name}
                  className="w-16 h-16 rounded-xl object-cover ring-2 ring-emerald-500"
                />
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {member.first_name} {member.last_name}
                  </h3>
                  <p className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                    N° Adhérent : {member.member_number}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {member.profession || 'Membre AJPK'}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-slate-400 text-[10px] uppercase font-semibold">Commune</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200">Kelle, Sénégal</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] uppercase font-semibold">Date d’adhésion</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{formatDateFr(member.created_at)}</p>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 italic">
              Système de vérification cryptographique AJPK • Foyer des Jeunes de Kelle
            </p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 mx-auto flex items-center justify-center border-4 border-rose-500/20">
              <AlertTriangle className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Carte Non Reconnue
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Le numéro d’adhérent <code className="font-mono text-rose-600">{rawNum}</code> n’existe pas dans notre registre public ou a été révoqué.
            </p>
          </>
        )}

      </div>

    </div>
  );
}
