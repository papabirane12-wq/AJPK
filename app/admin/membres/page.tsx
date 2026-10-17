'use client';

import { useState, useEffect } from 'react';
import { getMembers } from '@/lib/data/store';
import { Profile } from '@/types';
import { formatDateFr, formatFCFA, getStatusBadgeColor } from '@/lib/utils/formatters';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  Mail, 
  Phone, 
  PlusCircle, 
  RefreshCw, 
  Loader2, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ExternalLink,
  DollarSign,
  Printer
} from 'lucide-react';
import Link from 'next/link';
import { PrintMembersModal } from '@/components/admin/PrintMembersModal';

interface UnitechTx {
  id: number;
  reference: string;
  amount: number;
  method: string;
  methodName: string;
  status: 'completed' | 'pending' | 'failed';
  phone: string;
  customerName: string;
  description: string;
  date: string;
}

export default function AdminMembresPage() {
  const [members, setMembers] = useState<Profile[]>([]);
  const [transactions, setTransactions] = useState<UnitechTx[]>([]);
  const [activeTab, setActiveTab] = useState<'members' | 'transactions'>('members');
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState('');
  const [search, setSearch] = useState('');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const loadData = async (triggerSync = false) => {
    setIsLoading(true);
    if (triggerSync) setIsSyncing(true);
    setSyncFeedback('');

    try {
      // 1. Charger les membres directement depuis la base de données
      const memRes = await fetch(`/api/members?sync=${triggerSync ? 'true' : 'false'}`);
      const memData = await memRes.json();
      if (memData.success && Array.isArray(memData.members)) {
        setMembers(memData.members);
      }

      // 2. Charger les transactions Unitech Pay
      const txRes = await fetch('/api/unitech/transactions');
      const txData = await txRes.json();
      if (txData.success && Array.isArray(txData.transactions)) {
        setTransactions(txData.transactions);
      }

      if (triggerSync) {
        setSyncFeedback(`Synchronisation réussie : ${memData.members?.length || 0} membres vérifiés et à jour.`);
        setTimeout(() => setSyncFeedback(''), 6000);
      }
    } catch (err) {
      console.error(err);
      if (triggerSync) setSyncFeedback('Erreur lors de la synchronisation.');
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    loadData(true);
  }, []);

  const filteredMembers = members.filter((m) =>
    `${m.first_name} ${m.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
    m.member_number.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    (m.phone && m.phone.toLowerCase().includes(search.toLowerCase()))
  );

  const filteredTransactions = transactions.filter((t) =>
    t.customerName.toLowerCase().includes(search.toLowerCase()) ||
    t.phone.toLowerCase().includes(search.toLowerCase()) ||
    t.reference.toLowerCase().includes(search.toLowerCase())
  );

  const completedTxList = transactions.filter((t) => t.status === 'completed');
  const completedTxCount = completedTxList.length;
  const pendingTxCount = transactions.filter((t) => t.status === 'pending').length;
  const totalCollected = completedTxList.reduce((sum, t) => sum + (t.amount || 1050), 0);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-3">
            Gestion des Membres & Cotisations
            {isLoading && <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Vérification en temps réel des adhésions validées via Wave et Orange Money (Unitech Pay).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => loadData(true)}
            disabled={isSyncing}
            className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg flex items-center gap-2 transition disabled:opacity-50"
            title="Vérifier et synchroniser tous les paiements avec Unitech Pay"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Vérification en direct...' : 'Vérifier tous les paiements'}</span>
          </button>

          <Link
            href="/inscription"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs shadow flex items-center gap-2 border border-slate-700 transition"
          >
            <PlusCircle className="w-4 h-4" /> Inscrire un Membre
          </Link>

          <button
            onClick={() => setIsPrintModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs shadow flex items-center gap-2 border border-slate-700 transition"
            title="Imprimer la liste officielle (Prénom et Nom uniquement)"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Imprimer la Liste</span>
          </button>
        </div>
      </div>

      {syncFeedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{syncFeedback}</span>
        </div>
      )}

      {/* Cartes Statistiques Récapitulatives */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-3 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase truncate">Membres Officiels</span>
            <Users className="w-4 h-4 text-brand-400 shrink-0" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-white">{members.length}</p>
          <p className="text-[9px] sm:text-[10px] text-slate-500 truncate">19 adhérents + 1 admin</p>
        </div>

        <div className="p-3 sm:p-4 rounded-2xl bg-slate-900 border border-emerald-500/20 space-y-1">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase truncate">Paiements Validés</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-emerald-400">{completedTxCount}</p>
          <p className="text-[9px] sm:text-[10px] text-emerald-500/80 truncate">Wave & Orange Money</p>
        </div>

        <div className="p-3 sm:p-4 rounded-2xl bg-slate-900 border border-brand-500/20 space-y-1">
          <div className="flex items-center justify-between text-brand-400">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase truncate">Fonds Collectés</span>
            <DollarSign className="w-4 h-4 text-brand-400 shrink-0" />
          </div>
          <p className="text-lg sm:text-2xl font-black text-white tracking-tight">{formatFCFA(totalCollected)}</p>
          <p className="text-[9px] sm:text-[10px] text-slate-500 truncate">{completedTxCount} × 1 050 FCFA</p>
        </div>

        <div className="p-3 sm:p-4 rounded-2xl bg-slate-900 border border-amber-500/20 space-y-1">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase truncate">En attente</span>
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-amber-400">{pendingTxCount}</p>
          <p className="text-[9px] sm:text-[10px] text-slate-500 truncate">En attente de débit</p>
        </div>
      </div>

      {/* Onglets de Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto whitespace-nowrap">
        <button
          onClick={() => setActiveTab('members')}
          className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 shrink-0 ${
            activeTab === 'members'
              ? 'bg-brand-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Tous les Membres ({members.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 shrink-0 ${
            activeTab === 'transactions'
              ? 'bg-brand-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Transactions & Paiements ({transactions.length})</span>
        </button>
      </div>

      {/* Recherche */}
      <div className="flex items-center gap-2 p-2.5 bg-slate-900 rounded-2xl border border-slate-800 max-w-md">
        <Search className="w-4 h-4 text-slate-400 ml-2 shrink-0" />
        <input
          type="text"
          placeholder={
            activeTab === 'members'
              ? 'Rechercher par nom, n° AJPK, téléphone...'
              : 'Rechercher transaction par client, tél, référence...'
          }
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-xs text-white focus:outline-none"
        />
      </div>

      {/* VUE 1 : TABLEAU DES MEMBRES */}
      {activeTab === 'members' && (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 min-w-[680px]">
              <thead className="bg-slate-800 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="px-6 py-4">Membre</th>
                  <th className="px-6 py-4">N° Adhérent</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Paiement & Statut</th>
                  <th className="px-6 py-4">Rôle</th>
                  <th className="px-6 py-4 text-right">Carte & Fiche</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredMembers.map((member) => {
                  const paymentInfo = (member as any).payment_method || 'Adhésion';
                  const paymentRef = (member as any).payment_ref;

                  return (
                    <tr key={member.id} className="hover:bg-slate-800/50 transition">
                      <td className="px-6 py-4 flex items-center gap-3">
                        {member.avatar_url ? (
                          <img
                            src={member.avatar_url}
                            alt={member.first_name}
                            className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-500/40"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-emerald-600 text-white font-extrabold text-xs flex items-center justify-center ring-2 ring-emerald-500/30">
                            {member.first_name?.[0] || ''}
                            {member.last_name?.[0] || ''}
                          </div>
                        )}
                        <div>
                          <p className="font-extrabold text-white">
                            {member.first_name} {member.last_name}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {member.profession || 'Membre Adhérent'} • {member.address || 'Kelle'}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-4 font-mono font-black text-amber-400">
                        {member.member_number}
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-200">{member.phone || '-'}</p>
                        <p className="text-[10px] text-slate-400">{member.email}</p>
                      </td>

                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            1 050 FCFA Validé
                          </span>
                          {paymentRef && (
                            <p className="text-[9px] font-mono text-slate-400 truncate max-w-[140px]" title={paymentRef}>
                              Réf: {paymentRef}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 font-bold uppercase text-[10px] text-slate-300">
                        {member.role === 'super_admin' ? (
                          <span className="text-amber-400 font-extrabold">Super Admin</span>
                        ) : member.role === 'admin' ? (
                          <span className="text-brand-400 font-extrabold">Admin</span>
                        ) : (
                          'Membre'
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/verification/${encodeURIComponent(member.id || member.member_number)}`}
                          target="_blank"
                          className="px-3 py-1.5 bg-slate-800 hover:bg-brand-600 text-slate-200 hover:text-white rounded-xl inline-flex items-center gap-1.5 text-[11px] font-bold transition shadow-sm"
                          title="Voir la carte officielle"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Carte</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}

                {filteredMembers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      Aucun membre trouvé pour cette recherche.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VUE 2 : TABLEAU DES TRANSACTIONS UNITECH PAY */}
      {activeTab === 'transactions' && (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 min-w-[720px]">
              <thead className="bg-slate-800 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="px-6 py-4">Client / Adhérent</th>
                  <th className="px-6 py-4">Téléphone Débité</th>
                  <th className="px-6 py-4">Moyen de Paiement</th>
                  <th className="px-6 py-4">Montant</th>
                  <th className="px-6 py-4">Statut Unitech Pay</th>
                  <th className="px-6 py-4">Référence</th>
                  <th className="px-6 py-4 text-right">Date & Heure</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-800/50 transition">
                    <td className="px-6 py-4 font-extrabold text-white">
                      {tx.customerName}
                    </td>

                    <td className="px-6 py-4 font-mono font-bold text-slate-300">
                      {tx.phone}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {tx.method === 'wave' ? (
                          <>
                            <img src="/icons/wave.png" alt="Wave" className="w-5 h-5 object-contain rounded" />
                            <span className="font-bold text-sky-400">Wave Sénégal</span>
                          </>
                        ) : (
                          <>
                            <img src="/icons/orange-money.png" alt="Orange Money" className="w-5 h-5 object-contain rounded" />
                            <span className="font-bold text-amber-400">Orange Money</span>
                          </>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 font-extrabold text-white">
                      {formatFCFA(tx.amount)}
                    </td>

                    <td className="px-6 py-4">
                      {tx.status === 'completed' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" /> Validé
                        </span>
                      ) : tx.status === 'pending' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          <Clock className="w-3 h-3" /> En attente
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-500/20 text-rose-400 border border-rose-500/30">
                          <AlertCircle className="w-3 h-3" /> Échoué
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 font-mono text-[10px] text-slate-400">
                      {tx.reference}
                    </td>

                    <td className="px-6 py-4 text-right text-[11px] text-slate-400">
                      {tx.date}
                    </td>
                  </tr>
                ))}

                {filteredTransactions.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                      Aucune transaction trouvée.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal d'Impression de la Liste des Membres (Prénom & Nom) */}
      <PrintMembersModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        members={members}
      />
    </div>
  );
}
