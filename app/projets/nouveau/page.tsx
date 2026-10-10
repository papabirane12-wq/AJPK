'use client';

import Link from 'next/link';
import { ProjectSubmissionForm } from '@/components/forms/ProjectSubmissionForm';
import { ArrowLeft } from 'lucide-react';

export default function NouveauProjetPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <Link href="/projets" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-600">
        <ArrowLeft className="w-4 h-4" /> Retour aux projets
      </Link>

      <ProjectSubmissionForm />
    </div>
  );
}
