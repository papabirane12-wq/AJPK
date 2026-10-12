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

export async function GET() {
  try {
    // 1. Interroger directement l'API officielle Unitech Pay
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

    // 3. Récupérer les photos de profil uploadées depuis Supabase contact_messages
    const avatarMap = new Map<string, string>();
    try {
      const { data: messages } = await supabase
        .from('contact_messages')
        .select('message')
        .like('subject', 'AJPK_MEMBER:%');

      if (messages) {
        for (const row of messages) {
          try {
            const m = JSON.parse(row.message);
            if (m.avatar_url && (m.phone || m.payment_ref)) {
              if (m.payment_ref) avatarMap.set(m.payment_ref, m.avatar_url);
              if (m.phone) avatarMap.set(m.phone.replace(/[^0-9]/g, ''), m.avatar_url);
            }
          } catch {
            // Ignorer
          }
        }
      }
    } catch (e) {
      console.error('Erreur lecture avatars:', e);
    }

    // 4. Construire la liste EXCLUSIVE des membres à partir des paiements validés
    const membersList: Profile[] = completedTransactions.map((t, index) => {
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

      const parts = fullName.split(/\s+/).filter(Boolean);
      const firstName = parts.length > 1 ? parts.slice(0, -1).join(' ') : parts[0] || 'Membre';
      const lastName = parts.length > 1 ? parts[parts.length - 1] : 'AJPK';

      // Numéro d'adhérent strictement unique attribué dans l'ordre chronologique de validation
      const member_number = `AJPK-${String(index + 1).padStart(5, '0')}`;

      const avatar = avatarMap.get(t.reference) || avatarMap.get(cleanPhone) || '';

      const memberObj: Profile & { payment_ref: string; payment_method: string; payment_amount: number; payment_date: string } = {
        id: `usr-unitech-${t.id}`,
        first_name: firstName,
        last_name: lastName,
        email: `${firstName.toLowerCase().replace(/[^a-z0-9]/g, '')}.${lastName.toLowerCase().replace(/[^a-z0-9]/g, '') || cleanPhone}@ajpk.sn`,
        phone: cleanPhone.startsWith('221') ? `+${cleanPhone}` : `+221 ${cleanPhone}`,
        member_number,
        address: 'Commune de Kelle',
        profession: 'Membre Adhérent',
        date_of_birth: '',
        sex: 'M',
        education_level: 'Membre AJPK',
        avatar_url: avatarPreviewOrEmpty(avatar),
        bio: 'Adhérent officiel de l’Association de la Jeunesse Polyvalente de Kelle.',
        role: 'member',
        status: 'actif',
        created_at: t.created_at ? new Date(t.created_at).toISOString() : new Date().toISOString(),
        skills: [],
        interest_domains: [],
        payment_ref: t.reference,
        payment_method: t.method === 'wave' ? 'Wave Sénégal' : 'Orange Money',
        payment_amount: 1050,
        payment_date: t.created_at,
      };

      return memberObj;
    });

    // Tri par numéro d'adhérent décroissant (les derniers inscrits en premier)
    membersList.sort((a, b) => {
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
    return NextResponse.json({ success: false, members: [], count: 0 }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { first_name, last_name, email, phone, address, profession, avatar_url, role = 'member', payment_ref, payment_method } = body;

    if (!first_name || !last_name) {
      return NextResponse.json({ success: false, message: 'Prénom et nom obligatoires.' }, { status: 400 });
    }

    // Sauvegarder la photo et les coordonnées dans Supabase contact_messages
    const cleanPhone = (phone || '').replace(/[^0-9]/g, '');
    const cleanEmail = email || `${first_name.toLowerCase().replace(/\s+/g, '')}.${last_name.toLowerCase().replace(/\s+/g, '') || cleanPhone}@ajpk.sn`;

    const newMemberRecord = {
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      email: cleanEmail,
      phone: phone || '',
      address: address || 'Commune de Kelle',
      profession: profession || 'Membre AJPK',
      avatar_url: avatarPreviewOrEmpty(avatar_url),
      payment_ref: payment_ref || '',
      payment_method: payment_method || '',
      payment_amount: 1050,
      created_at: new Date().toISOString(),
    };

    await supabase.from('contact_messages').insert({
      name: `${first_name} ${last_name}`,
      email: cleanEmail,
      subject: `AJPK_MEMBER:${payment_ref || cleanPhone}`,
      message: JSON.stringify(newMemberRecord),
    });

    return NextResponse.json({
      success: true,
      message: 'Informations d’adhésion enregistrées avec succès.',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erreur serveur';
    console.error('Erreur POST /api/members:', err);
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
