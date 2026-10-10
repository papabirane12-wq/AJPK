'use client';

import { useState } from 'react';
import { mockAlbums } from '@/lib/data/mockData';
import { Image, Calendar, Layers } from 'lucide-react';

export default function GaleriePage() {
  const [selectedCat, setSelectedCat] = useState('Tous');

  const categories = ['Tous', 'Événements', 'Formations', 'Sport', 'Environnement', 'Social', 'Culture'];

  const filtered = mockAlbums.filter(a => selectedCat === 'Tous' || a.category === selectedCat);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      <div className="text-center max-w-2xl mx-auto">
        <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300">
          Médiathèque
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mt-3">
          Galerie Photos & Albums AJPK
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
          Revivez les moments forts des forums, formations, chantiers de reboisement et activités sportives.
        </p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              selectedCat === cat
                ? 'bg-brand-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Albums Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((album) => (
          <div key={album.id} className="group bg-white dark:bg-slate-850 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all">
            <div className="relative h-60 w-full overflow-hidden bg-slate-900">
              <img src={album.cover_image} alt={album.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 text-slate-900 shadow">
                  {album.category}
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 mb-1">
                  <Calendar className="w-3 h-3" /> {album.date}
                </span>
                <h3 className="text-lg font-extrabold">{album.title}</h3>
              </div>
            </div>
            <div className="p-4 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1 font-semibold"><Layers className="w-4 h-4 text-brand-600" /> {album.media_count} photos</span>
              <span className="font-bold text-brand-600 dark:text-emerald-400">Voir l’album →</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
