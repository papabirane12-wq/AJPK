'use client';

import { Settings, Database, Shield, Server, Bell, Globe } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase/client';

export default function AdminParametresPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Paramètres Plateforme AJPK</h1>
        <p className="text-xs text-slate-400 mt-1">Configuration de la base de données Supabase, clés d’API et sécurité.</p>
      </div>

      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <Database className="w-6 h-6 text-brand-400" />
            <div>
              <h3 className="font-extrabold text-white text-sm">Connexion Supabase PostgreSQL</h3>
              <p className="text-xs text-slate-400">Auth, Database, Storage & Row Level Security (RLS)</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            isSupabaseConfigured
              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
              : 'bg-amber-950 text-amber-300 border border-amber-800'
          }`}>
            {isSupabaseConfigured ? 'Supabase Connecté ✓' : 'Mode Démonstration & Local Fallback'}
          </span>
        </div>

        <div className="space-y-4 text-xs text-slate-300">
          <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700 space-y-2">
            <p className="font-bold text-white">Variables d’Environnement Requis (.env.local) :</p>
            <code className="block p-3 bg-slate-950 rounded-xl text-emerald-400 font-mono text-[11px] overflow-x-auto">
              NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co<br />
              NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anonyme-supabase
            </code>
          </div>

          <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700 space-y-2">
            <p className="font-bold text-white">Déploiement Vercel :</p>
            <p className="text-slate-400">
              Prêt pour un déploiement instantané sur Vercel avec Next.js 14 App Router, Server Components et PWA manifest.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
