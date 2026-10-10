'use client';

import { Opportunity } from '@/types';
import { formatDateFr } from '@/lib/utils/formatters';
import { Briefcase, MapPin, Calendar, Bookmark, ExternalLink } from 'lucide-react';
import { toggleSaveOpportunity, isOpportunitySaved } from '@/lib/data/store';
import { useState } from 'react';

interface OpportunityCardProps {
  opportunity: Opportunity;
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const [saved, setSaved] = useState(isOpportunitySaved(opportunity.id));

  const handleToggleSave = () => {
    const isNowSaved = toggleSaveOpportunity(opportunity.id);
    setSaved(isNowSaved);
  };

  return (
    <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between space-y-4">
      <div>
        <div className="flex items-start justify-between gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
            {opportunity.category}
          </span>
          <button
            onClick={handleToggleSave}
            className={`p-2 rounded-xl transition ${
              saved
                ? 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400'
                : 'bg-slate-100 text-slate-400 hover:text-slate-600 dark:bg-slate-800 dark:hover:text-white'
            }`}
            title={saved ? 'Retirer des sauvegardes' : 'Sauvegarder cette opportunité'}
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>
        </div>

        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-3 hover:text-brand-600 dark:hover:text-emerald-400 transition-colors">
          {opportunity.title}
        </h3>

        <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mt-1">
          {opportunity.organization}
        </p>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 line-clamp-3 leading-relaxed">
          {opportunity.description}
        </p>
      </div>

      <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
          <span className="truncate">{opportunity.location}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-semibold text-rose-600 dark:text-rose-400">
            <Calendar className="w-3.5 h-3.5" /> Date limite : {formatDateFr(opportunity.deadline)}
          </span>
        </div>
      </div>

      <div className="pt-2">
        <a
          href={opportunity.application_link || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-brand-600 dark:hover:bg-emerald-600 text-white font-bold text-xs transition shadow-sm"
        >
          Postuler / En savoir plus <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
