'use client';

import { useState, useRef } from 'react';
import { getCurrentUser, updateCurrentUserAvatar } from '@/lib/data/store';
import { MemberCardDigital } from '@/components/cards/MemberCardDigital';
import { compressAndResizeImage } from '@/lib/utils/imageCompressor';
import { Camera, Upload, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function CarteMembreDashboardPage() {
  const [user, setUser] = useState(() => getCurrentUser());
  const [isUploading, setIsUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3 max-w-md mx-auto my-12">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Connexion requise</h2>
        <p className="text-xs text-slate-500">Connectez-vous pour visualiser votre carte de membre numérique officielle.</p>
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

      // Compression intelligente de l'image (max 400x400)
      const compressedDataUrl = await compressAndResizeImage(file, 400, 400, 0.85);

      const updated = updateCurrentUserAvatar(compressedDataUrl);
      if (updated) {
        setUser(updated);
        setSuccessMsg('Photo de carte mise à jour avec succès !');
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch {
      setErrorMsg('Erreur lors du traitement de l’image.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto py-6">
      <div className="text-center">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Ma Carte Membre Numérique
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Scannez le QR Code pour vérifier l’authenticité de votre statut membre AJPK auprès des partenaires.
        </p>
      </div>

      {/* Upload/Change photo notification */}
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

      {/* Official Digital Badge */}
      <MemberCardDigital member={user} showActions={true} />

      {/* Quick Photo update panel */}
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Photo d'identité du badge</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {user.avatar_url ? 'Changer ou renouveler votre photo officielle' : 'Ajouter votre photo officielle sur la carte'}
            </p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shrink-0 shadow transition"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Optimisation...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" /> {user.avatar_url ? 'Modifier la photo' : 'Ajouter une photo'}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
