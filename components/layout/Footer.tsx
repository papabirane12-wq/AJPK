import Link from 'next/link';
import { MapPin, Phone, Mail, Globe, Heart, Shield, ArrowRight } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block group">
              <div className="h-12 flex items-center transition-all group-hover:scale-105">
                <img
                  src="/logo.png"
                  alt="Logo AJPK"
                  className="h-11 w-auto object-contain brightness-110 drop-shadow"
                />
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              
              L’AJPK est l’écosystème numérique et citoyen fédérant les jeunes de Kelle pour la formation, l’emploi, l’entrepreneuriat et le développement local.
            </p>

            <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1"><Shield className="w-4 h-4 text-emerald-400" /> Association Officielle</span>
              <span>•</span>
              <span>Récépissé N° 2024/KLL/0089</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Plateforme</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/a-propos" className="hover:text-emerald-400 transition">À propos de l’AJPK</Link></li>
              <li><Link href="/evenements" className="hover:text-emerald-400 transition">Événements & Agenda</Link></li>
              <li><Link href="/formations" className="hover:text-emerald-400 transition">Catalogue Formations</Link></li>
              <li><Link href="/projets" className="hover:text-emerald-400 transition">Projets des Jeunes</Link></li>
            </ul>
          </div>

          {/* Talents & Partenaires */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Réseau & Impact</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/partenaires" className="hover:text-emerald-400 transition">Devenir Partenaire</Link></li>
              <li><Link href="/galerie" className="hover:text-emerald-400 transition">Galerie Photo</Link></li>
              <li><Link href="/inscription" className="hover:text-emerald-400 transition">Formulaire d’Adhésion</Link></li>
            </ul>
          </div>

          {/* Contact & Location */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Contact & Siège</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Kelle, Sénégal</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+221 78 889 52 84</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>ajpk.senegal@gmail.com</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>www.ajpk.org</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} AJPK - Association de la Jeunesse Polyvalente de Kelle. Tous droits réservés.</p>
          <div className="flex items-center gap-6">
            <Link href="/verification/AJPK-00001" className="hover:text-emerald-400">Vérifier une carte membre</Link>
            <Link href="/connexion" className="hover:text-emerald-400">Espace Administrateur</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
