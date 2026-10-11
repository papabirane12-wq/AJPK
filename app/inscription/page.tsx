import { InscriptionForm } from '@/components/forms/InscriptionForm';

export default function InscriptionPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center">
        <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300">
          Adhésion Officielle
        </span>
       
       
      </div>

      <InscriptionForm />
    </div>
  );
}
