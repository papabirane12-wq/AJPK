import { NextResponse } from 'next/server';

const UNITECH_API_URL = 'https://api.unitech.sn/api.php';
const UNITECH_API_KEY = process.env.UNITECH_PAY_API_KEY || '4c53ad12e1e4bcaa5d65576fadfef7618dfa7fd495124f7d8093968d5d0e505c';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { method, amount = 1050, phone, customerName = 'Membre AJPK', description = 'Frais d’Adhésion & Carte Membre AJPK' } = body;

    if (!phone) {
      return NextResponse.json({ success: false, message: 'Le numéro de téléphone est requis.' }, { status: 400 });
    }

    // Normaliser le numéro sénégalais (ex: +221 77 123 45 67 -> 771234567)
    let cleanPhone = String(phone).replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('221') && cleanPhone.length > 9) {
      cleanPhone = cleanPhone.slice(3);
    }

    const host = request.headers.get('host') || 'ajpk.sn';
    // Protocole strictement HTTPS (aucun HTTP)
    const baseUrl = `https://${host}`;

    let action = 'create_wave_payment';
    let payload: Record<string, unknown> = {
      amount: Number(amount),
      customer_number: cleanPhone,
      description,
      callback_success: `${baseUrl}/inscription?payment_status=success`,
      callback_cancel: `${baseUrl}/inscription?payment_status=cancel`,
    };

    if (method === 'om') {
      action = 'create_orange_om';
      payload = {
        amount: Number(amount),
        customer_number: cleanPhone,
        description,
        callback_success: `${baseUrl}/inscription?payment_status=success`,
        callback_cancel: `${baseUrl}/inscription?payment_status=cancel`,
      };
    }

    const response = await fetch(`${UNITECH_API_URL}?action=${action}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${UNITECH_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return NextResponse.json({
        success: false,
        message: data.message || 'Erreur lors de l’initialisation du paiement Unitech Pay.',
        error: data,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: data.data,
      method,
    });
  } catch (error: unknown) {
    console.error('Erreur Unitech Pay initiate:', error);
    const errMessage = error instanceof Error ? error.message : 'Erreur interne du serveur';
    return NextResponse.json({
      success: false,
      message: errMessage,
    }, { status: 500 });
  }
}
