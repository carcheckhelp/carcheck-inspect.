
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import CustomerConfirmationEmail from '@/components/emails/CustomerConfirmationEmail';
import InspectorNotificationEmail from '@/components/emails/InspectorNotificationEmail';

export const dynamic = 'force-dynamic'; // This is the fix!

const resend = new Resend(process.env.RESEND_API_KEY);
const inspectorEmail = process.env.INSPECTOR_EMAIL || 'carcheckhelp1@outlook.com';
const fromEmail = 'Notificaciones CarCheck <notificacion@carcheckdr.com>';

export async function POST(request: Request) {
  const body = await request.json();
  const { orderNumber, selectedPackage, personalInfo, vehicleInfo, sellerInfo } = body;

  // Basic validation to ensure we have the data we need
  if (!orderNumber || !selectedPackage || !personalInfo || !vehicleInfo || !sellerInfo) {
    return new Response(JSON.stringify({ error: "Faltan datos en la solicitud." }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // --- STEP 1: Send Customer Confirmation Email ---
    const customerEmailData = await resend.emails.send({
      from: fromEmail,
      to: [personalInfo.email],
      subject: `✅ Confirmación de Cita - Orden #${orderNumber}`,
      react: CustomerConfirmationEmail({
        orderNumber,
        packageName: selectedPackage.name,
        price: selectedPackage.price,
        clientName: personalInfo.name,
        vehicleMake: vehicleInfo.make,
        vehicleModel: vehicleInfo.model,
        vehicleYear: parseInt(vehicleInfo.year, 10),
        appointmentDate: vehicleInfo.appointmentDate,
        appointmentTime: vehicleInfo.appointmentTime,
      }),
    });

    // If customer email fails, stop and return error
    if (customerEmailData.error) {
      console.error("Error al enviar correo al cliente:", customerEmailData.error);
      return new Response(JSON.stringify({ 
        message: "Error al enviar el correo de confirmación al cliente.",
        error: customerEmailData.error.message 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // --- STEP 2: Send Inspector Notification Email ---
    const inspectorEmailData = await resend.emails.send({
      from: fromEmail,
      to: [inspectorEmail],
      subject: `🚨 Nueva Cita de Inspección - Orden #${orderNumber}`,
      react: InspectorNotificationEmail({
        orderNumber,
        packageName: selectedPackage.name,
        price: selectedPackage.price,
        clientName: personalInfo.name,
        clientPhone: personalInfo.phone,
        clientEmail: personalInfo.email,
        sellerName: sellerInfo.sellerName,
        sellerPhone: sellerInfo.sellerPhone,
        vehicleMake: vehicleInfo.make,
        vehicleModel: vehicleInfo.model,
        vehicleYear: parseInt(vehicleInfo.year, 10),
        vehicleVin: vehicleInfo.vin,
        appointmentDate: vehicleInfo.appointmentDate,
        appointmentTime: vehicleInfo.appointmentTime,
      }),
    });

    // If inspector email fails, return error (but know customer email succeeded)
    if (inspectorEmailData.error) {
      console.error("Error al enviar correo al inspector:", inspectorEmailData.error);
      return new Response(JSON.stringify({ 
        message: "El correo del cliente se envió, pero falló el del inspector.",
        error: inspectorEmailData.error.message 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // --- SUCCESS: Both emails were sent ---
    return NextResponse.json({ message: "Ambos correos fueron enviados con éxito." });

  } catch (e: any) {
    console.error("Error catastrófico en /api/send-emails:", e);
    return new Response(JSON.stringify({ error: 'Error interno del servidor', details: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
