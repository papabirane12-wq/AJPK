'use client';

import { useState, useEffect, useRef } from 'react';
import {
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ExternalLink,
  QrCode,
  ShieldCheck,
  RefreshCw,
  X,
  Phone
} from 'lucide-react';
import { QRCodeView } from '@/components/ui/QRCodeView';

interface UnitechPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  method: 'wave' | 'om';
  amount: number;
  phone: string;
  customerName: string;
  onPaymentSuccess: (transactionData: { reference: string; transaction_id: string | number; method: string }) => void;
}

export function UnitechPaymentModal({
  isOpen,
  onClose,
  method,
  amount,
  phone,
  customerName,
  onPaymentSuccess,
}: UnitechPaymentModalProps) {
  const [loadingInit, setLoadingInit] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);
  const [transactionData, setTransactionData] = useState<{
    reference: string;
    transaction_id: string | number;
    payment_url?: string;
    qr_code?: string;
    deep_links?: { OM?: string; MAXIT?: string };
    amount: number;
    status: string;
  } | null>(null);

  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'checking' | 'completed' | 'failed'>('pending');
  const [statusMessage, setStatusMessage] = useState<string>('En attente de validation sur votre téléphone...');
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialisation de la transaction avec Unitech Pay
  useEffect(() => {
    if (!isOpen) {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      return;
    }

    let isMounted = true;
    setLoadingInit(true);
    setInitError(null);
    setPaymentStatus('pending');

    async function initPayment() {
      try {
        const res = await fetch('/api/unitech/initiate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            method,
            amount,
            phone,
            customerName,
            description: `Adhésion AJPK - ${customerName}`,
          }),
        });

        const data = await res.json();
        if (!isMounted) return;

        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Impossible d’initialiser le paiement Unitech Pay.');
        }

        setTransactionData(data.data);
        setLoadingInit(false);
      } catch (err: unknown) {
        if (!isMounted) return;
        const msg = err instanceof Error ? err.message : 'Erreur réseau';
        setInitError(msg);
        setLoadingInit(false);
      }
    }

    initPayment();

    return () => {
      isMounted = false;
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [isOpen, method, amount, phone, customerName]);

  // Polling automatique pour vérifier le statut de paiement
  useEffect(() => {
    if (!transactionData?.reference || paymentStatus === 'completed') return;

    const checkStatus = async () => {
      try {
        const res = await fetch(
          `/api/unitech/status?reference=${encodeURIComponent(transactionData.reference)}&transaction_id=${transactionData.transaction_id}`,
          { cache: 'no-store' }
        );
        const data = await res.json();

        if (data.success && data.status === 'completed') {
          setPaymentStatus('completed');
          setStatusMessage('Paiement validé avec succès par Unitech Pay !');
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

          // Tant que le paiement n'est pas validé on ne passe pas à l'action suivante :
          // Ici le paiement est officiellement validé, on déclenche l'action suivante !
          setTimeout(() => {
            onPaymentSuccess({
              reference: transactionData.reference,
              transaction_id: transactionData.transaction_id,
              method,
            });
          }, 1500);
        } else if (data.status === 'failed') {
          setPaymentStatus('failed');
          setStatusMessage('Le paiement a été rejeté ou a échoué. Veuillez réessayer.');
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        }
      } catch (e) {
        console.error('Erreur vérification statut Unitech:', e);
      }
    };

    // Polling toutes les 3.5 secondes
    pollIntervalRef.current = setInterval(checkStatus, 3500);

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [transactionData, paymentStatus, onPaymentSuccess, method]);

  // Vérification manuelle sur clic bouton
  const handleManualCheck = async () => {
    if (!transactionData?.reference) return;
    setPaymentStatus('checking');
    setStatusMessage('Vérification auprès de la passerelle Unitech Pay...');

    try {
      const res = await fetch(
        `/api/unitech/status?reference=${encodeURIComponent(transactionData.reference)}&transaction_id=${transactionData.transaction_id}`,
        { cache: 'no-store' }
      );
      const data = await res.json();

      if (data.success && data.status === 'completed') {
        setPaymentStatus('completed');
        setStatusMessage('Paiement validé avec succès !');
        setTimeout(() => {
          onPaymentSuccess({
            reference: transactionData.reference,
            transaction_id: transactionData.transaction_id,
            method,
          });
        }, 1200);
      } else {
        setPaymentStatus('pending');
        setStatusMessage('Paiement toujours en attente sur votre téléphone. Veuillez valider la demande.');
      }
    } catch {
      setPaymentStatus('pending');
      setStatusMessage('Erreur lors de la vérification. Réessayez dans un instant.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 text-slate-900 dark:text-white">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl ${method === 'wave' ? 'bg-sky-500/10 text-sky-600' : 'bg-amber-500/10 text-amber-600'}`}>
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold flex items-center gap-2">
                Paiement Sécurisé Unitech Pay
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  Officiel
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Frais d’adhésion membre AJPK • {amount.toLocaleString('fr-FR')} FCFA
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Loading state */}
        {loadingInit && (
          <div className="py-12 text-center space-y-4">
            <Loader2 className="w-12 h-12 text-brand-600 animate-spin mx-auto" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Connexion sécurisée à Unitech Pay ({method === 'wave' ? 'Wave Sénégal' : 'Orange Money'})...
            </p>
            <p className="text-xs text-slate-400">Génération de la session de paiement en cours</p>
          </div>
        )}

        {/* Error state */}
        {!loadingInit && initError && (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-rose-600">Échec d’initialisation du paiement</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">{initError}</p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-bold hover:bg-slate-300"
            >
              Fermer et Réessayer
            </button>
          </div>
        )}

        {/* Active Payment View */}
        {!loadingInit && !initError && transactionData && (
          <div className="space-y-6">
            
            {/* Status Banner */}
            <div className={`p-4 rounded-2xl border text-center transition-all ${
              paymentStatus === 'completed'
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                : paymentStatus === 'failed'
                ? 'bg-rose-500/10 border-rose-500/40 text-rose-600 dark:text-rose-400'
                : 'bg-amber-500/10 border-amber-500/40 text-amber-700 dark:text-amber-300'
            }`}>
              <div className="flex items-center justify-center gap-2 font-extrabold text-sm">
                {paymentStatus === 'completed' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : paymentStatus === 'checking' ? (
                  <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
                ) : (
                  <div className="w-3 h-3 rounded-full bg-amber-500 animate-ping" />
                )}
                <span>{statusMessage}</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                {paymentStatus === 'completed'
                  ? 'Génération de votre carte de membre officielle...'
                  : 'Tant que le paiement n’est pas confirmé, l’adhésion reste en attente.'}
              </p>
            </div>

            {/* Payment Details Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 font-semibold">Montant exact</span>
                <span className="font-extrabold text-base text-emerald-600 dark:text-emerald-400 font-mono">
                  {amount.toLocaleString('fr-FR')} FCFA
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-semibold">Méthode</span>
                <span className="font-bold flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${method === 'wave' ? 'bg-sky-500' : 'bg-amber-500'}`} />
                  {method === 'wave' ? 'Wave Sénégal' : 'Orange Money (Sénégal)'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-semibold">Numéro de téléphone</span>
                <span className="font-mono font-bold">{phone}</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-400">Réf. Transaction</span>
                <span className="font-mono text-slate-400 truncate max-w-[180px]">{transactionData.reference}</span>
              </div>
            </div>

            {/* QR Code & Direct Link */}
            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center p-4 rounded-2xl bg-slate-100 dark:bg-slate-800">
              {/* QR Code Container */}
              <div className="p-3 bg-white rounded-2xl shadow-md border border-slate-200 flex flex-col items-center justify-center shrink-0">
                {transactionData.qr_code ? (
                  <img
                    src={transactionData.qr_code}
                    alt="QR Code Orange Money"
                    className="w-36 h-36 object-contain rounded-lg"
                  />
                ) : transactionData.payment_url ? (
                  <QRCodeView value={transactionData.payment_url} size={144} />
                ) : (
                  <div className="w-36 h-36 flex items-center justify-center text-slate-400">
                    <QrCode className="w-12 h-12" />
                  </div>
                )}
                <span className="text-[10px] font-extrabold text-slate-700 mt-2 uppercase tracking-wide">
                  Scannez pour payer
                </span>
              </div>

              {/* Instructions & Buttons */}
              <div className="space-y-3 text-center sm:text-left flex-1">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  {method === 'wave'
                    ? 'Scannez le QR Code avec votre application Wave ou cliquez sur le bouton ci-dessous pour lancer Wave directement :'
                    : 'Scannez ce QR Code avec l’application Orange Money / Max It ou utilisez le lien direct ci-dessous :'}
                </p>

                {transactionData.payment_url && (
                  <a
                    href={transactionData.payment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl font-extrabold text-xs shadow-lg transition text-white ${
                      method === 'wave'
                        ? 'bg-sky-600 hover:bg-sky-700 shadow-sky-600/30'
                        : 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/30'
                    }`}
                  >
                    <ExternalLink className="w-4 h-4" />
                    Ouvrir {method === 'wave' ? 'Wave' : 'Orange Money'} sur mon téléphone
                  </a>
                )}

                {transactionData.deep_links?.MAXIT && (
                  <a
                    href={transactionData.deep_links.MAXIT}
                    className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl font-extrabold text-xs bg-orange-500 hover:bg-orange-600 text-white transition shadow"
                  >
                    <Phone className="w-3.5 h-3.5" /> Ouvrir l’app Max It Orange
                  </a>
                )}
              </div>
            </div>

            {/* Validation Actions */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleManualCheck}
                disabled={paymentStatus === 'completed' || paymentStatus === 'checking'}
                className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-extrabold text-xs shadow flex items-center justify-center gap-2 disabled:opacity-50 transition"
              >
                <RefreshCw className={`w-4 h-4 ${paymentStatus === 'checking' ? 'animate-spin' : ''}`} />
                J’ai validé le paiement sur mon téléphone • Vérifier
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Paiement certifié par Unitech Pay • Sécurité SSL 256-bit</span>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
