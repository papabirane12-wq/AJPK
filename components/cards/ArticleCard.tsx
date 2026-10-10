'use client';

import Link from 'next/link';
import { Article } from '@/types';
import { formatDateFr } from '@/lib/utils/formatters';
import { Calendar, User, ArrowRight } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <div className="group bg-white dark:bg-slate-850 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
        <img
          src={article.cover_image}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-600 text-white shadow">
            {article.category}
          </span>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-emerald-500" /> {formatDateFr(article.published_at)}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-amber-500" /> {article.author}</span>
          </div>
          
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
            {article.title}
          </h3>
          
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
            {article.summary}
          </p>
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <Link
            href={`/actualites/${article.id}`}
            className="text-xs font-bold text-brand-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
          >
            Lire l’article complet <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
