'use client';

import { Certificate } from '@/types';
import { QRCodeView } from '@/components/ui/QRCodeView';
import { formatDateFr } from '@/lib/utils/formatters';
import { Award, Download, CheckCircle2, Shield } from 'lucide-react';

interface CertificateDigitalProps {
  certificate: Certificate;
}

export function CertificateDigital({ certificate }: CertificateDigitalProps) {
  const verifyUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/verification/cert-${certificate.certificate_number}`
    : `https://ajpk.sn/verification/cert-${certificate.certificate_number}`;

  return (
    <div className="max-w-3xl mx-auto my-6">
      {/* Certificate Container */}
      <div className="relative bg-white text-slate-900 p-8 md:p-12 rounded-3xl shadow-2xl border-8 border-emerald-700/20 font-serif">
        
        {/* Decorative Inner Border */}
        <div className="border-2 border-emerald-600/40 p-6 md:p-8 rounded-2xl relative">
          
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-amber-500 text-white shadow-lg mb-2">
              <Award className="w-10 h-10" />
            </div>
            
            <h4 className="text-xs font-sans uppercase font-extrabold tracking-widest text-slate-500">
              RÉPUBLIQUE DU SÉNÉGAL • COMMUNE DE KELLE
            </h4>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-emerald-900 uppercase">
              Association de la Jeunesse Polyvalente de Kelle
            </h2>
            <p className="text-xs font-sans font-bold text-amber-600 uppercase tracking-widest">
              Commission Éducation & Formation Professionnelle
            </p>
          </div>

          <div className="my-8 text-center space-y-4 font-sans">
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
              ATTESTATION NATIONALE DE FORMATION NUMÉRIQUE
            </p>
            
            <p className="text-base text-slate-700">
              Le Bureau Exécutif certifie par la présente que :
            </p>

            <h3 className="text-2xl md:text-3xl font-extrabold text-brand-900 underline decoration-amber-400 decoration-4 underline-offset-8 py-2">
              {certificate.member_name}
            </h3>

            <p className="text-sm text-slate-700 max-w-xl mx-auto leading-relaxed">
              a suivi et réussi avec succès l’intégralité du programme de formation certifiant intitulé :
            </p>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 max-w-xl mx-auto">
              <p className="text-lg font-extrabold text-emerald-900">
                « {certificate.formation_title} »
              </p>
            </div>

            <p className="text-xs text-slate-500">
              Délivré le <span className="font-bold text-slate-800">{formatDateFr(certificate.issue_date)}</span> à Kelle.
            </p>
          </div>

          {/* Footer & QR Code */}
          <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 font-sans">
            <div className="flex items-center gap-3">
              <QRCodeView value={verifyUrl} size={70} />
              <div className="text-left text-xs">
                <p className="font-mono font-bold text-slate-900">{certificate.certificate_number}</p>
                <p className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Document Officiel Vérifié
                </p>
              </div>
            </div>

            <div className="text-center md:text-right">
              <div className="inline-block border-b-2 border-slate-900 pb-1 mb-1 font-semibold text-slate-800 text-xs">
                {certificate.signatory}
              </div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Cachet & Signature Électronique AJPK</p>
            </div>
          </div>

        </div>

      </div>

      <div className="mt-4 text-center">
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-lg shadow-brand-600/20 transition"
        >
          <Download className="w-4 h-4" /> Télécharger / Imprimer l’Attestation
        </button>
      </div>
    </div>
  );
}
