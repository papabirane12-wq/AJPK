import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Profile } from '@/types';

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

// Profil officiel de l'administrateur Ibrahima Samb
const adminIbrahimaSamb: Profile & { payment_ref: string; payment_method: string; payment_amount: number; payment_date: string } = {
  id: 'usr-admin-1',
  email: 'ibrahima.samb@ajpk.sn',
  first_name: 'Ibrahima',
  last_name: 'Samb',
  member_number: 'AJPK-00011',
  phone: '+221 77 000 00 11',
  date_of_birth: '1998-10-10',
  sex: 'M',
  address: 'Kelle, Sénégal',
  profession: 'Développeur web',
  education_level: 'Licence Informatique & Développement Web',
  avatar_url: '',
  bio: 'Administrateur de la plateforme AJPK & Développeur web engagé pour la jeunesse de Kelle.',
  role: 'super_admin',
  status: 'actif',
  created_at: '2026-10-10T12:00:00Z',
  skills: ['Développement web', 'Next.js', 'React', 'TypeScript', 'Administration Système'],
  interest_domains: ['Technologie', 'Numérique', 'Jeunesse', 'Innovation'],
  payment_ref: 'OFFICIEL_ADMIN',
  payment_method: 'Administrateur',
  payment_amount: 0,
  payment_date: '2026-10-10 12:00:00',
};

export async function GET() {
  try {
    // 1. Interroger directement l'API officielle Unitech Pay pour les paiements en direct
    const res = await fetch(`${UNITECH_API_URL}?action=transactions`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${UNITECH_API_KEY}` },
      cache: 'no-store',
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return NextResponse.json({ success: false, message: 'Erreur Unitech Pay' }, { status: 500 });
    }

    // 2. FILTRER STRICTEMENT LES PAIEMENTS VALIDÉS (status === 'completed' et montant === 1050)
    const completedTransactions: any[] = (data.data?.transactions || []).filter(
      (t: any) => t.status === 'completed' && parseFloat(t.amount) === 1050
    );

    // Trier par ordre chronologique de paiement (du plus ancien au plus récent)
    completedTransactions.sort(
      (a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    // 3. Récupérer les photos de profil et informations enregistrées en base Supabase
    const avatarMap = new Map<string, string>();
    const detailsMap = new Map<string, any>();

    try {
      const { data: messages } = await supabase
        .from('contact_messages')
        .select('message')
        .like('subject', 'AJPK_MEMBER:%');

      if (messages) {
        for (const row of messages) {
          try {
            const m = JSON.parse(row.message);
            const ref = m.payment_ref;
            const phone = m.phone ? m.phone.replace(/[^0-9]/g, '') : '';
            if (ref) {
              if (m.avatar_url) avatarMap.set(ref, m.avatar_url);
              detailsMap.set(ref, m);
            }
            if (phone) {
              if (m.avatar_url) avatarMap.set(phone, m.avatar_url);
              detailsMap.set(phone, m);
            }
          } catch {
            // Ignorer
          }
        }
      }
    } catch (e) {
      console.error('Erreur lecture détails base de données:', e);
    }

    // 4. Numérotation séquentielle et stricte
    // AJPK-00011 est réservé à l'administrateur Ibrahima Samb
    let currentNumber = 1;
    const validatedMembers: Profile[] = completedTransactions.map((t) => {
      // Si on arrive sur 11, on saute 11 car il appartient à Ibrahima Samb
      if (currentNumber === 11) {
        currentNumber++;
      }
      const member_number = `AJPK-${String(currentNumber).padStart(5, '0')}`;
      currentNumber++;

      const cleanPhone = (t.customer_number || '').replace(/[^0-9]/g, '');

      let fullName = 'Adhérent';
      try {
        const meta = typeof t.metadata === 'string' ? JSON.parse(t.metadata) : t.metadata;
        if (meta?.description) {
          fullName = meta.description.replace(/^Adhésion\s+AJPK\s*-\s*/i, '').trim();
        }
      } catch {
        // Ignorer
      }

      const extraDetails = detailsMap.get(t.reference) || detailsMap.get(cleanPhone) || {};

      const parts = (extraDetails.first_name && extraDetails.last_name)
        ? [extraDetails.first_name, extraDetails.last_name]
        : fullName.split(/\s+/).filter(Boolean);

      const firstName = extraDetails.first_name || (parts.length > 1 ? parts.slice(0, -1).join(' ') : parts[0] || 'Membre');
      const lastName = extraDetails.last_name || (parts.length > 1 ? parts[parts.length - 1] : 'AJPK');

      const avatar = avatarMap.get(t.reference) || avatarMap.get(cleanPhone) || extraDetails.avatar_url || '';

      const memberObj: Profile & { payment_ref: string; payment_method: string; payment_amount: number; payment_date: string } = {
        id: `usr-unitech-${t.id}`,
        first_name: firstName,
        last_name: lastName,
        email: extraDetails.email || `${firstName.toLowerCase().replace(/[^a-z0-9]/g, '')}.${lastName.toLowerCase().replace(/[^a-z0-9]/g, '') || cleanPhone}@ajpk.sn`,
        phone: cleanPhone.startsWith('221') ? `+${cleanPhone}` : `+221 ${cleanPhone}`,
        member_number,
        address: extraDetails.address || 'Commune de Kelle',
        profession: extraDetails.profession || 'Membre Adhérent',
        date_of_birth: extraDetails.date_of_birth || '',
        sex: extraDetails.sex || 'M',
        education_level: extraDetails.education_level || 'Membre AJPK',
        avatar_url: avatarPreviewOrEmpty(avatar),
        bio: extraDetails.bio || 'Adhérent officiel de l’Association de la Jeunesse Polyvalente de Kelle.',
        role: 'member',
        status: 'actif',
        created_at: t.created_at ? new Date(t.created_at).toISOString() : new Date().toISOString(),
        skills: extraDetails.skills || [],
        interest_domains: extraDetails.interest_domains || [],
        payment_ref: t.reference,
        payment_method: t.method === 'wave' ? 'Wave Sénégal' : 'Orange Money',
        payment_amount: 1050,
        payment_date: t.created_at,
      };

      return memberObj;
    });

    // 5. Inclure Ibrahima Samb (l'administrateur super_admin AJPK-00011)
    const allMembers: Profile[] = [adminIbrahimaSamb, ...validatedMembers];

    // Tri par numéro d'adhérent décroissant
    allMembers.sort((a, b) => {
      const numA = parseInt(a.member_number.replace(/[^0-9]/g, ''), 10) || 0;
      const numB = parseInt(b.member_number.replace(/[^0-9]/g, ''), 10) || 0;
      return numB - numA;
    });

    return NextResponse.json({
      success: true,
      members: allMembers,
      count: allMembers.length,
    });
  } catch (error: unknown) {
    console.error('Erreur GET /api/members:', error);
    return NextResponse.json({ success: false, members: [adminIbrahimaSamb], count: 1 }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { first_name, last_name, email, phone, address, profession, avatar_url, role = 'member', payment_ref, payment_method } = body;

    if (!first_name || !last_name) {
      return NextResponse.json({ success: false, message: 'Prénom et nom obligatoires.' }, { status: 400 });
    }

    const cleanPhone = (phone || '').replace(/[^0-9]/g, '');
    const cleanEmail = email || `${first_name.toLowerCase().replace(/\s+/g, '')}.${last_name.toLowerCase().replace(/\s+/g, '') || cleanPhone}@ajpk.sn`;

    // 1. Lire les membres existants en base de données pour calculer le numéro suivant
    const existingNums: number[] = [11]; // 11 est réservé à Ibrahima Samb
    try {
      const { data: messages } = await supabase
        .from('contact_messages')
        .select('subject')
        .like('subject', 'AJPK_MEMBER:%');

      if (messages) {
        for (const row of messages) {
          const match = row.subject?.match(/AJPK-(\d+)/i);
          if (match) existingNums.push(parseInt(match[1], 10));
        }
      }
    } catch (e) {
      console.error(e);
    }

    const maxNum = Math.max(...existingNums.filter((n) => !isNaN(n) && n > 0));
    let nextNum = maxNum + 1;
    if (nextNum === 11) nextNum = 12;
    const member_number = `AJPK-${String(nextNum).padStart(5, '0')}`;

    const newMemberRecord: Profile & { payment_ref: string; payment_method: string; payment_amount: number } = {
      id: `usr-db-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      email: cleanEmail,
      phone: phone || '',
      member_number,
      address: address || 'Commune de Kelle',
      profession: profession || 'Membre AJPK',
      date_of_birth: '',
      sex: 'M',
      education_level: 'Membre AJPK',
      avatar_url: avatarPreviewOrEmpty(avatar_url),
      bio: 'Adhérent officiel de l’Association de la Jeunesse Polyvalente de Kelle.',
      role: role as Profile['role'],
      status: 'actif',
      created_at: new Date().toISOString(),
      skills: [],
      interest_domains: [],
      payment_ref: payment_ref || '',
      payment_method: payment_method || 'Wave',
      payment_amount: 1050,
    };

    // 2. Enregistrer directement dans la base de données Supabase
    await supabase.from('contact_messages').insert({
      name: `${first_name} ${last_name}`,
      email: cleanEmail,
      subject: `AJPK_MEMBER:${member_number}`,
      message: JSON.stringify(newMemberRecord),
    });

    return NextResponse.json({
      success: true,
      member: newMemberRecord,
      message: 'Membre validé et enregistré en base de données avec succès.',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erreur serveur';
    console.error('Erreur POST /api/members:', err);
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
