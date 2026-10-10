'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getMembers, setCurrentUser } from '@/lib/data/store';
import { LogIn, ShieldCheck, KeyRound } from 'lucide-react';

export default function ConnexionPage() {
  const [email, setEmail] = useState('moussa.diop@ajpk.sn');
  const [password, setPassword] = useState('pass123');
  const [role, setRole] = useState<'member' | 'admin'>('admin');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const members = getMembers();
    const targetRole = role === 'admin' ? ['admin', 'super_admin'] : ['member', 'trainer', 'partner'];
    const found = members.find(m => m.email.toLowerCase() === email.toLowerCase() || targetRole.includes(m.role));

    if (found) {
      setCurrentUser(found);
      if (found.role === 'admin' || found.role === 'super_admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/dashboard';
      }
    } else {
      setError('Identifiants incorrects ou rôle non autorisé.');
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
            Connexion à l’Ecosystème
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Connectez-vous à votre Espace Membre ou Espace Administration
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-600 text-xs font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Type de Compte</label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <button
                type="button"
                onClick={() => { setRole('member'); setEmail('ousmane.fall@ajpk.sn'); }}
                className={`py-2 rounded-lg text-xs font-bold transition ${
                  role === 'member'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                Espace Membre
              </button>
              <button
                type="button"
                onClick={() => { setRole('admin'); setEmail('moussa.diop@ajpk.sn'); }}
                className={`py-2 rounded-lg text-xs font-bold transition ${
                  role === 'admin'
                    ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                Dashboard Admin
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Adresse Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Mot de passe</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-700 hover:to-emerald-600 text-white font-extrabold text-xs shadow-lg shadow-brand-600/30 transition flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" /> Se Connecter
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500">
          Pas encore inscrit ?{' '}
          <Link href="/inscription" className="font-bold text-brand-600 dark:text-emerald-400 hover:underline">
            Adhérer à l’AJPK
          </Link>
        </div>

      </div>

    </div>
  );
}
