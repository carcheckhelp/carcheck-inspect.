import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import UnifiedEmailTemplate from '@/components/emails/UnifiedEmailTemplate';
import fs from 'fs';
import path from 'path';

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

// Helper to log to file
function logToFile(message: string) {
    try {
        const logPath = path.join(process.cwd(), 'public', 'email-debug.log');
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] ${message}\n`;
        // Append to file
        fs.appendFileSync(logPath, logEntry);
    } catch (e) {
        console.error('Failed to write to log file', e);
    }
}

export async function POST(request: Request) {
  let body;
  try {
      body = await request.json();
  } catch (e) {
      return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400 });
  }

  const { orderNumber, personalInfo, vehicleInfo, selectedPackage } = body;
  
  logToFile(`Received request for Order #${orderNumber}`);

  if (!orderNumber || !personalInfo?.email || !vehicleInfo || !selectedPackage) {
    logToFile(`Error: Missing data for Order #${orderNumber}`);
    return new Response(JSON.stringify({ error: 'Faltan datos esenciales en la solicitud.' }), { status: 400 });
  }

  try {
    // --- 2. Send Customer Email (First) ---
    logToFile(`Attempting to send customer email to ${personalInfo.email}`);
    const customerEmailResult = await resend.emails.send({
      from: fromEmail,
      to: [personalInfo.email],
      subject: `✅ Confirmación de Cita CarCheck - Orden #${orderNumber}`,
      react: UnifiedEmailTemplate({ ...body, forInspector: false }),
    });

    if (customerEmailResult.error) {
        logToFile(`CRITICAL FAILURE: Customer email failed. Error: ${JSON.stringify(customerEmailResult.error)}`);
        
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
    logToFile(`Customer email sent successfully. ID: ${customerEmailResult.data?.id}`);

    // --- 3. Wait to avoid Rate Limits ---
    await delay(1500);

    // --- 4. Send Inspector Email (Second) ---
    logToFile(`Attempting to send inspector email to ${inspectorEmail}`);

    const inspectorEmailResult = await resend.emails.send({
      from: fromEmail,
      to: [inspectorEmail],
      subject: `🚨 Nueva Cita de Inspección - Orden #${orderNumber}`,
      react: UnifiedEmailTemplate({ ...body, forInspector: true }),
    });

    if (inspectorEmailResult.error) {
        logToFile(`WARNING: Inspector email failed. Error: ${JSON.stringify(inspectorEmailResult.error)}`);
        console.warn(`WARNING: Customer email sent, but INSPECTOR email failed (Order #${orderNumber}).`, inspectorEmailResult.error);
    } else {
        logToFile(`Inspector email sent successfully. ID: ${inspectorEmailResult.data?.id}`);
    }

    // --- 5. Success --- 
    return NextResponse.json({ 
        message: 'Proceso de correos finalizado.',
        inspectorEmailFailed: !!inspectorEmailResult.error 
    });

  } catch (e: any) {
    logToFile(`Catastrophic failure: ${e.message}`);
    console.error(`Catastrophic failure during email send process (Order #${orderNumber}):`, e);
    
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
