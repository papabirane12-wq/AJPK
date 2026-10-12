import { NextResponse } from 'next/server';

const UNITECH_API_URL = 'https://api.unitech.sn/api.php';
const UNITECH_API_KEY = process.env.UNITECH_PAY_API_KEY || '4c53ad12e1e4bcaa5d65576fadfef7618dfa7fd495124f7d8093968d5d0e505c';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference');
    const transactionId = searchParams.get('transaction_id');

    if (!reference && !transactionId) {
      return NextResponse.json({
        success: false,
        message: 'Référence ou ID de transaction requis.',
      }, { status: 400 });
    }

    const response = await fetch(`${UNITECH_API_URL}?action=transactions`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${UNITECH_API_KEY}`,
      },
      // Ne pas mettre en cache pour obtenir le statut en temps réel
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return NextResponse.json({
        success: false,
        message: data.message || 'Impossible de récupérer la liste des transactions.',
      }, { status: 400 });
    }

    const transactions: Array<{
      id: number;
      reference: string;
      status: string;
      amount: string;
      method: string;
      customer_number: string;
      created_at: string;
    }> = data.data?.transactions || [];

    const found = transactions.find((t) => {
      if (reference && t.reference === reference) return true;
      if (transactionId && String(t.id) === String(transactionId)) return true;
      return false;
    });

    if (!found) {
      return NextResponse.json({
        success: true,
        status: 'pending',
        message: 'Transaction en cours d’initialisation...',
      });
    }

    // Normalisation du statut Unitech (completed / pending / failed)
    const normalizedStatus =
      found.status === 'completed' || found.status === 'success'
        ? 'completed'
        : found.status === 'failed' || found.status === 'cancelled'
        ? 'failed'
        : 'pending';

    return NextResponse.json({
      success: true,
      status: normalizedStatus,
      rawStatus: found.status,
      transaction: found,
    });
  } catch (error: unknown) {
    console.error('Erreur Unitech Pay status check:', error);
    const errMessage = error instanceof Error ? error.message : 'Erreur interne du serveur';
    return NextResponse.json({
      success: false,
      message: errMessage,
    }, { status: 500 });
  }
}
