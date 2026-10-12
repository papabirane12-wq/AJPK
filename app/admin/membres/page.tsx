'use client';

import { useState, useEffect } from 'react';
import { getMembers } from '@/lib/data/store';
import { Profile } from '@/types';
import { formatDateFr, getStatusBadgeColor } from '@/lib/utils/formatters';
import { Users, Search, ShieldCheck, Mail, Phone, Edit, Trash2, PlusCircle, RefreshCw, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminMembresPage() {
  const [members, setMembers] = useState<Profile[]>(() => getMembers());
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');

  const loadMembers = () => {
    setIsLoading(true);
    fetch('/api/members')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.members)) {
          setMembers(data.members);
          if (typeof window !== 'undefined') {
            localStorage.setItem('ajpk_members', JSON.stringify(data.members));
          }
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const filtered = members.filter((m) =>
    `${m.first_name} ${m.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
    m.member_number.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-3">
            Gestion des Membres ({members.length})
            {isLoading && <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Registre central officiel des adhérents de l’Association de la Jeunesse Polyvalente de Kelle.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadMembers}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-50 text-xs font-bold flex items-center gap-1.5 transition"
            title="Rafraîchir depuis la base de données"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Actualiser</span>
          </button>

          <Link
            href="/inscription"
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" /> Inscrire un Nouveau Membre
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 p-2 bg-slate-900 rounded-2xl border border-slate-800 max-w-md">
        <Search className="w-4 h-4 text-slate-400 ml-2" />
        <input
          type="text"
          placeholder="Rechercher par nom, n° AJPK, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-xs text-white focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="px-6 py-4">Membre</th>
                <th className="px-6 py-4">N° Adhérent</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Profession</th>
                <th className="px-6 py-4">Rôle</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((member) => (
                <tr key={member.id} className="hover:bg-slate-800/50 transition">
                  <td className="px-6 py-4 flex items-center gap-3">
                    {member.avatar_url ? (
                      <img
                        src={member.avatar_url}
                        alt={member.first_name}
                        className="w-9 h-9 rounded-xl object-cover ring-2 ring-emerald-500/40"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-slate-800 text-emerald-400 font-bold text-xs flex items-center justify-center ring-2 ring-emerald-500/40">
                        {member.first_name?.[0] || ''}
                        {member.last_name?.[0] || ''}
                      </div>
                    )}
                    <div>
                      <p className="font-extrabold text-white">
                        {member.first_name} {member.last_name}
                      </p>
                      <p className="text-[10px] text-slate-500">{formatDateFr(member.created_at)}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-amber-400">
                    {member.member_number}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-200">{member.email}</p>
                    <p className="text-[10px] text-slate-400">{member.phone}</p>
                  </td>
                  <td className="px-6 py-4 truncate max-w-[150px]">
                    {member.profession}
                  </td>
                  <td className="px-6 py-4 font-bold uppercase text-[10px] text-emerald-400">
                    {member.role}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadgeColor(
                        member.status
                      )}`}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link
                      href={`/verification/${member.member_number}`}
                      target="_blank"
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg inline-block"
                      title="Voir Carte"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    Aucun membre trouvé pour cette recherche.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
