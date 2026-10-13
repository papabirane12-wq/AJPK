import { NextResponse } from 'next/server';

const UNITECH_API_URL = 'https://api.unitech.sn/api.php';
const UNITECH_API_KEY = process.env.UNITECH_PAY_API_KEY || '4c53ad12e1e4bcaa5d65576fadfef7618dfa7fd495124f7d8093968d5d0e505c';

export const dynamic = 'force-dynamic';

export interface UnitechTransactionItem {
  id: number;
  reference: string;
  amount: number;
  method: string;
  methodName: string;
  status: 'completed' | 'pending' | 'failed';
  phone: string;
  customerName: string;
  description: string;
  date: string;
}

export async function GET() {
  try {
    const response = await fetch(`${UNITECH_API_URL}?action=transactions&limit=500`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${UNITECH_API_KEY}`,
      },
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return NextResponse.json(
        { success: false, message: data.message || 'Impossible de récupérer les transactions Unitech Pay.' },
        { status: 400 }
      );
    }

    // Filtrer STRICTEMENT les transactions AJPK (1 050 FCFA ou description contenant AJPK)
    // afin d'écarter les transactions externes du compte Unitech (ex: abonnements TEKBIZ)
    const rawList: any[] = (data.data?.transactions || []).filter((t: any) => {
      const amount = parseFloat(t.amount);
      const is1050 = amount === 1050;
      let isAjpkMeta = false;
      try {
        const meta = typeof t.metadata === 'string' ? JSON.parse(t.metadata) : t.metadata;
        if (meta?.description && /AJPK/i.test(meta.description)) isAjpkMeta = true;
      } catch {
        if (t.metadata && /AJPK/i.test(String(t.metadata))) isAjpkMeta = true;
      }
      return is1050 || isAjpkMeta;
    });

    const formatted: UnitechTransactionItem[] = rawList.map((t) => {
      let customerName = 'Adhérent Inconnu';
      let description = '';
      try {
        const meta = typeof t.metadata === 'string' ? JSON.parse(t.metadata) : t.metadata;
        if (meta?.description) {
          description = meta.description;
          customerName = meta.description.replace(/^Adhésion\s+AJPK\s*-\s*/i, '').trim();
        }
      } catch {
        // Ignorer parse error
      }

      const methodName =
        t.method === 'wave'
          ? 'Wave Sénégal'
          : t.method === 'orange' || t.method === 'om'
          ? 'Orange Money'
          : t.method;

      return {
        id: t.id,
        reference: t.reference,
        amount: parseFloat(t.amount) || 1050,
        method: t.method,
        methodName,
        status: (t.status as 'completed' | 'pending' | 'failed') || 'pending',
        phone: t.customer_number || '',
        customerName,
        description,
        date: t.created_at,
      };
    });

    // Statistiques rapides
    const totalCompleted = formatted.filter((t) => t.status === 'completed');
    const totalPending = formatted.filter((t) => t.status === 'pending');
    const totalAmountCollected = totalCompleted.reduce((acc, curr) => acc + curr.amount, 0);

    return NextResponse.json({
      success: true,
      transactions: formatted,
      count: formatted.length,
      stats: {
        completedCount: totalCompleted.length,
        pendingCount: totalPending.length,
        totalCollected: totalAmountCollected,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erreur de connexion.';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
