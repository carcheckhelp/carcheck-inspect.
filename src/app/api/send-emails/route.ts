import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import UnifiedEmailTemplate from '@/components/emails/UnifiedEmailTemplate';

export const dynamic = 'force-dynamic';

// FORCE USE OF PROVIDED KEY to rule out environment variable issues
const HARDCODED_KEY = 're_D4i96Sok_7ALptUo2e5foSv5WoTH6Fk1J';
const resendApiKey = HARDCODED_KEY; 

const resend = new Resend(resendApiKey);

// Hardcoded inspector email as requested
const inspectorEmail = 'carcheckhelp1@outlook.com';
const fromEmail = 'CarCheck <onboarding@resend.dev>';

// Helper function to add a delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(request: Request) {
  let body;
  try {
      body = await request.json();
  } catch (e) {
      return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400 });
  }

  const { orderNumber, personalInfo, vehicleInfo, selectedPackage } = body;
  if (!orderNumber || !personalInfo?.email || !vehicleInfo || !selectedPackage) {
    return new Response(JSON.stringify({ error: 'Faltan datos esenciales en la solicitud.' }), { status: 400 });
  }

  try {
    // --- 2. Send Customer Email (First) ---
    const customerEmailResult = await resend.emails.send({
      from: fromEmail,
      to: [personalInfo.email],
      subject: `✅ Confirmación de Cita CarCheck - Orden #${orderNumber}`,
      react: UnifiedEmailTemplate({ ...body, forInspector: false }),
    });

    if (customerEmailResult.error) {
        console.error(`CRITICAL FAILURE: Could not send customer email (Order #${orderNumber}).`, customerEmailResult.error);
        
        // Check specifically for API key error
        if (customerEmailResult.error.message?.includes('API key')) {
             return NextResponse.json({ 
                message: 'Error de configuración de API Key (Correo omitido para permitir flujo).',
                inspectorEmailFailed: true,
                errorDetails: customerEmailResult.error.message
            });
        }

        return new Response(JSON.stringify({ 
            error: 'No se pudo enviar el correo de confirmación. Por favor verifica tu email.',
            details: customerEmailResult.error.message
        }), { status: 500 });
    }

    // --- 3. Wait to avoid Rate Limits ---
    // Resend free tier has a rate limit (e.g. 2 req/sec). We wait 1.5 seconds to be safe.
    await delay(1500);

    // --- 4. Send Inspector Email (Second) ---
    const inspectorEmailResult = await resend.emails.send({
      from: fromEmail,
      to: [inspectorEmail],
      subject: `🚨 Nueva Cita de Inspección - Orden #${orderNumber}`,
      react: UnifiedEmailTemplate({ ...body, forInspector: true }),
    });

    if (inspectorEmailResult.error) {
        console.warn(`WARNING: Customer email sent, but INSPECTOR email failed (Order #${orderNumber}).`, inspectorEmailResult.error);
        // We log the error but do NOT fail the request, as the user has received their confirmation.
    }

    // --- 5. Success --- 
    return NextResponse.json({ 
        message: 'Proceso de correos finalizado.',
        inspectorEmailFailed: !!inspectorEmailResult.error 
    });

  } catch (e: any) {
    console.error(`Catastrophic failure during email send process (Order #${orderNumber}):`, e);
    // If it's an API key error, handle it gracefully
    if (e.message?.includes('API key') || e.statusCode === 401 || e.message?.includes('missing')) {
         return NextResponse.json({ 
            message: 'Error de autenticación con servicio de correos.',
            inspectorEmailFailed: true 
        });
    }

    return new Response(JSON.stringify({ 
      error: 'Ocurrió un error inesperado durante el proceso de envío de correos.', 
      details: e.message 
    }), { status: 500 });
  }
}
