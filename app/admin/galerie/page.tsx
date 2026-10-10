'use client';

import { mockAlbums } from '@/lib/data/mockData';
import { Image, PlusCircle, Layers } from 'lucide-react';

export default function AdminGaleriePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Gestion de la Galerie Photo</h1>
          <p className="text-xs text-slate-400 mt-1">Organisez les albums par thématique (Événements, Formations, Sport...).</p>
        </div>

        <button className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow flex items-center gap-2">
          <PlusCircle className="w-4 h-4" /> Créer un Album
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockAlbums.map((album) => (
          <div key={album.id} className="bg-slate-900 rounded-3xl p-4 border border-slate-800 space-y-3">
            <img src={album.cover_image} alt={album.title} className="w-full h-40 object-cover rounded-2xl" />
            <h3 className="font-extrabold text-white text-sm">{album.title}</h3>
            <p className="text-xs text-slate-400">{album.category} • {album.media_count} médias</p>
          </div>
        ))}
      </div>
    </div>
  );
}
