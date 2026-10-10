'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-rose-950 text-rose-500 mx-auto flex items-center justify-center border border-rose-800">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold">Erreur Globale de la Plateforme</h2>
          <p className="text-xs text-slate-400">
            Une erreur critique est survenue dans l’application Next.js.
          </p>
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs inline-flex items-center gap-2 shadow"
          >
            <RefreshCw className="w-4 h-4" /> Réinitialiser
          </button>
        </div>
      </body>
    </html>
  );
}
