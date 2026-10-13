'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  BookOpen, 
  Briefcase, 
  Rocket, 
  Award, 
  Handshake, 
  Newspaper, 
  Image, 
  DollarSign, 
  Bell, 
  ShieldCheck, 
  Settings,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { name: 'Vue générale', href: '/admin', icon: LayoutDashboard },
    { name: 'Membres AJPK', href: '/admin/membres', icon: Users },
    { name: 'Événements', href: '/admin/evenements', icon: Calendar },
    { name: 'Formations', href: '/admin/formations', icon: BookOpen },
    { name: 'Opportunités', href: '/admin/opportunites', icon: Briefcase },
    { name: 'Projets Jeunes', href: '/admin/projets', icon: Rocket },
    { name: 'Partenaires', href: '/admin/partenaires', icon: Handshake },
    { name: 'Actualités CMS', href: '/admin/actualites', icon: Newspaper },
    { name: 'Galerie Photo', href: '/admin/galerie', icon: Image },
    { name: 'Cotisations', href: '/admin/cotisations', icon: DollarSign },
    { name: 'Notifications', href: '/admin/notifications', icon: Bell },
    { name: 'Utilisateurs & Rôles', href: '/admin/utilisateurs', icon: ShieldCheck },
    { name: 'Paramètres System', href: '/admin/parametres', icon: Settings },
  ];

  const currentLink = links.find((l) => l.href === pathname);

  return (
    <aside className="w-full lg:w-64 bg-slate-900 text-slate-300 border-b lg:border-b-0 lg:border-r border-slate-800 p-4 lg:p-6 shrink-0 lg:min-h-screen">
      
      {/* SaaS Admin Header (Mobile bar + Desktop Header) */}
      <div className="flex items-center justify-between lg:justify-start gap-3 px-2 mb-2 lg:mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-auto flex items-center justify-center">
            <img
              src="/logo.png"
              alt="Logo AJPK"
              className="h-8 sm:h-9 w-auto object-contain brightness-110 drop-shadow"
            />
          </div>
          <div>
            <h3 className="font-extrabold text-xs sm:text-sm text-white tracking-wide">ADMINISTRATEUR</h3>
            <p className="text-[9px] sm:text-[10px] text-amber-400 font-bold uppercase tracking-wider">AJPK Management SaaS</p>
          </div>
        </div>

        {/* Mobile Toggle Button */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 transition flex items-center gap-1.5 text-xs font-bold"
          aria-label="Menu administration"
        >
          {mobileOpen ? <X className="w-5 h-5 text-rose-400" /> : <Menu className="w-5 h-5 text-emerald-400" />}
          <span className="hidden sm:inline">{mobileOpen ? 'Fermer' : (currentLink?.name || 'Menu')}</span>
        </button>
      </div>

      {/* Nav links (Always visible on Desktop, collapsible on Mobile) */}
      <div className={`${mobileOpen ? 'block' : 'hidden'} lg:block pt-2 lg:pt-0`}>
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 pt-4 border-t border-slate-800 px-2 pb-2 lg:pb-0">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white"
          >
            ← Quitter l’administration
          </Link>
        </div>
      </div>

    </aside>
  );
}
