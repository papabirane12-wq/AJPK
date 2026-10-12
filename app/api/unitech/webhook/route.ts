import { NextResponse } from 'next/server';
import crypto from 'crypto';

const UNITECH_API_KEY = process.env.UNITECH_PAY_API_KEY || '4c53ad12e1e4bcaa5d65576fadfef7618dfa7fd495124f7d8093968d5d0e505c';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signatureHeader = request.headers.get('x-unitechpay-signature') || '';

    let payload: Record<string, unknown> = {};
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid JSON payload' }, { status: 400 });
    }

    // Vérification de la signature HMAC-SHA256
    const expectedHeaderSig = crypto.createHmac('sha256', UNITECH_API_KEY).update(rawBody).digest('hex');

    // Vérification alternative par champs du corps
    const canonicalString = `${payload.event || ''}|${payload.reference || ''}|${payload.amount || ''}|${payload.status || ''}|${payload.signed_at || ''}`;
    const expectedBodySig = crypto.createHmac('sha256', UNITECH_API_KEY).update(canonicalString).digest('hex');

    const bodySig = (payload.signature as string) || '';

    const isValid = signatureHeader === expectedHeaderSig || bodySig === expectedBodySig;

    if (!isValid && process.env.NODE_ENV === 'production') {
      console.warn('Webhook Unitech Pay: signature invalide');
      return NextResponse.json({ success: false, message: 'Signature invalide' }, { status: 401 });
    }

    console.log('Webhook Unitech Pay reçu avec succès:', {
      event: payload.event,
      reference: payload.reference,
      status: payload.status,
      amount: payload.amount,
    });

    return NextResponse.json({
      success: true,
      message: 'Webhook traité avec succès',
      received_event: payload.event,
    });
  } catch (error: unknown) {
    console.error('Erreur traitement webhook Unitech Pay:', error);
    return NextResponse.json({ success: false, message: 'Erreur interne' }, { status: 500 });
  }
}
