'use client';

import { Profile } from '@/types';
import { QRCodeView } from '@/components/ui/QRCodeView';
import { formatDateFr } from '@/lib/utils/formatters';
import { ShieldCheck, Download, Share2, Sparkles } from 'lucide-react';

interface MemberCardDigitalProps {
  member: Profile;
  showActions?: boolean;
}

export function MemberCardDigital({ member, showActions = true }: MemberCardDigitalProps) {
  const verificationUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/verification/${member.member_number}` 
    : `https://ajpk.sn/verification/${member.member_number}`;

  return (
    <div className="max-w-md mx-auto">
      {/* Credit Card / Badge Container */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-brand-950 to-slate-950 p-6 text-white shadow-2xl border border-emerald-500/30">
        
        {/* Holographic glowing blobs */}
        <div className="absolute -top-16 -right-16 w-44 h-44 bg-brand-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Card Header */}
        <div className="flex items-center justify-between relative z-10 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-auto flex items-center justify-center">
              <img
                src="/logo.png"
                alt="Logo AJPK"
                className="h-8 w-auto object-contain brightness-110 drop-shadow"
              />
            </div>
            <div>
              <h3 className="font-extrabold text-sm tracking-wide text-white uppercase">Carte Officielle de Membre</h3>
              <p className="text-[10px] text-gold-400 font-semibold tracking-wider">Association Jeunesse Polyvalente de Kelle</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Valide
          </span>
        </div>

        {/* Card Body */}
        <div className="my-6 grid grid-cols-3 gap-4 items-center relative z-10">
          
          {/* Member Photo */}
          <div className="col-span-1">
            <div className="w-24 h-28 rounded-2xl overflow-hidden ring-2 ring-emerald-500/50 shadow-md bg-slate-800">
              <img
                src={member.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
                alt={`${member.first_name} ${member.last_name}`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Member Info */}
          <div className="col-span-2 space-y-2 text-left">
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Nom & Prénom</p>
              <p className="text-base font-extrabold text-white leading-tight">
                {member.first_name} {member.last_name}
              </p>
            </div>

            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">N° Adhérent Unique</p>
              <p className="text-sm font-black text-amber-400 tracking-wider font-mono">
                {member.member_number}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-1 text-[11px]">
              <div>
                <p className="text-slate-400 text-[9px] uppercase font-semibold">Profession</p>
                <p className="text-slate-200 truncate font-medium">{member.profession || 'Membre'}</p>
              </div>
              <div>
                <p className="text-slate-400 text-[9px] uppercase font-semibold">Adhésion</p>
                <p className="text-slate-200 font-medium">{formatDateFr(member.created_at)}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Card Footer with QR Code */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between relative z-10">
          <div>
            <p className="text-[10px] text-slate-400 font-medium">Scannez pour vérifier l’authenticité</p>
            <p className="text-[11px] font-bold text-emerald-400 mt-0.5">Kelle, Sénégal</p>
          </div>
          <div className="bg-white p-1 rounded-xl shadow-lg">
            <QRCodeView value={verificationUrl} size={64} />
          </div>
        </div>

      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs hover:bg-slate-800 transition shadow"
          >
            <Download className="w-4 h-4 text-emerald-400" /> Télécharger / Imprimer
          </button>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `Carte Membre AJPK - ${member.first_name} ${member.last_name}`,
                  url: verificationUrl,
                }).catch(() => {});
              } else {
                navigator.clipboard.writeText(verificationUrl);
                alert('Lien de vérification copié dans le presse-papier !');
              }
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 transition"
          >
            <Share2 className="w-4 h-4 text-amber-500" /> Partager
          </button>
        </div>
      )}
    </div>
  );
}
