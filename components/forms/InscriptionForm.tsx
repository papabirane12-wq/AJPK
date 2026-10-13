'use client';

import { useState, useEffect, useRef } from 'react';
import { addMember, setCurrentUser } from '@/lib/data/store';
import { Profile } from '@/types';
import { MemberCardDigital } from '@/components/cards/MemberCardDigital';
import { PhoneInput } from '@/components/ui/PhoneInput';
import { compressAndResizeImage } from '@/lib/utils/imageCompressor';
import {
  UserPlus,
  CheckCircle2,
  ShieldCheck,
  Upload,
  Camera,
  CreditCard,
  Loader2,
  Lock,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

const PENDING_REG_KEY = 'ajpk_pending_registration';
const PENDING_REF_KEY = 'ajpk_pending_unitech_ref';

export function InscriptionForm() {
  const [createdMember, setCreatedMember] = useState<Profile | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [isCompressingPhoto, setIsCompressingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'wave' | 'om'>('wave');
  const [paymentPhone, setPaymentPhone] = useState<string>('');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [apiError, setApiError] = useState<string>('');
  const [verifyingPending, setVerifyingPending] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<string>('');
  const [lastPaymentRef, setLastPaymentRef] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    profession: '',
  });

  // Vérifier au chargement si un paiement est en attente de retour (après redirection Wave / OM)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedRef = localStorage.getItem(PENDING_REF_KEY);
    const savedReg = localStorage.getItem(PENDING_REG_KEY);

    if (!savedRef || !savedReg) return;

    let parsedReg: Record<string, string> = {};
    try {
      parsedReg = JSON.parse(savedReg);
    } catch {
      return;
    }

    setVerifyingPending(true);
    setPendingMessage('Vérification du paiement en direct auprès d’Unitech Pay...');

    const verifyPayment = async () => {
      try {
        const res = await fetch(`/api/unitech/status?reference=${encodeURIComponent(savedRef)}`, {
          cache: 'no-store',
        });
        const data = await res.json();

        // TANT QUE LE PAIEMENT N'EST PAS VALIDE NE PASSE PAS À L'ACTION SUIVANTE
        if (data.success && data.status === 'completed') {
          setLastPaymentRef(savedRef);

          const cleanPhone = (parsedReg.phone || '').replace(/[^0-9]/g, '');
          const autoEmail = `${(parsedReg.first_name || '').toLowerCase().replace(/\s+/g, '')}.${(parsedReg.last_name || '').toLowerCase().replace(/\s+/g, '') || cleanPhone}@ajpk.sn`;

          let member: Profile;
          try {
            // Validation et enregistrement direct en base de données Supabase
            const apiRes = await fetch('/api/members', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                first_name: parsedReg.first_name,
                last_name: parsedReg.last_name,
                email: autoEmail,
                phone: parsedReg.phone,
                address: parsedReg.address,
                profession: parsedReg.profession,
                avatar_url: parsedReg.avatar_url,
                payment_ref: savedRef,
                payment_method: parsedReg.payment_method || 'Wave',
              }),
            });
            const apiData = await apiRes.json();
            if (apiData.success && apiData.member) {
              member = apiData.member;
            } else {
              throw new Error(apiData.message || 'Erreur enregistrement');
            }
          } catch {
            member = {
              id: `usr-${Date.now()}`,
              first_name: (parsedReg.first_name || '').trim(),
              last_name: (parsedReg.last_name || '').trim(),
              email: autoEmail,
              phone: parsedReg.phone || '',
              member_number: 'AJPK-00000',
              address: parsedReg.address || 'Commune de Kelle',
              profession: parsedReg.profession || 'Membre AJPK',
              avatar_url: parsedReg.avatar_url || '',
              date_of_birth: '',
              sex: 'M',
              education_level: 'Membre AJPK',
              bio: '',
              role: 'member',
              status: 'actif',
              created_at: new Date().toISOString(),
              skills: [],
              interest_domains: [],
            };
          }

          setCurrentUser(member);
          setCreatedMember(member);

          localStorage.removeItem(PENDING_REF_KEY);
          localStorage.removeItem(PENDING_REG_KEY);
          setVerifyingPending(false);
        } else if (data.status === 'failed') {
          setPendingMessage('Le paiement a été rejeté ou annulé par Unitech Pay. Vous pouvez recommencer.');
          localStorage.removeItem(PENDING_REF_KEY);
          setVerifyingPending(false);
        } else {
          // Status pending
          setPendingMessage('Paiement non finalisé ou en attente sur votre téléphone. Si vous avez validé le débit, cliquez sur Vérifier.');
          setVerifyingPending(false);
        }
      } catch {
        setPendingMessage('Erreur de connexion lors de la vérification du paiement.');
        setVerifyingPending(false);
      }
    };

    verifyPayment();
  }, []);

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
      const compressedDataUrl = await compressAndResizeImage(file, 400, 400, 0.85);
      setAvatarPreview(compressedDataUrl);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors du traitement de l’image.';
      setPhotoError(msg);
    } finally {
      setIsCompressingPhoto(false);
    }
  };

  // SOUMISSION DIRECTE : PAS DE PAGE INTERMEDIAIRE, REDIRECTION DIRECTE AU PAIEMENT
  const handleDirectPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    if (!avatarPreview) {
      setPhotoError('La photo d’identité est obligatoire pour générer votre carte officielle.');
      return;
    }

    const debitPhone = paymentPhone || formData.phone;
    if (!debitPhone) {
      setApiError('Veuillez renseigner un numéro de téléphone valide.');
      return;
    }

    try {
      setIsRedirecting(true);

      // 1. Sauvegarder les données de l'inscription en attente
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          PENDING_REG_KEY,
          JSON.stringify({
            ...formData,
            avatar_url: avatarPreview,
            paymentMethod,
          })
        );
      }

      // 2. Initialiser la session Unitech Pay
      const res = await fetch('/api/unitech/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: paymentMethod,
          amount: 1050,
          phone: debitPhone,
          customerName: `${formData.first_name} ${formData.last_name}`,
          description: `Adhésion AJPK - ${formData.first_name} ${formData.last_name}`,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.data?.payment_url) {
        throw new Error(data.message || 'Impossible d’initialiser le paiement Unitech Pay.');
      }

      // 3. Stocker la référence de transaction
      if (typeof window !== 'undefined') {
        localStorage.setItem(PENDING_REF_KEY, data.data.reference);
      }

      // 4. REDIRECTION IMMÉDIATE VERS WAVE OU ORANGE MONEY SANS PAGE INTERMÉDIAIRE
      window.location.href = data.data.payment_url;
    } catch (err: unknown) {
      setIsRedirecting(false);
      const msg = err instanceof Error ? err.message : 'Erreur de connexion.';
      setApiError(msg);
    }
  };

  const handleManualRecheck = async () => {
    const savedRef = typeof window !== 'undefined' ? localStorage.getItem(PENDING_REF_KEY) : null;
    const savedReg = typeof window !== 'undefined' ? localStorage.getItem(PENDING_REG_KEY) : null;

    if (!savedRef || !savedReg) return;

    setVerifyingPending(true);
    setPendingMessage('Vérification en cours auprès d’Unitech Pay...');

    try {
      const res = await fetch(`/api/unitech/status?reference=${encodeURIComponent(savedRef)}`, {
        cache: 'no-store',
      });
      const data = await res.json();

      if (data.success && data.status === 'completed') {
        setLastPaymentRef(savedRef);
        const parsedReg = JSON.parse(savedReg);
        const cleanPhone = (parsedReg.phone || '').replace(/[^0-9]/g, '');
        const autoEmail = `${(parsedReg.first_name || '').toLowerCase().replace(/\s+/g, '')}.${(parsedReg.last_name || '').toLowerCase().replace(/\s+/g, '') || cleanPhone}@ajpk.sn`;

        let member: Profile;
        try {
          const apiRes = await fetch('/api/members', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              first_name: parsedReg.first_name,
              last_name: parsedReg.last_name,
              email: autoEmail,
              phone: parsedReg.phone,
              address: parsedReg.address,
              profession: parsedReg.profession,
              avatar_url: parsedReg.avatar_url,
              payment_ref: savedRef,
              payment_method: parsedReg.payment_method || 'Wave',
            }),
          });
          const apiData = await apiRes.json();
          if (apiData.success && apiData.member) {
            member = apiData.member;
          } else {
            throw new Error(apiData.message || 'Erreur');
          }
        } catch {
          member = {
            id: `usr-${Date.now()}`,
            first_name: (parsedReg.first_name || '').trim(),
            last_name: (parsedReg.last_name || '').trim(),
            email: autoEmail,
            phone: parsedReg.phone || '',
            member_number: 'AJPK-00000',
            address: parsedReg.address || 'Commune de Kelle',
            profession: parsedReg.profession || 'Membre AJPK',
            avatar_url: parsedReg.avatar_url || '',
            date_of_birth: '',
            sex: 'M',
            education_level: 'Membre AJPK',
            bio: '',
            role: 'member',
            status: 'actif',
            created_at: new Date().toISOString(),
            skills: [],
            interest_domains: [],
          };
        }

        setCurrentUser(member);
        setCreatedMember(member);
        localStorage.removeItem(PENDING_REF_KEY);
        localStorage.removeItem(PENDING_REG_KEY);
      } else {
        setPendingMessage('Le paiement n’a pas encore été validé par Unitech Pay. Assurez-vous d’avoir confirmé sur Wave / Orange Money.');
      }
    } catch {
      setPendingMessage('Erreur lors de la vérification.');
    } finally {
      setVerifyingPending(false);
    }
  };

  // ÉCRAN 1 : Confirmation finale (uniquement affichée après paiement validé)
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
    <form onSubmit={handleDirectPayment} className="bg-white dark:bg-slate-850 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
      
      {/* Bannière en cas de paiement en attente de vérification */}
      {pendingMessage && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold">
            <RefreshCw className={`w-4 h-4 text-amber-600 ${verifyingPending ? 'animate-spin' : ''}`} />
            <span>{pendingMessage}</span>
          </div>
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={handleManualRecheck}
              disabled={verifyingPending}
              className="px-3 py-1.5 rounded-xl bg-amber-600 text-white font-bold text-[11px] hover:bg-amber-700 disabled:opacity-50"
            >
              {verifyingPending ? 'Vérification...' : 'Vérifier la validation'}
            </button>
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem(PENDING_REF_KEY);
                localStorage.removeItem(PENDING_REG_KEY);
                setPendingMessage('');
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[11px]"
            >
              Nouveau formulaire
            </button>
          </div>
        </div>
      )}

      {apiError && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2 font-bold">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
          <span>{apiError}</span>
        </div>
      )}

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
          Renseignez vos coordonnées, importez votre photo et payez directement via Wave ou Orange Money.
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

      {/* 3. Section Choix Moyen de Paiement */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-brand-500/5 to-slate-900/10 border border-emerald-500/30 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Moyen de Paiement (1 050 FCFA)
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Cliquez pour être redirigé directement vers votre application de paiement.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setPaymentMethod('wave')}
            className={`p-3 rounded-2xl border-2 flex items-center justify-center gap-3 text-xs font-black transition shadow-sm ${
              paymentMethod === 'wave'
                ? 'border-sky-500 bg-sky-500/10 text-sky-700 dark:text-sky-300 ring-2 ring-sky-500/30'
                : 'border-slate-200 dark:border-slate-700 hover:border-sky-300 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800'
            }`}
          >
            <img
              src="/icons/wave.png"
              alt="Wave"
              className="w-7 h-7 object-contain rounded-lg shrink-0 shadow-sm"
            />
            <span>Wave Sénégal</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('om')}
            className={`p-3 rounded-2xl border-2 flex items-center justify-center gap-3 text-xs font-black transition shadow-sm ${
              paymentMethod === 'om'
                ? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300 ring-2 ring-amber-500/30'
                : 'border-slate-200 dark:border-slate-700 hover:border-amber-300 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800'
            }`}
          >
            <img
              src="/icons/orange-money.png"
              alt="Orange Money"
              className="w-7 h-7 object-contain rounded-lg shrink-0 shadow-sm"
            />
            <span>Orange Money</span>
          </button>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
            Numéro de débit {paymentMethod === 'wave' ? 'Wave' : 'Orange Money'}
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
        disabled={isCompressingPhoto || isRedirecting}
        className={`w-full py-4 rounded-2xl text-white font-black text-sm shadow-xl transition flex items-center justify-center gap-3 disabled:opacity-50 ${
          paymentMethod === 'wave'
            ? 'bg-sky-500 hover:bg-sky-600 shadow-sky-500/30 ring-2 ring-sky-400/20'
            : 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30 ring-2 ring-amber-400/20'
        }`}
      >
        {isRedirecting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Redirection vers {paymentMethod === 'wave' ? 'Wave' : 'Orange Money'}...
          </>
        ) : (
          <>
            <img
              src={paymentMethod === 'wave' ? '/icons/wave.png' : '/icons/orange-money.png'}
              alt={paymentMethod === 'wave' ? 'Wave' : 'Orange Money'}
              className="w-6 h-6 object-contain rounded-md bg-white p-0.5 shadow-sm shrink-0"
            />
            <span>Payer 1 050 FCFA avec {paymentMethod === 'wave' ? 'Wave Sénégal' : 'Orange Money'}</span>
          </>
        )}
      </button>
    </form>
  );
}
