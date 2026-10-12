'use client';

import { useState, useRef } from 'react';
import { addMember, setCurrentUser } from '@/lib/data/store';
import { Profile } from '@/types';
import { MemberCardDigital } from '@/components/cards/MemberCardDigital';
import { PhoneInput } from '@/components/ui/PhoneInput';
import { UnitechPaymentModal } from '@/components/forms/UnitechPaymentModal';
import { compressAndResizeImage } from '@/lib/utils/imageCompressor';
import {
  UserPlus,
  CheckCircle2,
  ShieldCheck,
  Upload,
  Camera,
  CreditCard,
  Loader2,
  Lock
} from 'lucide-react';

export function InscriptionForm() {
  const [createdMember, setCreatedMember] = useState<Profile | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [isCompressingPhoto, setIsCompressingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'wave' | 'om'>('wave');
  const [paymentPhone, setPaymentPhone] = useState<string>('');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [lastPaymentRef, setLastPaymentRef] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    profession: '',
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPhotoError('Veuillez sélectionner un fichier image valide (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setPhotoError('La photo ne doit pas dépasser 10 Mo.');
      return;
    }

    try {
      setIsCompressingPhoto(true);
      setPhotoError('');
      // Compression et redimensionnement automatique en canvas (résolution idéale pour badge / carte)
      const compressedDataUrl = await compressAndResizeImage(file, 400, 400, 0.85);
      setAvatarPreview(compressedDataUrl);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors du traitement de l’image.';
      setPhotoError(msg);
    } finally {
      setIsCompressingPhoto(false);
    }
  };

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!avatarPreview) {
      setPhotoError('La photo d’identité est obligatoire pour générer votre carte officielle.');
      return;
    }

    // Ouvrir le modal de paiement Unitech Pay.
    // TANT QUE LE PAIEMENT N'EST PAS VALIDÉ, ON NE PASSE PAS À L'ACTION SUIVANTE.
    setIsPaymentModalOpen(true);
  };

  // Déclenché UNIQUEMENT lorsque Unitech Pay a confirmé le statut 'completed'
  const handlePaymentValidated = (paymentData: { reference: string; transaction_id: string | number; method: string }) => {
    setLastPaymentRef(paymentData.reference);

    const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
    const autoEmail = `${formData.first_name.toLowerCase().replace(/\s+/g, '')}.${formData.last_name.toLowerCase().replace(/\s+/g, '') || cleanPhone}@ajpk.sn`;

    // Création officielle du membre uniquement après paiement validé
    const member = addMember({
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      email: autoEmail,
      phone: formData.phone,
      address: formData.address || 'Commune de Kelle',
      profession: formData.profession || 'Membre AJPK',
      avatar_url: avatarPreview,
      date_of_birth: '',
      sex: 'M',
      education_level: '',
      bio: '',
      skills: [],
      interest_domains: [],
    });

    setCurrentUser(member);
    setCreatedMember(member);
    setIsPaymentModalOpen(false);
  };

  if (createdMember) {
    return (
      <div className="space-y-6 text-center animate-fade-in">
        <div className="p-6 bg-emerald-50 dark:bg-emerald-950/60 rounded-3xl border border-emerald-200 dark:border-emerald-800">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
          <h2 className="text-2xl font-extrabold text-emerald-900 dark:text-emerald-200 mt-2">
            Félicitations {createdMember.first_name} ! Adhésion Confirmée
          </h2>
          <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-emerald-200/60 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-xs font-bold">
            <CreditCard className="w-4 h-4" /> Frais d’adhésion de 1 050 FCFA validés par Unitech Pay
          </div>
          {lastPaymentRef && (
            <p className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 mt-1">
              Réf. Transaction : {lastPaymentRef}
            </p>
          )}
          <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-2">
            Votre numéro d’adhérent unique est <strong className="font-mono font-black text-amber-600 dark:text-amber-400">{createdMember.member_number}</strong>. Votre carte officielle avec votre photo est prête :
          </p>
        </div>

        <MemberCardDigital member={createdMember} />

        <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={() => window.location.href = '/dashboard/carte'}
            className="px-8 py-3.5 rounded-2xl bg-brand-600 text-white font-extrabold text-sm hover:bg-brand-700 shadow-lg"
          >
            Télécharger / Voir ma Carte
          </button>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="px-8 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            Aller sur mon Tableau de Bord
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleStartPayment} className="bg-white dark:bg-slate-850 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <UserPlus className="w-6 h-6 text-brand-600" /> Adhésion Membre AJPK
            </h3>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              Frais : 1 050 FCFA
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Renseignez vos coordonnées, importez votre photo pour la carte officielle et procédez au règlement sécurisé via Unitech Pay.
          </p>
        </div>

        {/* 1. Photo d'identité obligatoire */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
            Photo d’identité pour votre carte * <span className="text-slate-400 font-normal">(Visage net, fond neutre recommandé)</span>
          </label>

          <div className="flex items-center gap-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700">
            <div className="relative w-24 h-28 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0 border-2 border-brand-500/40 shadow-sm">
              {isCompressingPhoto ? (
                <div className="flex flex-col items-center justify-center p-2 text-center text-brand-600">
                  <Loader2 className="w-6 h-6 animate-spin mb-1" />
                  <span className="text-[9px] font-bold">Optimisation...</span>
                </div>
              ) : avatarPreview ? (
                <img src={avatarPreview} alt="Aperçu photo" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-2 text-slate-400">
                  <Camera className="w-7 h-7 mx-auto mb-1 text-slate-400" />
                  <span className="text-[10px] font-bold block">Votre Photo</span>
                </div>
              )}
            </div>

            <div className="space-y-2 flex-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isCompressingPhoto}
                className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition disabled:opacity-50"
              >
                <Upload className="w-4 h-4" /> {avatarPreview ? 'Changer ma photo' : 'Importer ma photo depuis l’appareil'}
              </button>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Format JPG, PNG ou WebP. La photo est optimisée pour être incrustée de façon nette sur votre carte numérique officielle.
              </p>
              {photoError && (
                <p className="text-xs font-bold text-rose-500 dark:text-rose-400">{photoError}</p>
              )}
            </div>
          </div>
        </div>

        {/* 2. Informations personnelles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Prénom *</label>
            <input
              type="text"
              required
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Nom *</label>
            <input
              type="text"
              required
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <PhoneInput
            value={formData.phone}
            onChange={(fullNumber) => setFormData({ ...formData, phone: fullNumber })}
            required
          />

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Adresse *</label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Profession *</label>
          <input
            type="text"
            required
            value={formData.profession}
            onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
          />
        </div>

        {/* 3. Section Choix Moyen de Paiement Unitech Pay */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-brand-500/5 to-slate-900/10 border border-emerald-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Paiement Sécurisé Unitech Pay (1 050 FCFA)
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                L’adhésion sera validée en temps réel dès confirmation de la transaction par Unitech Pay.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPaymentMethod('wave')}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-extrabold transition ${
                paymentMethod === 'wave'
                  ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 ring-2 ring-sky-500/30'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span> Wave Sénégal
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('om')}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-extrabold transition ${
                paymentMethod === 'om'
                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 ring-2 ring-amber-500/30'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Orange Money
            </button>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
              Numéro de téléphone pour le débit {paymentMethod === 'wave' ? 'Wave' : 'Orange Money'}
            </label>
            <input
              type="tel"
              required
              value={paymentPhone || formData.phone}
              onChange={(e) => setPaymentPhone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isCompressingPhoto}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-700 hover:to-emerald-600 disabled:opacity-50 text-white font-extrabold text-sm shadow-xl shadow-brand-600/30 transition flex items-center justify-center gap-2"
        >
          <Lock className="w-4 h-4 text-emerald-200" />
          Procéder au Paiement Unitech Pay (1 050 FCFA)
        </button>
      </form>

      {/* Modal interactif Unitech Pay avec validation stricte */}
      <UnitechPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        method={paymentMethod}
        amount={1050}
        phone={paymentPhone || formData.phone}
        customerName={`${formData.first_name} ${formData.last_name}`}
        onPaymentSuccess={handlePaymentValidated}
      />
    </>
  );
}
