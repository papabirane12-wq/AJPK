'use client';

import { useState } from 'react';
import Link from 'next/link';
import { setCurrentUser } from '@/lib/data/store';
import { Profile } from '@/types';
import { LogIn, ShieldCheck, UserCheck, Loader2 } from 'lucide-react';

export default function ConnexionPage() {
  const [role, setRole] = useState<'member' | 'admin'>('member');
  const [memberNumber, setMemberNumber] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const cleanInput = memberNumber.trim();
      const upperInput = cleanInput.toUpperCase();
      const numOnly = cleanInput.replace(/[^0-9]/g, '');

      // Normalisation format AJPK-XXXXX
      let normalizedInput = upperInput;
      if (!upperInput.startsWith('AJPK-') && numOnly) {
        normalizedInput = `AJPK-${numOnly.padStart(5, '0')}`;
      }

      // 1. Interroger directement la base de données en direct via l'API
      const res = await fetch('/api/members');
      const data = await res.json();

      let membersList: Profile[] = [];
      if (data.success && Array.isArray(data.members)) {
        membersList = data.members;
      }

      // Recherche du membre par n° adhérent, par téléphone ou par email
      let found = membersList.find((m) => {
        const mNum = m.member_number?.toUpperCase() || '';
        const mPhone = (m.phone || '').replace(/[^0-9]/g, '');
        const mEmail = (m.email || '').toLowerCase();

        if (mNum === upperInput || mNum === normalizedInput) return true;
        if (numOnly && mNum.endsWith(numOnly.padStart(5, '0'))) return true;
        if (numOnly && mPhone && (mPhone === numOnly || mPhone.endsWith(numOnly))) return true;
        if (mEmail === cleanInput.toLowerCase()) return true;
        return false;
      });

      // Cas spécifique de secours pour l'administrateur Ibrahima Samb (AJPK-00011)
      if (!found && (upperInput === 'AJPK-00011' || upperInput === 'AJPK-11' || numOnly === '11' || cleanInput.toLowerCase().includes('ibrahima.samb'))) {
        found = {
          id: 'usr-admin-ibrahima-samb',
          email: 'ibrahima.samb@ajpk.sn',
          first_name: 'Ibrahima',
          last_name: 'Samb',
          member_number: 'AJPK-00011',
          phone: '+221 77 000 00 11',
          date_of_birth: '1998-10-10',
          sex: 'M',
          address: 'Kelle, Sénégal',
          profession: 'Développeur web',
          education_level: 'Licence Informatique & Développement Web',
          avatar_url: '',
          bio: 'Administrateur de la plateforme AJPK.',
          role: 'super_admin',
          status: 'actif',
          created_at: '2026-10-10T12:00:00Z',
          skills: ['Développement web', 'Next.js', 'React', 'TypeScript'],
          interest_domains: ['Technologie', 'Numérique', 'Jeunesse'],
        };
      }

      if (role === 'member') {
        if (found) {
          setCurrentUser(found);
          window.location.href = '/dashboard';
        } else {
          setError(`Numéro d’adhérent introuvable. Veuillez vérifier votre numéro unique (ex: AJPK-00001).`);
        }
      } else {
        // Espace Administration : Vérifier les droits admin ou super_admin
        if (found) {
          if (found.role === 'admin' || found.role === 'super_admin' || found.member_number === 'AJPK-00011') {
            setCurrentUser(found);
            window.location.href = '/admin';
          } else {
            setError(`Le membre ${found.first_name} ${found.last_name} (${found.member_number}) n'a pas les droits d'administration.`);
          }
        } else {
          setError(`Numéro adhérent administrateur introuvable.`);
        }
      }
    } catch (err) {
      console.error(err);
      setError('Erreur de connexion à la base de données. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-white dark:bg-slate-850 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
        
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-amber-500 text-white mx-auto flex items-center justify-center font-extrabold text-lg shadow-md mb-3">
            AJPK
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {role === 'member' ? 'Espace Membre AJPK' : 'Espace Administration AJPK'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {role === 'member'
              ? 'Connectez-vous à l’aide de votre numéro d’adhérent unique'
              : 'Accès réservé aux administrateurs via leur numéro d’adhérent'}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-600 dark:text-rose-400 text-xs font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Type d’accès</label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <button
                type="button"
                onClick={() => { setRole('member'); setError(''); setMemberNumber(''); }}
                className={`py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  role === 'member'
                    ? 'bg-white dark:bg-slate-900 text-brand-700 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" /> Espace Membre
              </button>
              <button
                type="button"
                onClick={() => { setRole('admin'); setError(''); setMemberNumber(''); }}
                className={`py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  role === 'admin'
                    ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Espace Admin
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>{role === 'member' ? 'Numéro Adhérent Unique *' : 'Numéro Adhérent Administrateur *'}</span>
              <span className="text-[10px] text-brand-600 dark:text-emerald-400 font-mono font-bold">
                {role === 'admin' ? 'Ex: AJPK-00011' : 'Format: AJPK-XXXXX'}
              </span>
            </label>
            <input
              type="text"
              required
              disabled={isLoading}
              placeholder={role === 'admin' ? 'AJPK-00011' : 'AJPK-00001'}
              value={memberNumber}
              onChange={(e) => setMemberNumber(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-700 hover:to-emerald-600 text-white font-extrabold text-xs shadow-lg shadow-brand-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Vérification en base de données...
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" /> Accéder à mon Espace
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500">
          Pas encore membre ?{' '}
          <Link href="/inscription" className="font-bold text-brand-600 dark:text-emerald-400 hover:underline">
            Adhérer & Obtenir ma Carte 
          </Link>
        </div>

      </div>
    </div>
  );
}
