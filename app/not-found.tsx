import Link from 'next/link';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto my-20 p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-4">
      <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center border-4 border-amber-500/20">
        <FileQuestion className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-black text-slate-900 dark:text-white">Page Non Trouvée (404)</h1>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        La page que vous recherchez n’existe pas ou a été déplacée.
      </p>
      <div className="pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-600 text-white font-extrabold text-xs shadow-lg hover:bg-brand-700"
        >
          <ArrowLeft className="w-4 h-4" /> Retour à l’Accueil AJPK
        </Link>
      </div>
    </div>
  );
}
