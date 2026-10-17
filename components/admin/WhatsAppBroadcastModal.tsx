'use client';

import { useState, useMemo } from 'react';
import { Profile } from '@/types';
import { 
  MessageCircle, 
  Copy, 
  Check, 
  Send, 
  Users, 
  Search, 
  ExternalLink, 
  Sparkles, 
  Calendar, 
  FileText, 
  AlertCircle,
  PhoneCall,
  CheckCircle2,
  X
} from 'lucide-react';

interface WhatsAppBroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: Profile[];
}

export function WhatsAppBroadcastModal({ isOpen, onClose, members }: WhatsAppBroadcastModalProps) {
  // Preset templates
  const templates = useMemo(() => [
    {
      id: 'nettoyage_maternelle',
      title: '🧹 Nettoyage École Maternelle',
      tag: 'Citoyenneté & École',
      content: `🌿 *ASSOCIATION DE LA JEUNESSE POLYVALENTE DE KELLÉ (AJPK)* 🌿
📢 *COMMUNIQUÉ OFFICIEL : GRANDE JOURNÉE CITOYENNE DE NETTOYAGE (SET-SETAL)*

Chers membres, chers frères et sœurs de Kellé,

Dans le cadre de nos actions citoyennes et de notre engagement pour l'éducation et le bien-être de nos enfants, l'AJPK organise une *grande journée de nettoyage et d'assainissement à l'École Maternelle de Kellé*.

Nos tout-petits méritent un cadre d'apprentissage sain, propre et agréable. La participation active de chacun de nous est essentielle pour la réussite de cette noble initiative !

🗓 *Date :* Dimanche 25 Octobre 2026
⏰ *Heure :* 08h30 précise
📍 *Lieu :* École Maternelle de Kellé

🧤 *Matériel souhaité :* Balais, râteaux, pelles, brouettes, sacs poubelles, seaux.
💧 *Rafraîchissements et eau prévus sur place.*

🤝 *« Kellé moo ñu ñoor ! »* Mobilisons-nous massivement pour notre terroir. Merci de confirmer votre présence par retour de message.

*Le Bureau Exécutif de l’AJPK* 🇸🇳
🌐 https://ajpk.sn`
    },
    {
      id: 'reunion_generale',
      title: '📢 Réunion Générale AJPK',
      tag: 'Vie associative',
      content: `🌿 *ASSOCIATION DE LA JEUNESSE POLYVALENTE DE KELLÉ (AJPK)* 🌿
📢 *CONVOCATION : RÉUNION GÉNÉRALE DES MEMBRES*

Chers adhérents,

Vous êtes conviés à la prochaine réunion générale de l'AJPK afin d'échanger sur les projets en cours, les bilans d'activités et les prochaines actions communautaires.

🗓 *Date :* Samedi prochain
⏰ *Heure :* 17h00
📍 *Lieu :* Siège AJPK / Kellé Centre

Votre présence et vos contributions sont précieuses pour la réussite de notre mission commune.

*Le Bureau Exécutif AJPK*`
    },
    {
      id: 'cotisation_rappel',
      title: '💳 Rappel Cotisation (1 050 FCFA)',
      tag: 'Finance & Adhésion',
      content: `🌿 *ASSOCIATION DE LA JEUNESSE POLYVALENTE DE KELLÉ (AJPK)* 🌿
💳 *APPEL À LA COTISATION MENSUELLE*

Cher(e) membre de l'AJPK,

Nous vous rappelons que le règlement de votre cotisation mensuelle (1 050 FCFA) permet de financer nos actions sur le terrain (santé, éducation, formations gratuites et projets jeunesse).

📲 Vous pouvez régler facilement par Wave ou Orange Money directement sur notre plateforme sécurisée :
👉 https://ajpk.sn/admin/cotisations

Merci pour votre fidélité et votre engagement pour Kellé ! 🇸🇳`
    },
    {
      id: 'personnalise',
      title: '✍️ Message Libre',
      tag: 'Sur-mesure',
      content: `🌿 *ASSOCIATION DE LA JEUNESSE POLYVALENTE DE KELLÉ (AJPK)* 🌿

[Écrivez votre message ici...]

*Le Bureau Exécutif AJPK*`
    }
  ], []);

  const [selectedTemplateId, setSelectedTemplateId] = useState('nettoyage_maternelle');
  const [message, setMessage] = useState(templates[0].content);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [copiedNumbers, setCopiedNumbers] = useState(false);
  const [searchMember, setSearchMember] = useState('');
  const [sentMembers, setSentMembers] = useState<Record<string, boolean>>({});

  // Nettoyage et normalisation des numéros pour le Sénégal
  const cleanPhoneNumber = (rawPhone?: string): string => {
    if (!rawPhone) return '';
    let digits = rawPhone.replace(/[^0-9]/g, '');
    if (digits.startsWith('00221')) digits = digits.slice(2);
    if (!digits.startsWith('221') && (digits.length === 9 || digits.length === 8)) {
      digits = '221' + digits;
    }
    return digits;
  };

  // Filtrer les membres avec un numéro de téléphone valide
  const membersWithPhone = useMemo(() => {
    return members
      .map((m) => {
        const cleaned = cleanPhoneNumber(m.phone);
        return { ...m, cleanedPhone: cleaned };
      })
      .filter((m) => m.cleanedPhone.length >= 9);
  }, [members]);

  // Tous les numéros uniques au format international
  const allPhoneNumbers = useMemo(() => {
    const set = new Set<string>();
    membersWithPhone.forEach((m) => {
      if (m.cleanedPhone) set.add(`+${m.cleanedPhone}`);
    });
    return Array.from(set);
  }, [membersWithPhone]);

  // Changer de modèle
  const handleSelectTemplate = (tmplId: string) => {
    setSelectedTemplateId(tmplId);
    const tmpl = templates.find((t) => t.id === tmplId);
    if (tmpl) setMessage(tmpl.content);
  };

  // Copier le message
  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 3000);
    } catch {
      // Fallback
    }
  };

  // Copier tous les numéros
  const handleCopyNumbers = async () => {
    try {
      await navigator.clipboard.writeText(allPhoneNumbers.join(', '));
      setCopiedNumbers(true);
      setTimeout(() => setCopiedNumbers(false), 3000);
    } catch {
      // Fallback
    }
  };

  // Marquer comme envoyé
  const toggleSent = (memberId: string) => {
    setSentMembers((prev) => ({
      ...prev,
      [memberId]: !prev[memberId]
    }));
  };

  // Membres filtrés pour la liste individuelle
  const filteredMembersList = membersWithPhone.filter((m) => {
    const fullName = `${m.first_name} ${m.last_name}`.toLowerCase();
    const q = searchMember.toLowerCase();
    return fullName.includes(q) || m.cleanedPhone.includes(q) || m.member_number?.toLowerCase().includes(q);
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col my-auto">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                Diffusion WhatsApp AJPK
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold border border-emerald-500/30">
                  {membersWithPhone.length} contacts
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Informer tous les membres d’un coup (École Maternelle de Kellé, événements, rappels).
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corps du modal */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
          
          {/* Sélection des modèles */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 block">
              1. Choisir le modèle de message
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {templates.map((tmpl) => {
                const isSelected = selectedTemplateId === tmpl.id;
                return (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => handleSelectTemplate(tmpl.id)}
                    className={`p-3 rounded-2xl text-left border transition flex flex-col justify-between ${
                      isSelected
                        ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-lg shadow-emerald-950/40'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <p className="font-extrabold text-xs">{tmpl.title}</p>
                      <span className="text-[10px] text-slate-400 font-medium">{tmpl.tag}</span>
                    </div>
                    {isSelected && (
                      <span className="mt-2 text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Sélectionné
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Éditeur de message */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                2. Contenu du message WhatsApp
              </label>
              <span className="text-[11px] text-slate-400">
                {message.length} caractères • Formaté pour WhatsApp (*gras*, _italique_)
              </span>
            </div>
            <textarea
              rows={9}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500 transition leading-relaxed resize-y"
              placeholder="Écrivez le message à diffuser..."
            />
          </div>

          {/* Actions groupées principales */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="text-xs font-black uppercase text-emerald-400 tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> 3. Méthodes d’envoi « D’un seul coup »
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Option 1: Copier le message */}
              <button
                type="button"
                onClick={handleCopyMessage}
                className={`px-4 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
                  copiedMessage
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                {copiedMessage ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedMessage ? 'Message Copié !' : '1. Copier le Message'}</span>
              </button>

              {/* Option 2: Copier les numéros pour Liste de diffusion */}
              <button
                type="button"
                onClick={handleCopyNumbers}
                className={`px-4 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
                  copiedNumbers
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
                title="Copier tous les numéros séparés par une virgule pour créer une Liste de Diffusion WhatsApp"
              >
                {copiedNumbers ? <Check className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                <span>{copiedNumbers ? 'Numéros Copiés !' : `2. Copier les ${allPhoneNumbers.length} numéros`}</span>
              </button>

              {/* Option 3: Partager directement sur WhatsApp Web ou Mobile */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition"
              >
                <Send className="w-4 h-4" />
                <span>3. Ouvrir WhatsApp (Partage)</span>
              </a>
            </div>

            <div className="p-3 bg-emerald-950/30 border border-emerald-500/20 rounded-xl text-[11px] text-emerald-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Astuce « Envoi d’un coup sans spam » :</strong>  
                Ouvrez WhatsApp sur votre smartphone &gt; Cliquez sur les 3 points &gt; <em>« Nouvelle diffusion »</em> &gt; Sélectionnez vos membres et collez le message. Chacun recevra le message en privé en quelques secondes !
              </div>
            </div>
          </div>

          {/* Section d'envoi individuel personnalisé avec bouton 1-clic */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  4. Ou envoyer individuellement en 1 clic
                </h4>
                <p className="text-[11px] text-slate-400">
                  Ouvre directement la conversation WhatsApp avec le message pré-rempli pour le membre.
                </p>
              </div>

              <div className="flex items-center gap-2 p-2 bg-slate-950 rounded-xl border border-slate-800 w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 ml-1" />
                <input
                  type="text"
                  placeholder="Chercher un membre..."
                  value={searchMember}
                  onChange={(e) => setSearchMember(e.target.value)}
                  className="bg-transparent text-xs text-white focus:outline-none w-full"
                />
              </div>
            </div>

            <div className="bg-slate-950 rounded-2xl border border-slate-800 divide-y divide-slate-850 max-h-56 overflow-y-auto">
              {filteredMembersList.map((member) => {
                const isSent = !!sentMembers[member.id];
                const directUrl = `https://wa.me/${member.cleanedPhone}?text=${encodeURIComponent(
                  `Salam aleykoum ${member.first_name},\n\n${message}`
                )}`;

                return (
                  <div
                    key={member.id}
                    className="p-2.5 sm:px-4 flex items-center justify-between gap-3 hover:bg-slate-900/60 transition"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {member.avatar_url ? (
                        <img
                          src={member.avatar_url}
                          alt={member.first_name}
                          className="w-8 h-8 rounded-lg object-cover ring-1 ring-emerald-500/40"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 font-extrabold text-[10px] flex items-center justify-center border border-emerald-500/30">
                          {member.first_name?.[0] || ''}{member.last_name?.[0] || ''}
                        </div>
                      )}
                      <div className="min-w-0 truncate">
                        <p className="text-xs font-bold text-white truncate">
                          {member.first_name} {member.last_name}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          +{member.cleanedPhone} • {member.member_number}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => toggleSent(member.id)}
                        className={`p-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition ${
                          isSent
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                        title="Marquer comme déjà envoyé"
                      >
                        <CheckCircle2 className={`w-3.5 h-3.5 ${isSent ? 'text-emerald-400' : 'text-slate-500'}`} />
                        <span className="hidden sm:inline">{isSent ? 'Envoyé' : 'Marquer'}</span>
                      </button>

                      <a
                        href={directUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                          setSentMembers((prev) => ({ ...prev, [member.id]: true }));
                        }}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Envoyer</span>
                      </a>
                    </div>
                  </div>
                );
              })}

              {filteredMembersList.length === 0 && (
                <div className="p-6 text-center text-xs text-slate-500">
                  Aucun membre trouvé avec ce nom ou numéro.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Footer Modal */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            AJPK Plateforme • Module de Communication WhatsApp
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
}
