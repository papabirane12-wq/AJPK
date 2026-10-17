'use client';

import { useState, useEffect, useMemo } from 'react';
import { Profile } from '@/types';
import { 
  MessageCircle, 
  Copy, 
  Check, 
  Send, 
  Users, 
  Search, 
  Sparkles, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Download, 
  Share2, 
  RefreshCw, 
  Loader2,
  AlertCircle,
  Smartphone,
  ExternalLink,
  Printer
} from 'lucide-react';
import { PrintMembersModal } from '@/components/admin/PrintMembersModal';

export default function AdminCommunicationPage() {
  const [members, setMembers] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [copiedNumbers, setCopiedNumbers] = useState(false);
  const [searchMember, setSearchMember] = useState('');
  const [sentMembers, setSentMembers] = useState<Record<string, boolean>>({});
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Paramètres personnalisables de l'événement
  const [eventDate, setEventDate] = useState('Dimanche 25 Octobre 2026');
  const [eventTime, setEventTime] = useState('08h30 précise');
  const [eventLocation, setEventLocation] = useState('École Maternelle de Kellé');

  const templates = useMemo(() => [
    {
      id: 'nettoyage_maternelle',
      title: '🧹 Journée Nettoyage École Maternelle',
      badge: 'Action Prioritaire',
      getTemplate: (date: string, time: string, loc: string) => `🌿 *ASSOCIATION DE LA JEUNESSE POLYVALENTE DE KELLÉ (AJPK)* 🌿
📢 *COMMUNIQUÉ OFFICIEL : GRANDE JOURNÉE CITOYENNE DE NETTOYAGE (SET-SETAL)*

Chers membres, chers frères et sœurs de Kellé,

Dans le cadre de nos actions citoyennes et de notre engagement pour l'éducation et le bien-être de nos enfants, l'AJPK organise une *grande journée de nettoyage et d'assainissement à l'École Maternelle de Kellé*.

Nos tout-petits méritent un cadre d'apprentissage sain, propre et agréable. La participation active de chacun de nous est essentielle pour la réussite de cette noble initiative !

🗓 *Date :* ${date}
⏰ *Heure :* ${time}
📍 *Lieu :* ${loc}

🧤 *Matériel souhaité :* Balais, râteaux, pelles, brouettes, sacs poubelles, seaux.
💧 *Rafraîchissements et eau prévus sur place.*

🤝 *« Kellé moo ñu ñoor ! »* Mobilisons-nous massivement pour notre terroir. Merci de confirmer votre présence par retour de message.

*Le Bureau Exécutif de l’AJPK* 🇸🇳
🌐 https://ajpk.sn`
    },
    {
      id: 'reunion_generale',
      title: '📢 Réunion Générale des Membres',
      badge: 'Vie Associative',
      getTemplate: (date: string, time: string, loc: string) => `🌿 *ASSOCIATION DE LA JEUNESSE POLYVALENTE DE KELLÉ (AJPK)* 🌿
📢 *CONVOCATION : RÉUNION GÉNÉRALE DES MEMBRES*

Chers adhérents,

Vous êtes chaleureusement conviés à la prochaine réunion générale de l'AJPK afin d'échanger sur nos projets en cours, les bilans d'activités et les prochaines actions pour la commune de Kellé.

🗓 *Date :* ${date}
⏰ *Heure :* ${time}
📍 *Lieu :* ${loc}

Votre présence et vos contributions sont précieuses.
*Le Bureau Exécutif AJPK*`
    },
    {
      id: 'cotisations_rappel',
      title: '💳 Rappel des Cotisations (1 050 FCFA)',
      badge: 'Trésorerie',
      getTemplate: () => `🌿 *ASSOCIATION DE LA JEUNESSE POLYVALENTE DE KELLÉ (AJPK)* 🌿
💳 *APPEL À LA COTISATION MENSUELLE*

Cher(e) membre de l'AJPK,

Nous vous rappelons que le versement de votre cotisation mensuelle de *1 050 FCFA* permet de financer nos actions de solidarité, de santé et les formations pour la jeunesse de Kellé.

📲 Règlement instantané par Wave ou Orange Money :
👉 https://ajpk.sn/admin/cotisations

Merci pour votre engagement constant ! 🇸🇳`
    },
    {
      id: 'personnalise',
      title: '✍️ Message Personnalisé',
      badge: 'Texte Libre',
      getTemplate: () => `🌿 *ASSOCIATION DE LA JEUNESSE POLYVALENTE DE KELLÉ (AJPK)* 🌿

[Écrivez votre message ici...]

*Le Bureau Exécutif AJPK*`
    }
  ], []);

  const [selectedTemplateId, setSelectedTemplateId] = useState('nettoyage_maternelle');
  const [customText, setCustomText] = useState(
    templates[0].getTemplate(eventDate, eventTime, eventLocation)
  );

  // Charger les membres depuis l'API
  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/members');
      const data = await res.json();
      if (data.success && Array.isArray(data.members)) {
        setMembers(data.members);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Nettoyage téléphone
  const cleanPhone = (raw?: string): string => {
    if (!raw) return '';
    let digits = raw.replace(/[^0-9]/g, '');
    if (digits.startsWith('00221')) digits = digits.slice(2);
    if (!digits.startsWith('221') && (digits.length === 9 || digits.length === 8)) {
      digits = '221' + digits;
    }
    return digits;
  };

  const membersWithPhone = useMemo(() => {
    return members
      .map((m) => ({ ...m, cleanedPhone: cleanPhone(m.phone) }))
      .filter((m) => m.cleanedPhone.length >= 9);
  }, [members]);

  const allNumbersList = useMemo(() => {
    const list = Array.from(new Set(membersWithPhone.map((m) => `+${m.cleanedPhone}`)));
    return list;
  }, [membersWithPhone]);

  // Mettre à jour le message quand le modèle ou les paramètres changent
  const handleTemplateChange = (tmplId: string) => {
    setSelectedTemplateId(tmplId);
    const tmpl = templates.find((t) => t.id === tmplId);
    if (tmpl) {
      setCustomText(tmpl.getTemplate(eventDate, eventTime, eventLocation));
    }
  };

  const updateEventParam = (field: 'date' | 'time' | 'location', val: string) => {
    let newDate = eventDate;
    let newTime = eventTime;
    let newLoc = eventLocation;

    if (field === 'date') {
      newDate = val;
      setEventDate(val);
    } else if (field === 'time') {
      newTime = val;
      setEventTime(val);
    } else if (field === 'location') {
      newLoc = val;
      setEventLocation(val);
    }

    const tmpl = templates.find((t) => t.id === selectedTemplateId);
    if (tmpl) {
      setCustomText(tmpl.getTemplate(newDate, newTime, newLoc));
    }
  };

  // Copier le message
  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(customText);
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 3000);
    } catch {
      // Ignorer
    }
  };

  // Copier les numéros
  const handleCopyNumbers = async () => {
    try {
      await navigator.clipboard.writeText(allNumbersList.join(', '));
      setCopiedNumbers(true);
      setTimeout(() => setCopiedNumbers(false), 3000);
    } catch {
      // Ignorer
    }
  };

  // Télécharger un fichier de contacts (.vcf) pour importer tous les membres dans le téléphone
  const handleDownloadVCF = () => {
    let vcfContent = '';
    membersWithPhone.forEach((m) => {
      vcfContent += `BEGIN:VCARD\r\nVERSION:3.0\r\nFN:AJPK ${m.first_name} ${m.last_name}\r\nTEL;TYPE=CELL:+${m.cleanedPhone}\r\nNOTE:Adhérent ${m.member_number}\r\nEND:VCARD\r\n`;
    });

    const blob = new Blob([vcfContent], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Contacts_Membres_AJPK_${new Date().toISOString().split('T')[0]}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredMembers = membersWithPhone.filter((m) => {
    const q = searchMember.toLowerCase();
    const fullName = `${m.first_name} ${m.last_name}`.toLowerCase();
    return fullName.includes(q) || m.cleanedPhone.includes(q) || m.member_number?.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-slate-800 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 w-max">
            <MessageCircle className="w-3 h-3 text-emerald-400" /> Centre de Communication WhatsApp
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-2">
            Diffusion Groupée aux Membres AJPK
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Diffusez des communiqués officiels, alertes citoyennes (nettoyage école maternelle, réunions) et notifications à tous les membres en quelques secondes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchMembers}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-2 border border-slate-700 transition"
            title="Rafraîchir la liste des membres"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
            <span className="hidden sm:inline">Actualiser</span>
          </button>

          <button
            onClick={handleDownloadVCF}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 border border-slate-700 shadow transition"
            title="Télécharger tous les contacts des membres au format .VCF pour votre téléphone"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Exporter Contacts (.VCF)</span>
          </button>

          <button
            onClick={() => setIsPrintModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition"
            title="Imprimer la liste officielle des membres (Prénom et Nom uniquement)"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer Liste (Noms)</span>
          </button>
        </div>
      </div>

      {/* Cartes Métriques */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Contacts WhatsApp</span>
          <p className="text-2xl font-black text-white">{membersWithPhone.length}</p>
          <p className="text-[10px] text-emerald-400">Numéros vérifiés (+221)</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/20 space-y-1">
          <span className="text-[10px] font-bold text-emerald-400 uppercase">Campagne Active</span>
          <p className="text-sm font-black text-white truncate">Nettoyage École Maternelle</p>
          <p className="text-[10px] text-slate-400">Prêt pour envoi immédiat</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Taux de Couverture</span>
          <p className="text-2xl font-black text-emerald-400">100%</p>
          <p className="text-[10px] text-slate-500">Membres joignables</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Canaux Autorisés</span>
          <p className="text-sm font-black text-white">Diffusion & Direct</p>
          <p className="text-[10px] text-slate-400">WhatsApp Web & Mobile</p>
        </div>
      </div>

      {/* Choix des Modèles */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          1. Sélectionner l’annonce à envoyer
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {templates.map((tmpl) => {
            const isSelected = selectedTemplateId === tmpl.id;
            return (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => handleTemplateChange(tmpl.id)}
                className={`p-4 rounded-2xl text-left border transition flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-xl shadow-emerald-950/40'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/80'
                }`}
              >
                <div>
                  <span className="text-[9px] uppercase font-black px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {tmpl.badge}
                  </span>
                  <p className="font-black text-sm mt-2">{tmpl.title}</p>
                </div>
                {isSelected ? (
                  <span className="mt-3 text-[11px] font-extrabold text-emerald-400 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" /> Modèle Sélectionné
                  </span>
                ) : (
                  <span className="mt-3 text-[11px] text-slate-500">Cliquer pour charger</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Éditeur et Simulateur WhatsApp côte à côte */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Colonne Gauche : Éditeur et Variables (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                2. Personnalisation & Réglages
              </h3>
              <span className="text-[11px] font-mono text-slate-400">
                {customText.length} car.
              </span>
            </div>

            {/* Champs rapides pour événements si le modèle nettoyage ou réunion est actif */}
            {(selectedTemplateId === 'nettoyage_maternelle' || selectedTemplateId === 'reunion_generale') && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1 mb-1">
                    <Calendar className="w-3 h-3 text-emerald-400" /> Date
                  </label>
                  <input
                    type="text"
                    value={eventDate}
                    onChange={(e) => updateEventParam('date', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1 mb-1">
                    <Clock className="w-3 h-3 text-emerald-400" /> Heure
                  </label>
                  <input
                    type="text"
                    value={eventTime}
                    onChange={(e) => updateEventParam('time', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1 mb-1">
                    <MapPin className="w-3 h-3 text-emerald-400" /> Lieu
                  </label>
                  <input
                    type="text"
                    value={eventLocation}
                    onChange={(e) => updateEventParam('location', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}

            {/* Zone de texte modifiable */}
            <div>
              <textarea
                rows={11}
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500 transition leading-relaxed resize-y"
                placeholder="Tapez votre message..."
              />
            </div>

            {/* Actions groupées d'envoi */}
            <div className="pt-2 border-t border-slate-800/80 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className={`px-4 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
                    copiedMessage
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  {copiedMessage ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedMessage ? 'Message Copié !' : 'Copier Message'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyNumbers}
                  className={`px-4 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
                    copiedNumbers
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  {copiedNumbers ? <Check className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                  <span>{copiedNumbers ? 'Numéros Copiés !' : `Copier ${allNumbersList.length} numéros`}</span>
                </button>

                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(customText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 transition"
                >
                  <Send className="w-4 h-4" />
                  <span>Diffuser WhatsApp</span>
                </a>
              </div>

              <div className="p-3 bg-emerald-950/30 border border-emerald-500/20 rounded-2xl text-[11px] text-emerald-300 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="leading-snug">
                  <strong>Méthode Recommandée « Diffusion sans spam » :</strong>  
                  Cliquez sur <em>« Copier 20 numéros »</em>, ouvrez WhatsApp sur votre mobile &gt; <em>Nouvelle diffusion</em> &gt; sélectionnez vos contacts &gt; collez le message. Chaque membre reçoit le message en privé en un instant !
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Colonne Droite : Simulateur WhatsApp (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-emerald-400" /> Aperçu Réaliste WhatsApp
              </span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Mode Membre
              </span>
            </div>

            {/* Mockup Smartphone WhatsApp */}
            <div className="bg-[#0b141a] rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
              {/* Header WhatsApp Bar */}
              <div className="bg-[#202c33] p-3 flex items-center justify-between text-white border-b border-[#2a3942]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center ring-2 ring-emerald-400/40">
                    AJPK
                  </div>
                  <div>
                    <p className="text-xs font-bold leading-tight">AJPK Officiel (Kellé)</p>
                    <p className="text-[9px] text-[#8696a0]">En ligne • Association</p>
                  </div>
                </div>
              </div>

              {/* Chat Canvas */}
              <div className="p-3 sm:p-4 bg-[radial-gradient(#111b21_1px,transparent_1px)] [background-size:16px_16px] bg-[#0b141a] min-h-[360px] max-h-[440px] overflow-y-auto flex flex-col justify-end">
                <div className="p-3.5 rounded-2xl rounded-tr-none bg-[#005c4b] text-white text-[11px] leading-relaxed max-w-[94%] ml-auto shadow-md space-y-1.5 border border-[#02735e]/30">
                  <div className="whitespace-pre-wrap font-sans">
                    {customText}
                  </div>
                  <div className="flex items-center justify-end gap-1 text-[9px] text-emerald-200/80 pt-1">
                    <span>11:20</span>
                    <span className="text-sky-300 font-bold">✓✓</span>
                  </div>
                </div>
              </div>

              {/* Bottom dummy input bar */}
              <div className="bg-[#202c33] p-2.5 flex items-center gap-2 text-[#8696a0]">
                <div className="flex-1 bg-[#2a3942] rounded-full px-3 py-1.5 text-[11px] text-slate-400">
                  Message...
                </div>
                <div className="w-7 h-7 rounded-full bg-[#00a884] text-white flex items-center justify-center">
                  <Send className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Répertoire interactif : Envoi direct 1 par 1 */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              3. Répertoire des Membres & Envoi Personnalisé en 1 Clic
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Envoyez le message personnalisé directement dans la boîte WhatsApp de chaque adhérent.
            </p>
          </div>

          <div className="flex items-center gap-2 p-2.5 bg-slate-950 rounded-2xl border border-slate-800 w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 ml-1 shrink-0" />
            <input
              type="text"
              placeholder="Rechercher nom, n° AJPK, tél..."
              value={searchMember}
              onChange={(e) => setSearchMember(e.target.value)}
              className="bg-transparent text-xs text-white focus:outline-none w-full"
            />
          </div>
        </div>

        <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden divide-y divide-slate-850">
          <div className="p-3 bg-slate-850/60 text-[10px] uppercase font-bold text-slate-400 grid grid-cols-12 gap-2">
            <div className="col-span-5 sm:col-span-4">Adhérent</div>
            <div className="col-span-3 sm:col-span-3">N° WhatsApp</div>
            <div className="col-span-4 sm:col-span-5 text-right">Actions Directes</div>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-850">
            {filteredMembers.map((member) => {
              const isSent = !!sentMembers[member.id];
              const directWhatsAppUrl = `https://wa.me/${member.cleanedPhone}?text=${encodeURIComponent(
                `Salam aleykoum ${member.first_name},\n\n${customText}`
              )}`;

              return (
                <div
                  key={member.id}
                  className="p-3 sm:px-4 grid grid-cols-12 gap-2 items-center hover:bg-slate-900/50 transition"
                >
                  <div className="col-span-5 sm:col-span-4 flex items-center gap-2.5 min-w-0">
                    {member.avatar_url ? (
                      <img
                        src={member.avatar_url}
                        alt={member.first_name}
                        className="w-8 h-8 rounded-xl object-cover ring-1 ring-emerald-500/40 shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-brand-600 text-white font-extrabold text-[10px] flex items-center justify-center shrink-0">
                        {member.first_name?.[0] || ''}{member.last_name?.[0] || ''}
                      </div>
                    )}
                    <div className="min-w-0 truncate">
                      <p className="text-xs font-bold text-white truncate">
                        {member.first_name} {member.last_name}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono truncate">
                        {member.member_number}
                      </p>
                    </div>
                  </div>

                  <div className="col-span-3 sm:col-span-3 font-mono text-xs font-bold text-emerald-400 truncate">
                    +{member.cleanedPhone}
                  </div>

                  <div className="col-span-4 sm:col-span-5 flex items-center justify-end gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setSentMembers((prev) => ({ ...prev, [member.id]: !prev[member.id] }))}
                      className={`px-2 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition ${
                        isSent
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                      title="Marquer comme envoyé"
                    >
                      <CheckCircle2 className={`w-3.5 h-3.5 ${isSent ? 'text-emerald-400' : 'text-slate-500'}`} />
                      <span className="hidden sm:inline">{isSent ? 'Envoyé' : 'Marquer'}</span>
                    </button>

                    <a
                      href={directWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setSentMembers((prev) => ({ ...prev, [member.id]: true }))}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Envoyer WhatsApp</span>
                      <span className="sm:hidden">Envoyer</span>
                    </a>
                  </div>
                </div>
              );
            })}

            {filteredMembers.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-500">
                Aucun membre trouvé avec ce critère de recherche.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Modal d'Impression de la Liste des Membres (Prénom & Nom) */}
      <PrintMembersModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        members={members}
      />

    </div>
  );
}
