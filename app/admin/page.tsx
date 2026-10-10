'use client';

import { 
  getMembers, 
  getEvents, 
  getFormations, 
  getOpportunities, 
  getProjects, 
  getPartners, 
  getCotisations 
} from '@/lib/data/store';
import { StatCard } from '@/components/ui/StatCard';
import { Users, Calendar, BookOpen, Briefcase, Rocket, Handshake, DollarSign, ShieldCheck } from 'lucide-react';
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
  const cots = getCotisations();

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Membres Inscrit"
          value={members.length}
          subtitle="+14% ce mois-ci"
          trend="+14%"
          trendUp={true}
          icon={<Users className="w-6 h-6" />}
        />
        <StatCard
          title="Événements Organisés"
          value={events.length}
          subtitle="439 participants cumulés"
          trend="+25%"
          trendUp={true}
          icon={<Calendar className="w-6 h-6" />}
        />
        <StatCard
          title="Formations & Attestations"
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

      {/* Cotisations Bar Chart */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-white">Collecte des Cotisations Membres (FCFA)</h3>
          <span className="text-xs text-amber-400 font-bold">Total : 350 000 FCFA / mois</span>
        </div>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cotisationsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
              <Bar dataKey="collecte" fill="#f59e0b" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
