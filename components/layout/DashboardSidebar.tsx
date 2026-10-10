'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  User, 
  CreditCard, 
  Calendar, 
  BookOpen, 
  Briefcase, 
  Rocket, 
  Award, 
  Bell, 
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { getCurrentUser } from '@/lib/data/store';

export function DashboardSidebar() {
  const pathname = usePathname();
  const user = getCurrentUser();

  const links = [
    { name: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Mon Profil', href: '/dashboard/profil', icon: User },
    { name: 'Ma Carte Membre', href: '/dashboard/carte', icon: CreditCard },
    { name: 'Mes Événements', href: '/dashboard/evenements', icon: Calendar },
    { name: 'Mes Formations', href: '/dashboard/formations', icon: BookOpen },
    { name: 'Mes Opportunités', href: '/dashboard/opportunites', icon: Briefcase },
    { name: 'Mes Projets', href: '/dashboard/projets', icon: Rocket },
    { name: 'Mes Attestations', href: '/dashboard/attestations', icon: Award },
    { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
    { name: 'Paramètres', href: '/dashboard/parametres', icon: Settings },
  ];

  return (
    <aside className="w-full lg:w-64 bg-white dark:bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 p-4 lg:p-6 shrink-0">
      
      {/* User profile widget */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-brand-900 to-slate-900 text-white mb-6 shadow-md">
        <div className="flex items-center gap-3">
          <img
            src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
            alt={user ? `${user.first_name}` : 'Visiteur'}
            className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-400"
          />
          <div className="overflow-hidden">
            <h4 className="text-sm font-extrabold truncate">{user ? `${user.first_name} ${user.last_name}` : 'Non connecté'}</h4>
            <p className="text-[10px] text-amber-400 font-mono font-bold">{user?.member_number || 'Invité'}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
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

      <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
        <Link
          href="/"
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          ← Retour au site public
        </Link>
      </div>

    </aside>
  );
}
