'use client';

import { 
  getMembers, 
  getEvents, 
  getFormations, 
  getOpportunities, 
  getProjects, 
  getPartners, 
  getCotisations,
  getCotisationsSummary 
} from '@/lib/data/store';
import { StatCard } from '@/components/ui/StatCard';
import { formatFCFA } from '@/lib/utils/formatters';
import { Users, Calendar, BookOpen, Briefcase, Rocket, Handshake, DollarSign, ShieldCheck, Wallet, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export default function AdminOverviewPage() {
  const members = getMembers();
  const events = getEvents();
  const formations = getFormations();
  const opps = getOpportunities();
  const projects = getProjects();
  const partners = getPartners();
  const cotsSummary = getCotisationsSummary();
  const cots = cotsSummary.cotisations;
  const totalCotisationsSum = cotsSummary.totalAmount;

  // Chart data
  const memberGrowthData = [
    { month: 'Mai', membres: 120 },
    { month: 'Juin', membres: 180 },
    { month: 'Juil', membres: 240 },
    { month: 'Août', membres: 290 },
    { month: 'Sept', membres: 320 },
    { month: 'Oct', membres: 350 },
  ];

  const projectStatusData = [
    { name: 'En étude', value: 3, color: '#f59e0b' },
    { name: 'Accepté', value: 4, color: '#10b981' },
    { name: 'En accompagnement', value: 3, color: '#3b82f6' },
    { name: 'Réalisé', value: 2, color: '#059669' },
  ];

  const cotisationsData = [
    { month: 'Juin', collecte: 150000 },
    { month: 'Juil', collecte: 210000 },
    { month: 'Août', collecte: 280000 },
    { month: 'Sept', collecte: 320000 },
    { month: 'Oct', collecte: 350000 },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 border border-slate-800 shadow-2xl">
        <div>
          <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Console d’Administration SaaS
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-2">Vue Générale AJPK</h1>
          <p className="text-xs text-slate-400 mt-1">
            Supervision en temps réel des membres, des cotisations, des projets et des activités communales.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-emerald-400 border border-slate-700 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span> Système En Ligne
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Total Membres"
          value={members.length}
          subtitle="Adhérents officiels"
          trend="+100%"
          trendUp={true}
          icon={<Users className="w-6 h-6" />}
        />
        
        <StatCard
          title="Événements"
          value={events.length}
          subtitle="439 participants"
          trend="+25%"
          trendUp={true}
          icon={<Calendar className="w-6 h-6" />}
        />
        <StatCard
          title="Formations"
          value={formations.length}
          subtitle="88 apprenants certifiés"
          trend="+18%"
          trendUp={true}
          icon={<BookOpen className="w-6 h-6" />}
        />
        <StatCard
          title="Projets Accompagnés"
          value={projects.length}
          subtitle="10.8M FCFA investis"
          trend="+30%"
          trendUp={true}
          icon={<Rocket className="w-6 h-6" />}
        />
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Member Growth Area Chart */}
        <div className="lg:col-span-2 bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-white">Évolution du Nombre de Membres (2026)</h3>
            <span className="text-xs text-slate-400">Mensuel</span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={memberGrowthData}>
                <defs>
                  <linearGradient id="colorMembres" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                <Area type="monotone" dataKey="membres" stroke="#10b981" fillOpacity={1} fill="url(#colorMembres)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project Status Pie Chart */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-base font-extrabold text-white">Répartition des Projets Jeunes</h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={projectStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {projectStatusData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                <span className="text-slate-400 truncate">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Cotisations Section based strictly on valid inscriptions and contributions */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-extrabold text-white">Collecte Réelle des Cotisations & Adhésions</h3>
            <p className="text-xs text-slate-400 mt-0.5">Calcul basé strictement sur les inscriptions validées (1 050 FCFA par adhésion).</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-mono font-extrabold text-emerald-400 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              Total Encaissé : {formatFCFA(totalCotisationsSum)}
            </span>
            <Link
              href="/admin/cotisations"
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-1.5"
            >
              Gérer les Cotisations <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60">
            <p className="text-xs text-slate-400 font-semibold">Frais d'Adhésions (Inscriptions)</p>
            <p className="text-xl font-black text-white font-mono mt-1">{formatFCFA(cotsSummary.totalAdhesionAmount)}</p>
            <p className="text-[10px] text-emerald-400 mt-1">{cotsSummary.adhesionCount} adhérents inscrits (× 1 050 FCFA)</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60">
            <p className="text-xs text-slate-400 font-semibold">Cotisations Périodiques / Autres</p>
            <p className="text-xl font-black text-white font-mono mt-1">{formatFCFA(Math.max(0, totalCotisationsSum - cotsSummary.totalAdhesionAmount))}</p>
            <p className="text-[10px] text-slate-400 mt-1">{cotsSummary.totalCount - cotsSummary.adhesionCount} versement(s)</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60">
            <p className="text-xs text-slate-400 font-semibold">Taux de Règlements Confirmés</p>
            <p className="text-xl font-black text-emerald-400 font-mono mt-1">100%</p>
            <p className="text-[10px] text-slate-400 mt-1">Canaux Wave & Orange Money</p>
          </div>
        </div>

        {cots.length > 0 && (
          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cots.map((c) => ({
                nom: c.member_name ? c.member_name.split(' ')[0] : c.member_number,
                montant: c.amount_fcfa,
                motif: c.period
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="nom" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  formatter={(val: any) => [formatFCFA(Number(val)), 'Montant Encaissé']} 
                />
                <Bar dataKey="montant" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

    </div>
  );
}
