import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Profile } from '@/types';
import { mockMembers } from '@/lib/data/mockData';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yfhcfplybkozeloaezzj.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const UNITECH_API_URL = 'https://api.unitech.sn/api.php';
const UNITECH_API_KEY = process.env.UNITECH_PAY_API_KEY || '4c53ad12e1e4bcaa5d65576fadfef7618dfa7fd495124f7d8093968d5d0e505c';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const dynamic = 'force-dynamic';

function avatarPreviewOrEmpty(url?: string): string {
  if (!url) return '';
  if (url.startsWith('data:image/') || url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return '';
}

// Fonction pour synchroniser en direct les paiements Unitech Pay avec Supabase
async function syncUnitechPaymentsWithSupabase() {
  try {
    const res = await fetch(`${UNITECH_API_URL}?action=transactions`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${UNITECH_API_KEY}` },
      cache: 'no-store',
    });
    const data = await res.json();
    if (!res.ok || !data.success) return;

    const completed = (data.data?.transactions || []).filter(
      (t: any) => t.status === 'completed' && parseFloat(t.amount) === 1050
    );

    // Trier par date croissante (du plus ancien au plus récent) pour attribuer l'ordre chronologique
    completed.sort(
      (a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    // Récupérer les messages existants
    const { data: existingRows } = await supabase
      .from('contact_messages')
      .select('subject, message')
      .like('subject', 'AJPK_MEMBER:%');

    const knownRefs = new Set<string>();
    const knownPhones = new Set<string>();
    const existingNums: number[] = [11];

    for (const row of existingRows || []) {
      const match = row.subject?.match(/AJPK-(\d+)/i);
      if (match) existingNums.push(parseInt(match[1], 10));

      try {
        const m = JSON.parse(row.message);
        if (m.payment_ref) knownRefs.add(m.payment_ref);
        if (m.phone) knownPhones.add(m.phone.replace(/[^0-9]/g, ''));
      } catch {
        // Ignorer
      }
    }

    let nextNumber = Math.max(...existingNums.filter((n) => !isNaN(n) && n > 0)) + 1;

    for (const t of completed) {
      const cleanPhone = (t.customer_number || '').replace(/[^0-9]/g, '');

      // Déjà enregistré
      if (knownRefs.has(t.reference) || (cleanPhone && knownPhones.has(cleanPhone))) {
        continue;
      }

      let fullName = 'Membre Adhérent';
      try {
        const meta = typeof t.metadata === 'string' ? JSON.parse(t.metadata) : t.metadata;
        if (meta?.description) {
          fullName = meta.description.replace(/^Adhésion\s+AJPK\s*-\s*/i, '').trim();
        }
      } catch {
        // Ignorer
      }

      const parts = fullName.split(/\s+/);
      const firstName = parts.length > 1 ? parts.slice(0, -1).join(' ') : parts[0];
      const lastName = parts.length > 1 ? parts[parts.length - 1] : 'AJPK';
      const memberNumber = `AJPK-${String(nextNumber).padStart(5, '0')}`;
      nextNumber++;

      const memberObj: Profile & { payment_ref?: string; payment_method?: string; payment_amount?: number } = {
        id: `usr-unitech-${t.id}`,
        first_name: firstName,
        last_name: lastName,
        email: `${firstName.toLowerCase().replace(/[^a-z0-9]/g, '')}.${lastName.toLowerCase().replace(/[^a-z0-9]/g, '') || cleanPhone}@ajpk.sn`,
        phone: cleanPhone.startsWith('221') ? `+${cleanPhone}` : `+221 ${cleanPhone}`,
        member_number: memberNumber,
        address: 'Commune de Kelle',
        profession: 'Membre AJPK',
        date_of_birth: '2000-01-01',
        sex: 'M',
        education_level: 'Baccalauréat',
        avatar_url: '',
        bio: 'Membre actif engagé pour le développement de Kelle.',
        role: 'member',
        status: 'actif',
        created_at: t.created_at ? new Date(t.created_at).toISOString() : new Date().toISOString(),
        skills: [],
        interest_domains: [],
        payment_ref: t.reference,
        payment_method: t.method === 'wave' ? 'Wave Sénégal' : 'Orange Money',
        payment_amount: 1050,
      };

      await supabase.from('contact_messages').insert({
        name: fullName,
        email: memberObj.email,
        subject: `AJPK_MEMBER:${memberNumber}`,
        message: JSON.stringify(memberObj),
      });

      knownRefs.add(t.reference);
      if (cleanPhone) knownPhones.add(cleanPhone);
    }
  } catch (err) {
    console.error('Erreur synchronisation Unitech Pay:', err);
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const syncParam = searchParams.get('sync');

    // Toujours vérifier et synchroniser avec Unitech Pay pour ne rater aucun paiement validé
    if (syncParam !== 'false') {
      await syncUnitechPaymentsWithSupabase();
    }

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
          if (!p.member_number || p.member_number === 'AJPK-99998') continue;
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
    const maxNumber = Math.max(...existingNumbers.filter((n) => !isNaN(n) && n > 0));
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
      skills: [],
      interest_domains: [],
      status: 'actif',
    };

    // Enregistrer de manière centralisée dans `contact_messages`
    try {
      await supabase.from('contact_messages').insert({
        name: `${newMember.first_name} ${newMember.last_name}`,
        email: newMember.email,
        subject: `AJPK_MEMBER:${newMember.member_number}`,
        message: JSON.stringify(newMember),
      });
    } catch (syncErr) {
      console.error('Erreur enregistrement contact_messages Supabase:', syncErr);
    }

    return NextResponse.json({
      success: true,
      member: newMember,
      message: 'Membre enregistré avec succès avec numéro unique.',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erreur serveur';
    console.error('Erreur POST /api/members:', err);
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
