import { InscriptionForm } from '@/components/forms/InscriptionForm';

export default function InscriptionPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center">
        <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300">
          Adhésion Officielle
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
          Devenir Membre de l’AJPK
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          Frais d’adhésion officielle & délivrance de la carte numérique : <strong className="text-emerald-600 dark:text-emerald-400 font-extrabold">1 050 FCFA</strong> (payable via Wave ou Orange Money).
        </p>
      </div>

      <InscriptionForm />
    </div>
  );
}
