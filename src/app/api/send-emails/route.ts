import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import UnifiedEmailTemplate from '@/components/emails/UnifiedEmailTemplate';

export const dynamic = 'force-dynamic';

const resend = new Resend(process.env.RESEND_API_KEY);
const inspectorEmail = process.env.INSPECTOR_EMAIL || 'carcheckhelp1@outlook.com';

// TEMPORARY FIX: Use Resend's special address until the custom domain is verified.
const fromEmail = 'CarCheck <onboarding@resend.dev>';

export async function POST(request: Request) {
  const body = await request.json();

  // --- 1. Basic Validation ---
  if (!process.env.RESEND_API_KEY) {
    console.error('FATAL: RESEND_API_KEY is not set on the server.');
    return new Response(JSON.stringify({ error: 'Server configuration incomplete.' }), { status: 500 });
  }

  const { orderNumber, personalInfo, vehicleInfo, sellerInfo, selectedPackage } = body;
  if (!orderNumber || !personalInfo?.email || !vehicleInfo || !selectedPackage) {
    return new Response(JSON.stringify({ error: 'Missing essential data in the request.' }), { status: 400 });
  }

  // --- 2. Send Customer Email & CHECK RESPONSE ---
  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [personalInfo.email],
      subject: `✅ Confirmación de Cita CarCheck - Orden #${orderNumber}`,
      react: UnifiedEmailTemplate({ ...body, forInspector: false }),
    });

    if (error) {
      console.error(`Resend failed to send customer email (Order #${orderNumber}):`, error);
      return new Response(JSON.stringify({ 
        error: 'Failed to send customer confirmation email.',
        details: error.message 
      }), { status: 500 });
    }

  } catch (e: any) {
    console.error(`Catastrophic failure during customer email send (Order #${orderNumber}):`, e);
    return new Response(JSON.stringify({ error: 'An unexpected error occurred.', details: e.message }), { status: 500 });
  }

  // --- 3. Send Inspector Email & CHECK RESPONSE ---
  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [inspectorEmail],
      subject: `🚨 Nueva Cita de Inspección - Orden #${orderNumber}`,
      react: UnifiedEmailTemplate({ ...body, forInspector: true }),
    });

    if (error) {
      console.error(`Resend failed to send inspector email (Order #${orderNumber}):`, error);
      return new Response(JSON.stringify({ 
        error: 'Customer email sent, but failed to send inspector notification.',
        details: error.message 
      }), { status: 500 });
    }

  } catch (e: any) {
    console.error(`Catastrophic failure during inspector email send (Order #${orderNumber}):`, e);
    return new Response(JSON.stringify({ error: 'An unexpected error occurred.', details: e.message }), { status: 500 });
  }

  // --- 4. Success --- 
  return NextResponse.json({ message: 'Emails sent successfully.' });
}
