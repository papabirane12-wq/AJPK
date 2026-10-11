'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getMembers, setCurrentUser } from '@/lib/data/store';
import { LogIn, ShieldCheck, UserCheck } from 'lucide-react';

export default function ConnexionPage() {
  const [role, setRole] = useState<'member' | 'admin'>('member');
  const [memberNumber, setMemberNumber] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const members = getMembers();

    const cleanInput = memberNumber.trim().toUpperCase();
    const normalizedInput = cleanInput.startsWith('AJPK-') ? cleanInput : `AJPK-${cleanInput.padStart(5, '0')}`;
    
    const found = members.find(m => 
      m.member_number.toUpperCase() === cleanInput || 
      m.member_number.toUpperCase() === normalizedInput
    );

    if (role === 'member') {
      if (found) {
        setCurrentUser(found);
        window.location.href = '/dashboard';
      } else {
        setError(`Numéro d’adhérent introuvable. Veuillez vérifier votre numéro unique.`);
      }
    } else {
      // Espace Administration : Vérifier que le numéro adhérent correspond à un admin ou super_admin
      if (found) {
        if (found.role === 'admin' || found.role === 'super_admin') {
          setCurrentUser(found);
          window.location.href = '/admin';
        } else {
          setError(`Le membre ${found.first_name} ${found.last_name} (${found.member_number}) n'a pas les droits d'administration.`);
        }
      } else {
        setError(`Numéro adhérent administrateur introuvable.`);
      }
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
              <span className="text-[10px] text-brand-600 dark:text-emerald-400 font-mono font-bold">Format: AJPK-XXXXX</span>
            </label>
            <input
              type="text"
              required
              value={memberNumber}
              onChange={(e) => setMemberNumber(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <p className="text-[11px] text-slate-400">
              {role === 'member'
                ? 'Saisissez le numéro unique inscrit sur votre carte officielle (ex: AJPK-00011).'
                : 'Saisissez votre numéro d’adhérent administrateur (ex: AJPK-00011).'}
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-700 hover:to-emerald-600 text-white font-extrabold text-xs shadow-lg shadow-brand-600/30 transition flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" /> Accéder à mon Espace
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500">
          Pas encore membre ?{' '}
          <Link href="/inscription" className="font-bold text-brand-600 dark:text-emerald-400 hover:underline">
            Adhérer & Obtenir ma Carte (1 050 FCFA)
          </Link>
        </div>

      </div>

    </div>
  );
}
