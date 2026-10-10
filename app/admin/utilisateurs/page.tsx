'use client';

import { getMembers } from '@/lib/data/store';
import { ShieldCheck, UserCheck, Key } from 'lucide-react';

export default function AdminUtilisateursPage() {
  const members = getMembers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Rôles & Permissions Utilisateurs</h1>
        <p className="text-xs text-slate-400 mt-1">Gestion des accès : member, trainer, partner, admin, super_admin.</p>
      </div>

      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-800 text-slate-400 uppercase font-bold text-[10px]">
            <tr>
              <th className="px-6 py-4">Utilisateur</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Rôle Attribué</th>
              <th className="px-6 py-4">Accès Administration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {members.map((m) => (
              <tr key={m.id} className="hover:bg-slate-800/50">
                <td className="px-6 py-4 font-bold text-white">{m.first_name} {m.last_name}</td>
                <td className="px-6 py-4">{m.email}</td>
                <td className="px-6 py-4 font-mono font-bold text-amber-400 uppercase">{m.role}</td>
                <td className="px-6 py-4">
                  {m.role === 'admin' || m.role === 'super_admin' ? (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      Autorisé ✓
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400">
                      Standard
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
