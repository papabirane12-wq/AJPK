'use client';

import { getCurrentUser, getCertificates } from '@/lib/data/store';
import { CertificateDigital } from '@/components/cards/CertificateDigital';
import { Award } from 'lucide-react';

export default function AttestationsDashboardPage() {
  const user = getCurrentUser();
  const certs = getCertificates();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Mes Attestations Numériques
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Visualisez et téléchargez vos diplômes et certificats officiels délivrés par l’AJPK.
        </p>
      </div>

      {certs.map((cert) => (
        <CertificateDigital key={cert.id} certificate={cert} />
      ))}
    </div>
  );
}
