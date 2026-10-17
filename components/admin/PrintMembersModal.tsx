'use client';

import { useState, useMemo } from 'react';
import { Profile } from '@/types';
import { 
  Printer, 
  X, 
  Check, 
  FileText, 
  Users, 
  SlidersHorizontal,
  ArrowUpDown,
  Download
} from 'lucide-react';

interface PrintMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: Profile[];
}

export function PrintMembersModal({ isOpen, onClose, members }: PrintMembersModalProps) {
  const [sortBy, setSortBy] = useState<'first_name' | 'last_name' | 'member_number'>('first_name');
  const [includeSignatureColumn, setIncludeSignatureColumn] = useState(false);
  const [twoColumnsLayout, setTwoColumnsLayout] = useState(false);
  const [customTitle, setCustomTitle] = useState('LISTE OFFICIELLE DES MEMBRES');

  // Tri des membres
  const sortedMembers = useMemo(() => {
    return [...members].sort((a, b) => {
      if (sortBy === 'first_name') {
        return (a.first_name || '').localeCompare(b.first_name || '', 'fr', { sensitivity: 'base' });
      } else if (sortBy === 'last_name') {
        return (a.last_name || '').localeCompare(b.last_name || '', 'fr', { sensitivity: 'base' });
      } else {
        const numA = parseInt(a.member_number.replace(/[^0-9]/g, ''), 10) || 0;
        const numB = parseInt(b.member_number.replace(/[^0-9]/g, ''), 10) || 0;
        return numA - numB;
      }
    });
  }, [members, sortBy]);

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[94vh] flex flex-col my-auto">
        
        {/* Header Modal (No-print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70 no-print">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                Imprimer la Liste des Membres
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold border border-emerald-500/30">
                  Prénom & Nom uniquement
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Format épuré A4 prêt pour impression papier, émargement ou archivage PDF.
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

        {/* Options de personnalisation avant impression (No-print) */}
        <div className="p-4 sm:px-6 bg-slate-950/50 border-b border-slate-800 space-y-3 no-print">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Tri */}
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 mb-1">
                <ArrowUpDown className="w-3 h-3 text-emerald-400" /> Ordre de tri
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="first_name">Par Prénom (A → Z)</option>
                <option value="last_name">Par Nom (A → Z)</option>
                <option value="member_number">Par N° d'Adhésion</option>
              </select>
            </div>

            {/* Titre du document */}
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">
                Titre du document
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                placeholder="Ex: LISTE DES MEMBRES"
              />
            </div>

            {/* Cases à cocher */}
            <div className="flex flex-col justify-center space-y-1.5 pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={includeSignatureColumn}
                  onChange={(e) => setIncludeSignatureColumn(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500"
                />
                <span>Ajouter case émargement</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={twoColumnsLayout}
                  onChange={(e) => setTwoColumnsLayout(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500"
                />
                <span>Format 2 colonnes A4</span>
              </label>
            </div>

          </div>
        </div>

        {/* Zone de prévisualisation et Zone Imprimable */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-950">
          
          <div className="mb-2 flex items-center justify-between no-print">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Aperçu de la page A4 ({sortedMembers.length} membres) :
            </span>
            <span className="text-[11px] text-emerald-400 font-mono">
              Prêt pour impression
            </span>
          </div>

          {/* DOCUMENT IMPRIMABLE (ID utilisé par le CSS print) */}
          <div 
            id="ajpk-printable-area"
            className="bg-white text-slate-900 rounded-2xl p-6 sm:p-10 shadow-xl border border-slate-300 font-sans max-w-3xl mx-auto"
          >
            {/* En-tête officiel AJPK */}
            <div className="border-b-2 border-emerald-700 pb-4 mb-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src="/logo.png"
                    alt="Logo AJPK"
                    className="h-12 w-auto object-contain"
                  />
                  <div>
                    <h1 className="text-sm sm:text-base font-black tracking-wide text-slate-900 uppercase">
                      ASSOCIATION DE LA JEUNESSE POLYVALENTE DE KELLÉ (AJPK)
                    </h1>
                    <p className="text-[11px] font-semibold text-emerald-800">
                      Commune de Kellé • Département de Thiès • Sénégal
                    </p>
                  </div>
                </div>

                <div className="text-right text-[10px] text-slate-600 font-medium shrink-0">
                  <p>Date : {new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                  <p className="font-bold text-slate-900">Total : {sortedMembers.length} Membres</p>
                </div>
              </div>

              {/* Titre principal */}
              <div className="mt-4 pt-3 border-t border-slate-200 text-center">
                <h2 className="text-lg font-black tracking-wider text-slate-900 uppercase">
                  {customTitle}
                </h2>
              </div>
            </div>

            {/* TABLEAU DES MEMBRES (SEULEMENT PRÉNOM ET NOM) */}
            {twoColumnsLayout ? (
              // Disposition 2 colonnes (économise le papier, idéal pour tenir sur 1 seule feuille)
              <div className="grid grid-cols-2 gap-x-6 gap-y-0 text-xs">
                {(() => {
                  const mid = Math.ceil(sortedMembers.length / 2);
                  const col1 = sortedMembers.slice(0, mid);
                  const col2 = sortedMembers.slice(mid);

                  const renderTable = (list: typeof sortedMembers, startIndex: number) => (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b-2 border-slate-900 text-[11px] uppercase font-black text-slate-700">
                          <th className="py-1.5 px-2 w-10 text-center">N°</th>
                          <th className="py-1.5 px-2">Prénom</th>
                          <th className="py-1.5 px-2">Nom</th>
                          {includeSignatureColumn && (
                            <th className="py-1.5 px-2 text-right">Émargement</th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {list.map((m, idx) => (
                          <tr key={m.id} className="text-slate-900">
                            <td className="py-1.5 px-2 text-center font-mono font-bold text-[10px] text-slate-500">
                              {startIndex + idx + 1}
                            </td>
                            <td className="py-1.5 px-2 font-bold uppercase">{m.first_name}</td>
                            <td className="py-1.5 px-2 font-black uppercase text-slate-950">{m.last_name}</td>
                            {includeSignatureColumn && (
                              <td className="py-1.5 px-2 text-right border-l border-slate-200">
                                <div className="h-4 w-14 border border-dashed border-slate-400 ml-auto rounded"></div>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  );

                  return (
                    <>
                      <div>{renderTable(col1, 0)}</div>
                      <div>{renderTable(col2, mid)}</div>
                    </>
                  );
                })()}
              </div>
            ) : (
              // Disposition 1 colonne standard pleine largeur
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b-2 border-slate-900 text-[11px] uppercase font-black text-slate-700 bg-slate-100">
                    <th className="py-2 px-3 w-12 text-center">N°</th>
                    <th className="py-2 px-4">Prénom</th>
                    <th className="py-2 px-4">Nom de Famille</th>
                    {includeSignatureColumn && (
                      <th className="py-2 px-4 text-center w-36">Présence / Émargement</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {sortedMembers.map((member, index) => (
                    <tr key={member.id} className="even:bg-slate-50/70">
                      <td className="py-2 px-3 text-center font-mono font-bold text-slate-500">
                        {index + 1}
                      </td>
                      <td className="py-2 px-4 font-bold text-slate-900 uppercase">
                        {member.first_name}
                      </td>
                      <td className="py-2 px-4 font-black text-slate-950 uppercase tracking-wide">
                        {member.last_name}
                      </td>
                      {includeSignatureColumn && (
                        <td className="py-2 px-4 text-center">
                          <div className="h-5 w-24 border border-dashed border-slate-400 mx-auto rounded"></div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Pied de page officiel */}
            <div className="mt-8 pt-4 border-t border-slate-200 text-center text-[10px] text-slate-500 flex items-center justify-between">
              <span>Association de la Jeunesse Polyvalente de Kellé (AJPK)</span>
              <span>« Kellé moo ñu ñoor ! »</span>
              <span>https://ajpk.sn</span>
            </div>
          </div>

        </div>

        {/* Footer Modal avec Bouton d'Impression (No-print) */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
          <p className="text-xs text-slate-400">
            {sortedMembers.length} membres prêts • Compatible imprimante papier et export PDF.
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
            >
              Fermer
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-xl shadow-emerald-950/60 flex items-center gap-2 transition"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer Maintenant / PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
