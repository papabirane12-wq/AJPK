'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  User, 
  ShieldCheck, 
  LogOut, 
  ChevronDown, 
  Search,
  Sparkles,
  Award,
  Briefcase,
  Users,
  Calendar,
  BookOpen
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { getCurrentUser, setCurrentUser } from '@/lib/data/store';
import { Profile } from '@/types';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [user, setUser] = useState<Profile | null>(null);

  useEffect(() => {
    // Si la session simulée usr-1 (Moussa Diop) est en cache localStorage, on la nettoie
    const current = getCurrentUser();
    if (current && current.id === 'usr-1' && current.email === 'moussa.diop@ajpk.sn') {
      setCurrentUser(null);
      setUser(null);
    } else {
      setUser(current);
    }
  }, [pathname]);

  const handleLogout = () => {
    setCurrentUser(null);
    setUser(null);
    setUserDropdownOpen(false);
    window.location.href = '/';
  };

  const navLinks = [
    { name: 'Accueil', href: '/' },
    { name: 'À propos', href: '/a-propos' },
    { name: 'Événements', href: '/evenements' },
    { name: 'Formations', href: '/formations' },
    { name: 'Projets', href: '/projets' },
    { name: 'Partenaires', href: '/partenaires' },
    { name: 'Galerie', href: '/galerie' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center group py-1">
            <div className="h-14 flex items-center justify-center transition-all duration-300 group-hover:scale-105">
              <img
                src="/logo.png"
                alt="Logo AJPK"
                className="h-12 sm:h-14 w-auto object-contain drop-shadow-sm filter contrast-105"
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Side Tools & User Account */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                >
                  <img
                    src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
                    alt={`${user.first_name}`}
                    className="w-8 h-8 rounded-xl object-cover ring-2 ring-brand-500"
                  />
                  <div className="text-left text-xs">
                    <p className="font-bold text-slate-900 dark:text-white leading-tight">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      {user.member_number}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-semibold text-slate-400 uppercase">Rôle: {user.role}</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.email}</p>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <User className="w-4 h-4 text-brand-600" />
                      Espace Membre
                    </Link>

                    {(user.role === 'admin' || user.role === 'super_admin') && (
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Dashboard Admin
                      </Link>
                    )}

                    <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/connexion"
                  className="px-4 py-2 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Connexion
                </Link>
                
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
              aria-label="Ouvrir le menu mobile"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-6 space-y-1 max-h-[85vh] overflow-y-auto">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-xl text-base font-semibold ${
                pathname === link.href
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 font-bold'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center px-4 py-3 rounded-xl font-bold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300"
                >
                  Espace Membre ({user.first_name})
                </Link>
                {(user.role === 'admin' || user.role === 'super_admin') && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center px-4 py-3 rounded-xl font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300"
                  >
                    Dashboard Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-center px-4 py-3 rounded-xl font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/connexion"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-3 rounded-xl font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800"
                >
                  Connexion
                </Link>
                <Link
                  href="/inscription"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-3 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-700"
                >
                  Adhésion
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
