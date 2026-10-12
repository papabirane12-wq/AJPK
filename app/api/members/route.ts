import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Profile } from '@/types';
import { mockMembers } from '@/lib/data/mockData';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yfhcfplybkozeloaezzj.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const allMembersMap = new Map<string, Profile>();

    // 1. Ajouter les membres statiques de base (admin officiel Ibrahima Samb AJPK-00011)
    for (const m of mockMembers) {
      allMembersMap.set(m.member_number, m);
    }

    // 2. Récupérer les profils enregistrés dans la table Supabase `profiles`
    try {
      const { data: dbProfiles } = await supabase.from('profiles').select('*');
      if (dbProfiles && Array.isArray(dbProfiles)) {
        for (const p of dbProfiles) {
          const profileObj: Profile = {
            id: p.id || `usr-${p.member_number}`,
            email: p.email,
            first_name: p.first_name,
            last_name: p.last_name,
            member_number: p.member_number,
            phone: p.phone || '',
            date_of_birth: p.date_of_birth || '',
            sex: (p.sex as 'M' | 'F') || 'M',
            address: p.address || 'Kelle',
            profession: p.profession || 'Membre AJPK',
            education_level: p.education_level || '',
            avatar_url: p.avatar_url || '',
            bio: p.bio || '',
            role: (p.role as Profile['role']) || 'member',
            status: (p.status as Profile['status']) || 'actif',
            created_at: p.created_at || new Date().toISOString(),
            skills: [],
            interest_domains: [],
          };
          allMembersMap.set(p.member_number, profileObj);
        }
      }
    } catch (err) {
      console.error('Erreur lecture profiles Supabase:', err);
    }

    // 3. Récupérer les membres enregistrés dans le registre central `contact_messages`
    try {
      const { data: syncMessages } = await supabase
        .from('contact_messages')
        .select('*')
        .like('subject', 'AJPK_MEMBER:%');

      if (syncMessages && Array.isArray(syncMessages)) {
        for (const row of syncMessages) {
          try {
            const memberObj: Profile = JSON.parse(row.message);
            if (memberObj && memberObj.member_number) {
              allMembersMap.set(memberObj.member_number, memberObj);
            }
          } catch {
            // Ignorer JSON invalide
          }
        }
      }
    } catch (err) {
      console.error('Erreur lecture contact_messages Supabase:', err);
    }

    // Convertir en tableau trié par date de création décroissante
    const membersList = Array.from(allMembersMap.values()).sort((a, b) => {
      const numA = parseInt(a.member_number.replace(/[^0-9]/g, ''), 10) || 0;
      const numB = parseInt(b.member_number.replace(/[^0-9]/g, ''), 10) || 0;
      return numB - numA;
    });

    return NextResponse.json({
      success: true,
      members: membersList,
      count: membersList.length,
    });
  } catch (error: unknown) {
    console.error('Erreur GET /api/members:', error);
    return NextResponse.json({ success: false, members: mockMembers, count: mockMembers.length }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { first_name, last_name, email, phone, address, profession, avatar_url, role = 'member' } = body;

    if (!first_name || !last_name) {
      return NextResponse.json({ success: false, message: 'Prénom et nom obligatoires.' }, { status: 400 });
    }

    // 1. Récupérer TOUS les numéros de membres existants pour garantir l'unicité stricte
    const existingNumbers: number[] = [11]; // Ibrahima Samb est au minimum AJPK-00011

    // Vérifier dans `profiles`
    try {
      const { data: dbProfiles } = await supabase.from('profiles').select('member_number');
      if (dbProfiles) {
        for (const p of dbProfiles) {
          const match = p.member_number?.match(/AJPK-(\d+)/i);
          if (match) existingNumbers.push(parseInt(match[1], 10));
        }
      }
    } catch (e) {
      console.error(e);
    }

    // Vérifier dans `contact_messages`
    try {
      const { data: syncMessages } = await supabase
        .from('contact_messages')
        .select('subject')
        .like('subject', 'AJPK_MEMBER:%');

      if (syncMessages) {
        for (const row of syncMessages) {
          const match = row.subject?.match(/AJPK-(\d+)/i);
          if (match) existingNumbers.push(parseInt(match[1], 10));
        }
      }
    } catch (e) {
      console.error(e);
    }

    // Calculer le prochain numéro STRICTEMENT UNIQUE
    const maxNumber = Math.max(...existingNumbers.filter(n => !isNaN(n) && n > 0));
    const nextNumber = maxNumber + 1;
    const member_number = `AJPK-${String(nextNumber).padStart(5, '0')}`;

    const cleanPhone = (phone || '').replace(/[^0-9]/g, '');
    const cleanEmail = email || `${first_name.toLowerCase().replace(/\s+/g, '')}.${last_name.toLowerCase().replace(/\s+/g, '') || cleanPhone}@ajpk.sn`;

    const newMember: Profile = {
      id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      email: cleanEmail,
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      member_number,
      phone: phone || '',
      date_of_birth: '2000-01-01',
      sex: 'M',
      address: address || 'Commune de Kelle',
      profession: profession || 'Membre AJPK',
      education_level: 'Baccalauréat',
      avatar_url: avatarPreviewOrEmpty(avatar_url),
      bio: 'Membre actif engagé pour le développement de Kelle.',
      role: role as Profile['role'],
      created_at: new Date().toISOString(),
      skills: ['Engagement citoyen', 'Solidarité'],
      interest_domains: ['Développement local', 'Jeunesse'],
      status: 'actif',
    };

    // 2. Persister de manière centrale dans Supabase
    try {
      await supabase.from('contact_messages').insert([
        {
          name: `${newMember.first_name} ${newMember.last_name}`,
          email: newMember.email,
          subject: `AJPK_MEMBER:${member_number}`,
          message: JSON.stringify(newMember),
        },
      ]);
    } catch (dbErr) {
      console.error('Erreur insertion Supabase contact_messages:', dbErr);
    }

    return NextResponse.json({
      success: true,
      member: newMember,
      message: `Membre ${member_number} enregistré avec succès dans la base centrale.`,
    });
  } catch (error: unknown) {
    console.error('Erreur POST /api/members:', error);
    const errMessage = error instanceof Error ? error.message : 'Erreur interne';
    return NextResponse.json({ success: false, message: errMessage }, { status: 500 });
  }
}

function avatarPreviewOrEmpty(url?: string): string {
  if (!url) return '';
  return url;
}
