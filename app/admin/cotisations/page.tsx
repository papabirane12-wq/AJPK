'use client';

import { useState, useMemo } from 'react';
import { 
  getCotisations, 
  getCotisationsSummary, 
  getMembers, 
  addCotisation, 
  markCotisationPaid, 
  deleteCotisation, 
  resetCotisationsToInscriptions 
} from '@/lib/data/store';
import { Cotisation, Profile } from '@/types';
import { formatFCFA, formatDateFr, getStatusBadgeColor } from '@/lib/utils/formatters';
import { 
  Wallet, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  Smartphone, 
  PlusCircle, 
  Search, 
  Filter, 
  Download, 
  RotateCcw, 
  Trash2, 
  Printer, 
  X, 
  FileText, 
  ShieldCheck,
  Calendar,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function AdminCotisationsPage() {
  const [cotisations, setCotisations] = useState<Cotisation[]>(() => getCotisations());
  const [members, setMembers] = useState<Profile[]>(() => getMembers());
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'adhesion' | 'autre'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paye' | 'en_attente'>('all');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [receiptCotisation, setReceiptCotisation] = useState<Cotisation | null>(null);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Form state
  const [newCot, setNewCot] = useState({
    member_number: '',
    amount_fcfa: 1000,
    period: 'Cotisation Mensuelle Novembre 2026',
    method: 'Wave Sénégal',
    status: 'paye' as 'paye' | 'en_attente'
  });

  const refreshData = () => {
    setCotisations(getCotisations());
    setMembers(getMembers());
  };

  const showNotification = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  const summary = useMemo(() => {
    return getCotisationsSummary();
  }, [cotisations]);

  // Filtered cotisations
  const filteredCotisations = useMemo(() => {
    return cotisations.filter((c) => {
      const matchesSearch = 
        c.member_name.toLowerCase().includes(search.toLowerCase()) ||
        c.member_number.toLowerCase().includes(search.toLowerCase()) ||
        c.period.toLowerCase().includes(search.toLowerCase()) ||
        (c.method && c.method.toLowerCase().includes(search.toLowerCase()));

      const isAdhesion = 
        c.id.startsWith('cot-adhesion-') || 
        c.period.toLowerCase().includes('adhésion') || 
        c.period.toLowerCase().includes('adhesion') || 
        c.amount_fcfa === 1050;

      const matchesType = 
        typeFilter === 'all' ? true :
        typeFilter === 'adhesion' ? isAdhesion : !isAdhesion;

      const matchesStatus = 
        statusFilter === 'all' ? true : c.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [cotisations, search, typeFilter, statusFilter]);

  const handleMarkPaid = (id: string) => {
    markCotisationPaid(id, 'Wave Sénégal');
    refreshData();
    showNotification('Cotisation validée avec succès !');
  };

  const handleDelete = (id: string, memberName: string) => {
    if (confirm(`Confirmez-vous la suppression de cette cotisation pour ${memberName} ?`)) {
      deleteCotisation(id);
      refreshData();
      showNotification('Cotisation supprimée de l’historique.');
    }
  };

  const handleResetToInscriptions = () => {
    if (confirm('Voulez-vous purger toutes les cotisations fictives et resynchroniser strictement avec la liste des membres inscrits (1 050 FCFA / inscription) ?')) {
      const synced = resetCotisationsToInscriptions();
      setCotisations(synced);
      showNotification('Toutes les cotisations ont été synchronisées avec succès avec les inscriptions !');
    }
  };

  const handleCreateCotisation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCot.member_number) {
      alert('Veuillez sélectionner un membre.');
      return;
    }

    const selectedMember = members.find(m => m.member_number === newCot.member_number);
    if (!selectedMember) {
      alert('Membre introuvable.');
      return;
    }

    addCotisation({
      member_id: selectedMember.id,
      member_name: `${selectedMember.first_name} ${selectedMember.last_name}`.trim(),
      member_number: selectedMember.member_number,
      amount_fcfa: Number(newCot.amount_fcfa),
      period: newCot.period,
      status: newCot.status,
      method: newCot.method,
      payment_date: new Date().toISOString().split('T')[0]
    });

    refreshData();
    setIsAddModalOpen(false);
    showNotification(`Nouvelle cotisation de ${formatFCFA(newCot.amount_fcfa)} enregistrée pour ${selectedMember.first_name} ${selectedMember.last_name}.`);
  };

  const handleExportCSV = () => {
    const headers = ['ID,Membre,Numero_Adherent,Motif_Periode,Montant_FCFA,Moyen_Paiement,Date,Statut\n'];
    const rows = filteredCotisations.map(c => 
      `"${c.id}","${c.member_name}","${c.member_number}","${c.period}",${c.amount_fcfa},"${c.method || ''}","${c.payment_date || ''}","${c.status}"`
    );
    const blob = new Blob([...headers, ...rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `AJPK_Cotisations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Toast Notification */}
      {notificationMsg && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-emerald-600 text-white shadow-2xl flex items-center gap-3 border border-emerald-400 animate-slide-up">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span className="text-xs font-bold">{notificationMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 border border-slate-800 shadow-2xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Trésorerie & Comptabilité AJPK
            </span>
            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Wave / Orange Money Sénégal
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-3">Suivi des Cotisations & Adhésions</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Consultez les cotisations réelles validées issues des inscriptions des adhérents (1 050 FCFA par adhésion) et suivez la collecte en temps réel.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleResetToInscriptions}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition flex items-center gap-2"
            title="Supprime les données de test et recalcule les cotisations d'après les inscriptions"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" /> Synchroniser Inscriptions
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-emerald-400" /> Exporter CSV
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-extrabold shadow-lg transition flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" /> Enregistrer un Versement
          </button>
        </div>
      </div>

      {/* KPI Financial Cards (Somme Totale & Détails) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Encaissé */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Somme Totale Encaissée</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-emerald-400 font-mono tracking-tight">
              {formatFCFA(summary.totalAmount)}
            </div>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span><strong>{summary.totalPaidCount}</strong> versement(s) validé(s)</span>
            </p>
          </div>
        </div>

        {/* Total Adhésions (Inscriptions) */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Frais d’Adhésion (Inscriptions)</span>
            <div className="w-10 h-10 rounded-2xl bg-brand-500/20 text-brand-400 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-white font-mono tracking-tight">
              {formatFCFA(summary.totalAdhesionAmount)}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              <strong>{summary.adhesionCount}</strong> adhérents inscrits (× 1 050 FCFA)
            </p>
          </div>
        </div>

        {/* Membres à Jour */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Membres Officiels AJPK</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-white font-mono tracking-tight">
              {members.length} Adhérents
            </div>
            <p className="text-[11px] text-emerald-400 mt-1 font-semibold flex items-center gap-1">
              <span>100% cartes numériques générées</span>
            </p>
          </div>
        </div>

        {/* Autres Cotisations / En attente */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Cotisations Périodiques</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-white font-mono tracking-tight">
              {formatFCFA(summary.totalAmount - summary.totalAdhesionAmount)}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {summary.totalCount - summary.adhesionCount} cotisation(s) mensuelle(s)
            </p>
          </div>
        </div>

      </div>

      {/* Info notice: Cotisations basées sur les inscriptions */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4 text-xs text-slate-300">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-white">Principe de synchronisation automatique :</p>
            <p className="text-slate-400 text-[11px]">
              Chaque inscription d’un membre enregistre automatiquement son versement officiel de <strong>1 050 FCFA</strong> (Frais d’Adhésion & Carte Membre). La somme totale affichée reflète le montant exact des inscriptions validées.
            </p>
          </div>
        </div>
        <div className="hidden sm:block text-right font-mono font-black text-emerald-400 text-sm">
          Total : {formatFCFA(summary.totalAmount)}
        </div>
      </div>

      {/* Search & Filters Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        
        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/80 rounded-xl border border-slate-700/80 w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher membre, n° AJPK, période..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="bg-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 border border-slate-700 focus:outline-none"
            >
              <option value="all">Tous les motifs</option>
              <option value="adhesion">Adhésions (Inscriptions)</option>
              <option value="autre">Cotisations Mensuelles</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 border border-slate-700 focus:outline-none"
            >
              <option value="all">Tous les statuts</option>
              <option value="paye">Payé / Validé</option>
              <option value="en_attente">En attente</option>
            </select>
          </div>

          <span className="text-xs text-slate-400 font-semibold px-2">
            {filteredCotisations.length} résultat(s)
          </span>
        </div>

      </div>

      {/* Main Table */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 min-w-[760px]">
            <thead className="bg-slate-800/90 text-slate-400 uppercase font-extrabold text-[10px] tracking-wider border-b border-slate-700">
              <tr>
                <th className="px-6 py-4">Membre</th>
                <th className="px-6 py-4">N° Adhérent</th>
                <th className="px-6 py-4">Motif / Période</th>
                <th className="px-6 py-4">Montant</th>
                <th className="px-6 py-4">Moyen de Paiement</th>
                <th className="px-6 py-4">Date Règlement</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredCotisations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                    <CreditCard className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                    Aucune cotisation trouvée pour ces critères de recherche.
                  </td>
                </tr>
              ) : (
                filteredCotisations.map((cot) => {
                  const isAdhesion = 
                    cot.id.startsWith('cot-adhesion-') || 
                    cot.period.toLowerCase().includes('adhésion') || 
                    cot.period.toLowerCase().includes('adhesion') || 
                    cot.amount_fcfa === 1050;

                  return (
                    <tr key={cot.id} className="hover:bg-slate-800/50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-brand-900/60 text-brand-300 font-bold flex items-center justify-center text-xs ring-1 ring-brand-500/30">
                            {cot.member_name ? cot.member_name.charAt(0) : 'M'}
                          </div>
                          <div>
                            <p className="font-extrabold text-white text-xs">{cot.member_name}</p>
                            <span className="text-[10px] text-slate-400">Adhérent AJPK</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-amber-400 px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px]">
                          {cot.member_number}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                          isAdhesion 
                            ? 'bg-brand-500/10 text-brand-300 border border-brand-500/30' 
                            : 'bg-blue-500/10 text-blue-300 border border-blue-500/30'
                        }`}>
                          {isAdhesion ? '✨ Adhésion & Inscription' : cot.period}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="font-mono font-extrabold text-emerald-400 text-sm">
                          {formatFCFA(cot.amount_fcfa)}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-slate-300">
                        <span className="inline-flex items-center gap-1.5 font-medium">
                          <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                          {cot.method || 'Wave / Orange Money'}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-slate-400">
                        {formatDateFr(cot.payment_date || '') || '10 Octobre 2026'}
                      </td>

                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border inline-flex items-center gap-1 ${getStatusBadgeColor(cot.status)}`}>
                          <CheckCircle2 className="w-3 h-3" />
                          {cot.status === 'paye' ? 'Validé ✓' : cot.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right space-x-2">
                        {cot.status !== 'paye' && (
                          <button
                            onClick={() => handleMarkPaid(cot.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] transition"
                          >
                            Valider
                          </button>
                        )}

                        <button
                          onClick={() => setReceiptCotisation(cot)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                          title="Voir le reçu de paiement"
                        >
                          <FileText className="w-4 h-4 text-emerald-400" />
                        </button>

                        <button
                          onClick={() => handleDelete(cot.id, cot.member_name)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition"
                          title="Supprimer la cotisation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {filteredCotisations.length > 0 && (
              <tfoot className="bg-slate-850 border-t border-slate-700 text-xs font-bold text-white">
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-right uppercase tracking-wider text-slate-400">
                    Sous-total Filtré :
                  </td>
                  <td className="px-6 py-4 font-mono font-black text-emerald-400 text-base">
                    {formatFCFA(
                      filteredCotisations.reduce((acc, c) => acc + (c.status === 'paye' ? c.amount_fcfa : 0), 0)
                    )}
                  </td>
                  <td colSpan={4} className="px-6 py-4 text-slate-400 text-[11px]">
                    {filteredCotisations.filter(c => c.status === 'paye').length} paiement(s) validé(s)
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* MODAL : Voir le Reçu Officiel */}
      {receiptCotisation && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl relative space-y-6">
            
            <button
              onClick={() => setReceiptCotisation(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Receipt Header */}
            <div className="text-center border-b border-slate-800 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">Reçu de Règlement AJPK</h3>
              <p className="text-[11px] text-slate-400 font-mono">
                RÉFÉRENCE : #{receiptCotisation.id.toUpperCase()}
              </p>
            </div>

            {/* Details */}
            <div className="space-y-3 text-xs bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Adhérent :</span>
                <span className="font-bold text-white">{receiptCotisation.member_name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">N° Membre :</span>
                <span className="font-mono font-bold text-amber-400">{receiptCotisation.member_number}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Motif :</span>
                <span className="font-bold text-white">{receiptCotisation.period}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Moyen de Paiement :</span>
                <span className="font-semibold text-emerald-400">{receiptCotisation.method || 'Wave Sénégal'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Date :</span>
                <span className="text-slate-200">{formatDateFr(receiptCotisation.payment_date || '') || '10 Octobre 2026'}</span>
              </div>
              <div className="flex justify-between py-2 text-sm font-extrabold">
                <span className="text-slate-300">Montant Réglé :</span>
                <span className="font-mono text-emerald-400 text-lg">{formatFCFA(receiptCotisation.amount_fcfa)}</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center text-[10px] text-emerald-300">
              Association des Jeunes Patriotes de Kelle — Commune de Kelle, Région de Thiès
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" /> Imprimer Reçu
              </button>
              <button
                onClick={() => setReceiptCotisation(null)}
                className="flex-1 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs"
              >
                Fermer
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL : Ajouter une Cotisation */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl relative space-y-6">
            
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="text-lg font-extrabold text-white">Enregistrer une Cotisation</h3>
              <p className="text-xs text-slate-400 mt-1">
                Attribuez un versement à un membre inscrit dans la base de données.
              </p>
            </div>

            <form onSubmit={handleCreateCotisation} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-slate-300 mb-1.5">Membre Adhérent *</label>
                <select
                  value={newCot.member_number}
                  onChange={(e) => setNewCot({ ...newCot, member_number: e.target.value })}
                  required
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Sélectionnez un membre inscrit...</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.member_number}>
                      {m.first_name} {m.last_name} ({m.member_number})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1.5">Montant en FCFA *</label>
                <input
                  type="number"
                  min="500"
                  step="50"
                  value={newCot.amount_fcfa}
                  onChange={(e) => setNewCot({ ...newCot, amount_fcfa: Number(e.target.value) })}
                  required
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1.5">Motif / Période *</label>
                <input
                  type="text"
                  value={newCot.period}
                  onChange={(e) => setNewCot({ ...newCot, period: e.target.value })}
                  required
                  placeholder="Ex: Cotisation Mensuelle Novembre 2026"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1.5">Moyen de Paiement *</label>
                <select
                  value={newCot.method}
                  onChange={(e) => setNewCot({ ...newCot, method: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Wave Sénégal">Wave Sénégal</option>
                  <option value="Orange Money">Orange Money</option>
                  <option value="Espèces / Trésorier">Espèces (Versement direct Trésorier)</option>
                  <option value="Virement Bancaire">Virement Bancaire</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1.5">Statut du Règlement</label>
                <select
                  value={newCot.status}
                  onChange={(e) => setNewCot({ ...newCot, status: e.target.value as any })}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="paye">Validé / Payé immédiatement</option>
                  <option value="en_attente">En attente de confirmation</option>
                </select>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold"
                >
                  Confirmer Versement
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}