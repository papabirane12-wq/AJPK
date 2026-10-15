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

// 1. Dictionnaire IMMUABLE des numéros de membres officiels verrouillés
// Ces numéros sont DÉFINITIFS, GRAVÉS DANS LE MARBRE et ne changeront JAMAIS en production.
// AUCUN membre validé n'est supprimé lors de l'arrivée d'un nouveau membre.
const LOCKED_MEMBER_REGISTRY: Record<string, string> = {
  // Administrateur Officiel
  'ADMIN_OFFICIEL': 'AJPK-00011',
  '770000011': 'AJPK-00011',

  // Membres fondateurs et adhérents validés
  'wave_6acce4d611ce9_1791812822': 'AJPK-00001', // Banda Niang
  'wave_6acce9c1c3da1_1791814081': 'AJPK-00002', // ABDOUL KARIM FALL
  'wave_6accee04c764a_1791815172': 'AJPK-00003', // Papa Mouhamed NDIAYE
  'wave_6accf1ba6d675_1791816122': 'AJPK-00004', // Mbissane Ndiaye
  'orange_om_6accf4cac3fb0_1791816906': 'AJPK-00005', // Moustapha NDIAYE
  'wave_6accfe642a99d_1791819364': 'AJPK-00006', // Aïtou Ndiaye
  'wave_6accfeb78300b_1791819447': 'AJPK-00007', // Papa birane SAMB
  'wave_6acd0304299df_1791820548': 'AJPK-00008', // Abdoulaye Faye
  'wave_6acd032c42a2b_1791820588': 'AJPK-00009', // Ousmane Ba
  'wave_6acd0778b64bf_1791821688': 'AJPK-00010', // Baye Mbaye Fall
  'wave_6acd0b7c35cb5_1791822716': 'AJPK-00012', // Papa amadou Faye
  'wave_6acd2eba5498b_1791831738': 'AJPK-00013', // Marie José Boye
  'wave_6acd3ac9cb30c_1791834825': 'AJPK-00014', // Alioune NDIAYE
  'wave_6acd3e1591956_1791835669': 'AJPK-00015', // Issa Ndour
  'wave_6acd463724578_1791837751': 'AJPK-00016', // Jamal Mouhamed Soumare
  'wave_6acd4b839cb39_1791839107': 'AJPK-00017', // Daouda Assane Ciss
  'wave_6acd702549dc8_1791848485': 'AJPK-00018', // Tanor Dieng
  'wave_6acdfa6311fda_1791883875': 'AJPK-00019', // Cheikhou Niang
  'wave_6ace06e2747e2_1791887074': 'AJPK-00020', // Abdou Karim Ndiaye
  'wave_6ace14aeab827_1791890606': 'AJPK-00021',
  'wave_6ace1df8ec072_1791892984': 'AJPK-00022',
  'wave_6ace33796ff65_1791898489': 'AJPK-00023',
  'wave_6ace56c1ccdac_1791907521': 'AJPK-00024',
  'wave_6ace5f782c5cb_1791909752': 'AJPK-00025',
  'wave_6ace84405ebb7_1791919168': 'AJPK-00026',
  'wave_6acead7691ffd_1791929718': 'AJPK-00027',
  'wave_6acebec978266_1791934153': 'AJPK-00028',
  'wave_6acebef2d9ee5_1791934194': 'AJPK-00029',
  'wave_6ad0b979563a0_1792063865': 'AJPK-00030',
  'wave_6ad0b9c63a8c7_1792063942': 'AJPK-00031',
  'wave_6ad0bb97171ef_1792064407': 'AJPK-00032',
  'wave_6ad0c56769e8b_1792066919': 'AJPK-00033',
};

// Profil officiel de l'administrateur Ibrahima Samb
const adminIbrahimaSamb: Profile & { payment_ref: string; payment_method: string; payment_amount: number; payment_date: string } = {
  id: 'usr-admin-ibrahima-samb',
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
  payment_ref: 'ADMIN_OFFICIEL',
  payment_method: 'Administrateur',
  payment_amount: 0,
  payment_date: '2026-10-10 12:00:00',
};

export async function GET() {
  try {
    // 1. Interroger l'API officielle Unitech Pay avec une limite large (limit=500) pour ne JAMAIS perdre d'anciens paiements
    let completedTransactions: any[] = [];
    try {
      const res = await fetch(`${UNITECH_API_URL}?action=transactions&limit=500`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${UNITECH_API_KEY}` },
        cache: 'no-store',
      });

      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.data?.transactions)) {
        completedTransactions = data.data.transactions.filter(
          (t: any) => t.status === 'completed' && parseFloat(t.amount) === 1050
        );
      }
    } catch (apiErr) {
      console.error('Erreur appel Unitech Pay:', apiErr);
    }

    // Trier du plus ancien au plus récent
    completedTransactions.sort(
      (a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    // 2. Récupérer les photos, informations et numéros assignés en base de données Supabase
    const dbMembersMap = new Map<string, { member_number?: string; avatar_url?: string; extra?: any }>();
    const assignedNumbers = new Set<number>();
    assignedNumbers.add(11); // 11 est réservé à Ibrahima Samb

    // Enregistrer d'abord tous les numéros du registre verrouillé
    for (const [key, numStr] of Object.entries(LOCKED_MEMBER_REGISTRY)) {
      const match = numStr.match(/AJPK-(\d+)/i);
      if (match) assignedNumbers.add(parseInt(match[1], 10));
      dbMembersMap.set(key, { member_number: numStr });
    }

    // Récupérer les membres stockés dans Supabase contact_messages
    try {
      const { data: messages } = await supabase
        .from('contact_messages')
        .select('subject, message')
        .like('subject', 'AJPK_MEMBER:%');

      if (messages) {
        for (const row of messages) {
          try {
            const m = JSON.parse(row.message);
            const ref = m.payment_ref;
            const phone = m.phone ? m.phone.replace(/[^0-9]/g, '') : '';
            const num = m.member_number;

            if (num) {
              const match = num.match(/AJPK-(\d+)/i);
              if (match) assignedNumbers.add(parseInt(match[1], 10));
            }

            if (ref) {
              const existing = dbMembersMap.get(ref) || {};
              dbMembersMap.set(ref, {
                ...existing,
                member_number: existing.member_number || num,
                avatar_url: m.avatar_url || existing.avatar_url,
                extra: m,
              });
            }

            if (phone) {
              const existing = dbMembersMap.get(phone) || {};
              dbMembersMap.set(phone, {
                ...existing,
                member_number: existing.member_number || num,
                avatar_url: m.avatar_url || existing.avatar_url,
                extra: m,
              });
            }
          } catch {
            // Ignorer
          }
        }
      }
    } catch (e) {
      console.error('Erreur lecture Supabase:', e);
    }

    // 3. Traiter chaque transaction validée
    // Si un numéro est déjà assigné, ON LE GARDE À JAMAIS.
    // Si c'est un nouveau membre en production, on lui assigne le prochain numéro disponible et on le sauvegarde en base.
    let nextAvailableNum = Math.max(...Array.from(assignedNumbers).filter((n) => !isNaN(n) && n > 0 && n < 50000), 10) + 1;

    const validatedMembersMap = new Map<string, Profile>();

    for (const t of completedTransactions) {
      const cleanPhone = (t.customer_number || '').replace(/[^0-9]/g, '');
      const ref = t.reference;

      const record = dbMembersMap.get(ref) || dbMembersMap.get(cleanPhone) || {};

      let member_number = record.member_number;

      if (!member_number) {
        // Nouveau membre qui vient de payer en production !
        if (nextAvailableNum === 11) nextAvailableNum++;
        member_number = `AJPK-${String(nextAvailableNum).padStart(5, '0')}`;
        assignedNumbers.add(nextAvailableNum);
        nextAvailableNum++;

        // Sauvegarder immédiatement dans Supabase pour que son numéro soit fixé pour l'éternité
        try {
          const newRec = {
            member_number,
            payment_ref: ref,
            phone: cleanPhone,
            payment_method: t.method === 'wave' ? 'Wave Sénégal' : 'Orange Money',
            payment_amount: 1050,
            created_at: t.created_at,
          };
          await supabase.from('contact_messages').insert({
            name: `Membre ${member_number}`,
            email: `${member_number.toLowerCase()}@ajpk.sn`,
            subject: `AJPK_MEMBER:${member_number}`,
            message: JSON.stringify(newRec),
          });
        } catch (saveErr) {
          console.error('Erreur sauvegarde nouveau membre:', saveErr);
        }
      }

      let fullName = 'Adhérent';
      try {
        const meta = typeof t.metadata === 'string' ? JSON.parse(t.metadata) : t.metadata;
        if (meta?.description) {
          fullName = meta.description.replace(/^Adhésion\s+AJPK\s*-\s*/i, '').trim();
        }
      } catch {
        // Ignorer
      }

      const extra = record.extra || {};
      const parts = (extra.first_name && extra.last_name)
        ? [extra.first_name, extra.last_name]
        : fullName.split(/\s+/).filter(Boolean);

      const firstName = extra.first_name || (parts.length > 1 ? parts.slice(0, -1).join(' ') : parts[0] || 'Membre');
      const lastName = extra.last_name || (parts.length > 1 ? parts[parts.length - 1] : 'AJPK');
      const avatar = record.avatar_url || extra.avatar_url || '';

      const memberObj: Profile & { payment_ref: string; payment_method: string; payment_amount: number; payment_date: string } = {
        id: `usr-unitech-${t.id}`,
        first_name: firstName,
        last_name: lastName,
        email: extra.email || `${firstName.toLowerCase().replace(/[^a-z0-9]/g, '')}.${lastName.toLowerCase().replace(/[^a-z0-9]/g, '') || cleanPhone}@ajpk.sn`,
        phone: cleanPhone.startsWith('221') ? `+${cleanPhone}` : `+221 ${cleanPhone}`,
        member_number,
        address: extra.address || 'Commune de Kelle',
        profession: extra.profession || 'Membre Adhérent',
        date_of_birth: extra.date_of_birth || '',
        sex: extra.sex || 'M',
        education_level: extra.education_level || 'Membre AJPK',
        avatar_url: avatarPreviewOrEmpty(avatar),
        bio: extra.bio || 'Adhérent officiel de l’Association de la Jeunesse Polyvalente de Kelle.',
        role: 'member',
        status: 'actif',
        created_at: t.created_at ? new Date(t.created_at).toISOString() : new Date().toISOString(),
        skills: extra.skills || [],
        interest_domains: extra.interest_domains || [],
        payment_ref: ref,
        payment_method: t.method === 'wave' ? 'Wave Sénégal' : 'Orange Money',
        payment_amount: 1050,
        payment_date: t.created_at,
      };

      validatedMembersMap.set(member_number, memberObj);
    }

    // 4. Inclure Ibrahima Samb (l'administrateur super_admin AJPK-00011)
    const allMembers: Profile[] = [adminIbrahimaSamb, ...Array.from(validatedMembersMap.values())];

    // Tri par numéro d'adhérent décroissant pour afficher les derniers inscrits en premier
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

    // Vérification STRICTE auprès d'Unitech Pay : SEULS les paiements validés (status === 'completed' et montant 1 050 FCFA) sont acceptés
    if (!payment_ref && role !== 'super_admin' && role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Référence de paiement requise pour valider l’adhésion.' }, { status: 400 });
    }

    if (payment_ref) {
      let isVerifiedCompleted = false;
      try {
        const checkRes = await fetch(`${UNITECH_API_URL}?action=transactions&limit=500`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${UNITECH_API_KEY}` },
          cache: 'no-store',
        });
        const checkData = await checkRes.json();
        const transactions: any[] = checkData.data?.transactions || [];
        const matching = transactions.find(
          (t: any) => t.reference === payment_ref && t.status === 'completed' && parseFloat(t.amount) === 1050
        );
        if (matching) {
          isVerifiedCompleted = true;
        }
      } catch (err) {
        console.error('Erreur vérification transaction Unitech:', err);
      }

      if (!isVerifiedCompleted && !LOCKED_MEMBER_REGISTRY[payment_ref]) {
        return NextResponse.json(
          {
            success: false,
            message: 'Paiement non validé par Unitech Pay. Seuls les paiements validés (1 050 FCFA) peuvent être enregistrés comme membres officiels.',
          },
          { status: 400 }
        );
      }
    }

    const cleanPhone = (phone || '').replace(/[^0-9]/g, '');
    const cleanEmail = email || `${first_name.toLowerCase().replace(/\s+/g, '')}.${last_name.toLowerCase().replace(/\s+/g, '') || cleanPhone}@ajpk.sn`;

    // 1. Vérifier si un numéro est déjà verrouillé pour cette référence
    let member_number = LOCKED_MEMBER_REGISTRY[payment_ref || ''] || LOCKED_MEMBER_REGISTRY[cleanPhone];

    if (!member_number) {
      // Calculer le prochain numéro disponible en base
      const existingNums: number[] = [11];
      for (const numStr of Object.values(LOCKED_MEMBER_REGISTRY)) {
        const m = numStr.match(/AJPK-(\d+)/i);
        if (m) existingNums.push(parseInt(m[1], 10));
      }

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

      const maxNum = Math.max(...existingNums.filter((n) => !isNaN(n) && n > 0 && n < 50000), 10);
      let nextNum = maxNum + 1;
      if (nextNum === 11) nextNum = 12;
      member_number = `AJPK-${String(nextNum).padStart(5, '0')}`;
    }

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

    // 2. Enregistrer définitivement dans la base de données Supabase
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
