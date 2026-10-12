'use client';

import { useState, useRef } from 'react';
import { getCurrentUser, updateCurrentUserAvatar } from '@/lib/data/store';
import { compressAndResizeImage } from '@/lib/utils/imageCompressor';
import { formatDateFr } from '@/lib/utils/formatters';
import { Camera, Upload, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function ProfilDashboardPage() {
  const [user, setUser] = useState(() => getCurrentUser());
  const [isUploading, setIsUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3 max-w-md mx-auto my-12">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Connexion requise</h2>
        <p className="text-xs text-slate-500">Connectez-vous pour visualiser et gérer votre profil membre.</p>
      </div>
    );
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Veuillez sélectionner un fichier image valide.');
      return;
    }

    try {
      setIsUploading(true);
      setErrorMsg('');
      setSuccessMsg('');

      const compressedDataUrl = await compressAndResizeImage(file, 400, 400, 0.85);
      const updated = updateCurrentUserAvatar(compressedDataUrl);
      if (updated) {
        setUser(updated);
        setSuccessMsg('Photo de profil et de carte mise à jour avec succès !');
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch {
      setErrorMsg('Erreur lors du traitement de l’image.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Mon Profil Membre
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Vos informations personnelles enregistrées dans l’annuaire de l’association.
        </p>
      </div>

      {successMsg && (
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs font-bold flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-500" /> {errorMsg}
        </div>
      )}

      <div className="bg-white dark:bg-slate-850 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative group shrink-0">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.first_name}
                className="w-28 h-32 rounded-2xl object-cover ring-4 ring-brand-500/30 shadow-md"
              />
            ) : (
              <div className="w-28 h-32 rounded-2xl bg-gradient-to-tr from-brand-700 to-emerald-600 text-white flex items-center justify-center text-3xl font-extrabold ring-4 ring-brand-500/30 shadow-md">
                {user.first_name?.[0] || ''}{user.last_name?.[0] || ''}
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="absolute -bottom-2 -right-2 p-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-lg transition"
              title="Modifier ma photo"
            >
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300">
              {user.role}
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {user.first_name} {user.last_name}
            </h2>
            <p className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 mt-0.5">
              N° Adhérent : {user.member_number}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Photo officielle synchronisée avec votre carte de membre numérique AJPK.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div>
            <p className="text-slate-400 font-semibold">Email</p>
            <p className="font-bold text-slate-900 dark:text-white mt-0.5">{user.email}</p>
          </div>
          <div>
            <p className="text-slate-400 font-semibold">Téléphone</p>
            <p className="font-bold text-slate-900 dark:text-white mt-0.5">{user.phone}</p>
          </div>
          <div>
            <p className="text-slate-400 font-semibold">Adresse</p>
            <p className="font-bold text-slate-900 dark:text-white mt-0.5">{user.address}</p>
          </div>
          <div>
            <p className="text-slate-400 font-semibold">Profession</p>
            <p className="font-bold text-slate-900 dark:text-white mt-0.5">{user.profession}</p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs font-semibold text-slate-400">Bio & Présentation</p>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{user.bio}</p>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs font-semibold text-slate-400 mb-2">Compétences</p>
          <div className="flex flex-wrap gap-2">
            {user.skills.map((s, i) => (
              <span key={i} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
