'use client';

import { useState } from 'react';
import { getFormations } from '@/lib/data/store';
import { FormationCard } from '@/components/cards/FormationCard';
import { Search, BookOpen, Award } from 'lucide-react';

export default function FormationsPage() {
  const formations = getFormations();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = formations.filter(f => 
    f.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      <div className="text-center max-w-2xl mx-auto">
        <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300">
          Centre de Qualification
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mt-3">
          Catalogue des Formations Certifiantes
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
          Des programmes intensifs dispensés par des formateurs certifiés pour vous donner les compétences recherchées sur le marché de l’emploi.
        </p>
      </div>

      {/* Search */}
      <div className="max-w-xl mx-auto flex items-center gap-2 p-2 bg-white dark:bg-slate-850 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800">
        <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
        <input
          type="text"
          placeholder="Rechercher une formation (ex: Web, Solaire, Business...)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent text-sm font-medium focus:outline-none text-slate-900 dark:text-white"
        />
      </div>

      {/* Formations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((formation) => (
          <FormationCard key={formation.id} formation={formation} />
        ))}
      </div>

    </div>
  );
}
