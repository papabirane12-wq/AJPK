'use client';

import { Profile } from '@/types';
import { Mail, Phone, MapPin, Briefcase, Award, CheckCircle2 } from 'lucide-react';

interface TalentCardProps {
  member: Profile;
}

export function TalentCard({ member }: TalentCardProps) {
  return (
    <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4">
      
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 ring-2 ring-emerald-500/40 shrink-0">
          <img
            src={member.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
            alt={`${member.first_name} ${member.last_name}`}
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              {member.first_name} {member.last_name}
            </h3>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
            {member.profession || 'Compétence Kelle'}
          </p>
          <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3 text-slate-400" /> {member.address}
          </p>
        </div>
      </div>

      {/* Bio */}
      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
        {member.bio}
      </p>

      {/* Skills Badges */}
      <div className="pt-2">
        <p className="text-[10px] uppercase font-bold text-slate-400 mb-1.5">Compétences clés</p>
        <div className="flex flex-wrap gap-1.5">
          {member.skills.slice(0, 4).map((skill, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Contact info */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
        <a
          href={`mailto:${member.email}`}
          className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-emerald-400 font-bold"
        >
          <Mail className="w-3.5 h-3.5 text-brand-600" /> Contacter
        </a>
        <a
          href={`tel:${member.phone}`}
          className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-emerald-400 font-bold"
        >
          <Phone className="w-3.5 h-3.5 text-emerald-500" /> {member.phone}
        </a>
      </div>

    </div>
  );
}
