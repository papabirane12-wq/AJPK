'use client';

import { Partner } from '@/types';
import { formatDateFr } from '@/lib/utils/formatters';
import { Globe, Mail, Phone, ShieldCheck } from 'lucide-react';

interface PartnerCardProps {
  partner: Partner;
}

export function PartnerCard({ partner }: PartnerCardProps) {
  return (
    <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-4">
      
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 p-2 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
          <img
            src={partner.logo_url}
            alt={partner.name}
            className="max-h-full max-w-full object-contain"
          />
        </div>
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            {partner.type}
          </span>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
            {partner.name}
          </h3>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{partner.sector}</p>
        </div>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
        {partner.description}
      </p>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs text-slate-500">
        {partner.website && (
          <a
            href={partner.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-brand-600 dark:text-emerald-400 hover:underline font-bold truncate"
          >
            <Globe className="w-3.5 h-3.5" /> {partner.website}
          </a>
        )}
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Partenaire depuis {formatDateFr(partner.partnership_date)}</span>
          <span className="flex items-center gap-1 text-emerald-600 font-bold"><ShieldCheck className="w-3.5 h-3.5" /> Officiel</span>
        </div>
      </div>

    </div>
  );
}
