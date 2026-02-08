import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import UnifiedEmailTemplate from '@/components/emails/UnifiedEmailTemplate';

// Force dynamic rendering and prevent caching
export const dynamic = 'force-dynamic';

const resend = new Resend(process.env.RESEND_API_KEY);
const inspectorEmail = process.env.INSPECTOR_EMAIL || 'carcheckhelp1@outlook.com';
const fromEmail = 'Notificaciones CarCheck <notificacion@carcheckdr.com>';

export async function POST(request: Request) {
  let body;
  try {
    body = await request.json();
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Cuerpo de la solicitud inválido (no es JSON)' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Validate that the API key is present
  if (!process.env.RESEND_API_KEY) {
    console.error('Error fatal: RESEND_API_KEY no está configurada en el servidor.');
    return new Response(JSON.stringify({ error: 'Configuración del servidor incompleta.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
    });
  }

  // Extract and validate essential data
  const { orderNumber, personalInfo, vehicleInfo, sellerInfo, selectedPackage } = body;
  if (!orderNumber || !personalInfo?.email || !vehicleInfo || !sellerInfo || !selectedPackage) {
    return new Response(JSON.stringify({ 
      error: 'Faltan datos esenciales en la solicitud.',
      details: {
        hasOrderNumber: !!orderNumber,
        hasPersonalInfo: !!personalInfo,
        hasVehicleInfo: !!vehicleInfo,
        hasSellerInfo: !!sellerInfo,
        hasSelectedPackage: !!selectedPackage
      }
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Send email to the customer
    await resend.emails.send({
      from: fromEmail,
      to: [personalInfo.email],
      subject: `✅ Confirmación de Cita CarCheck - Orden #${orderNumber}`,
      react: UnifiedEmailTemplate({ ...body, forInspector: false }),
    });

    // Send notification to the inspector
    await resend.emails.send({
      from: fromEmail,
      to: [inspectorEmail],
      subject: `🚨 Nueva Cita de Inspección - Orden #${orderNumber}`,
      react: UnifiedEmailTemplate({ ...body, forInspector: true }),
    });

    return NextResponse.json({ message: 'Correos enviados con éxito.' });

  } catch (e: any) {
    // This will now catch errors from Resend and provide a specific message
    console.error('Error al enviar los correos desde Resend:', e);
    return new Response(JSON.stringify({ 
      error: 'Ocurrió un error al intentar enviar los correos.',
      details: e.message // This is the crucial part
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
