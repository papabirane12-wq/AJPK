'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Profile } from '@/types';
import { CheckCircle2, AlertTriangle, Loader2, ShieldCheck, Lock } from 'lucide-react';
import { formatDateFr } from '@/lib/utils/formatters';

export default function VerificationPage() {
  const params = useParams();
  const rawNum = decodeURIComponent((params?.memberNumber as string) || '');
  const [member, setMember] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!rawNum) {
      setIsLoading(false);
      return;
    }

    fetch('/api/members')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.members)) {
          let decodedRaw = rawNum;
          try {
            if (typeof window !== 'undefined' && typeof window.atob === 'function') {
              const b64 = window.atob(rawNum);
              if (b64 && (b64.startsWith('AJPK') || b64.startsWith('usr-'))) {
                decodedRaw = b64;
              }
            }
          } catch {}

          const target = rawNum.toLowerCase();
          const targetDecoded = decodedRaw.toLowerCase();

          const found = data.members.find(
            (m: Profile) =>
              (m.id && m.id.toLowerCase() === target) ||
              (m.member_number && m.member_number.toLowerCase() === target) ||
              (m.id && m.id.toLowerCase() === targetDecoded) ||
              (m.member_number && m.member_number.toLowerCase() === targetDecoded)
          );
          setMember(found || null);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [rawNum]);

  return (
    <div className="max-w-xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-16">
      <div className="bg-white dark:bg-slate-850 p-4 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl space-y-5 sm:space-y-6 text-center">
        
        {isLoading ? (
          <div className="py-12 space-y-3">
            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-500">Vérification de la carte en cours auprès du registre officiel...</p>
          </div>
        ) : member ? (
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
            <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-left space-y-4">
              <div className="flex items-center gap-4">
                {member.avatar_url ? (
                  <img
                    src={member.avatar_url}
                    alt={member.first_name}
                    className="w-16 h-16 rounded-xl object-cover ring-2 ring-emerald-500"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-slate-800 text-emerald-400 font-bold text-lg flex items-center justify-center ring-2 ring-emerald-500">
                    {member.first_name?.[0] || ''}{member.last_name?.[0] || ''}
                  </div>
                )}
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {member.first_name} {member.last_name}
                  </h3>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Adhérent Validé & En Règle</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {member.member_number === 'AJPK-00011' || (member.first_name === 'Ibrahima' && member.last_name === 'Samb')
                      ? 'Développeur web'
                      : (member.profession || 'Membre AJPK')}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-slate-400 text-[10px] uppercase font-semibold">Commune</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200">Kelle, Sénégal</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] uppercase font-semibold">Date d’adhésion</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{formatDateFr(member.created_at)}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] uppercase font-semibold">Statut de la carte</p>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400">Certifiée active</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] uppercase font-semibold">Numéro d’adhérent</p>
                  <p className="font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-amber-500" />
                    <span>Confidentiel & Sécurisé</span>
                  </p>
                </div>
              </div>

              {/* Security info box */}
              <div className="p-3 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-xl border border-emerald-500/20 flex items-start gap-2.5 text-left">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong className="text-emerald-700 dark:text-emerald-400 font-semibold">Sécurité & Confidentialité :</strong> Pour protéger le compte de l&apos;adhérent, son numéro d&apos;adhésion privé servant à la connexion n&apos;est pas divulgué lors du scan public.
                </p>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 italic">
              Système de vérification officiel AJPK • Registre centralisé en direct
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
              Cette carte de membre ne figure pas dans notre registre officiel public ou a été révoquée.
            </p>
          </>
        )}

      </div>
    </div>
  );
}

