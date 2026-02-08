'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const ConfirmationPage = () => {
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [emailStatus, setEmailStatus] = useState('sending'); // sending, sent, error

  useEffect(() => {
    // Extract all data from localStorage
    const orderNumber = localStorage.getItem('orderNumber');
    const selectedPackageStr = localStorage.getItem('selectedPackage');
    const personalInfoStr = localStorage.getItem('personalInfo');
    const vehicleInfoStr = localStorage.getItem('vehicleInfo');
    const sellerInfoStr = localStorage.getItem('sellerInfo');
    const paymentMethod = localStorage.getItem('paymentMethod');

    if (orderNumber && selectedPackageStr && personalInfoStr && vehicleInfoStr && sellerInfoStr) {
      const summary = {
        orderNumber,
        selectedPackage: JSON.parse(selectedPackageStr),
        personalInfo: JSON.parse(personalInfoStr),
        vehicleInfo: JSON.parse(vehicleInfoStr),
        sellerInfo: JSON.parse(sellerInfoStr),
        paymentMethod,
      };
      setOrderDetails(summary);

      // Trigger email sending
      sendEmails(summary);

      // Clean up localStorage
      localStorage.removeItem('selectedPackage');
      localStorage.removeItem('personalInfo');
      localStorage.removeItem('vehicleInfo');
      localStorage.removeItem('sellerInfo');
      localStorage.removeItem('paymentMethod');
    }

  }, []);

  const sendEmails = async (payload: any) => {
    try {
      const response = await fetch('/api/send-emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to send emails');
      }
      setEmailStatus('sent');
    } catch (error) {
      console.error("Email sending failed:", error);
      setEmailStatus('error');
    }
  };
  
  const renderEmailStatus = () => {
    switch (emailStatus) {
        case 'sending':
            return <p className="text-yellow-400 animate-pulse">Enviando correos de confirmación...</p>;
        case 'sent':
            return <p className="text-green-400">¡Correos de confirmación enviados! Revisa tu bandeja de entrada.</p>;
        case 'error':
            return <p className="text-red-500">Error al enviar los correos. Por favor, contacta a soporte.</p>;
        default:
            return null;
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6 sm:p-8 text-center">
        <div className="w-full max-w-3xl bg-black rounded-2xl shadow-2xl shadow-yellow-500/20 border border-yellow-500/30 p-8 sm:p-12">
            
            <div className="mb-6">
                <svg className="w-24 h-24 text-green-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-green-400 mb-4">¡Cita Confirmada!</h1>
            
            {orderDetails ? (
              <>
                <p className="text-lg sm:text-xl text-gray-300 mb-2">Gracias, <span className="font-bold text-white">{orderDetails.personalInfo.name}</span>. Hemos recibido tu solicitud.</p>
                <p className="text-lg sm:text-xl text-gray-300 mb-8">
                    Tu número de orden es: <span className="font-mono bg-gray-800 text-yellow-400 py-1 px-3 rounded-md">{orderDetails.orderNumber}</span>
                </p>
                
                <div className="w-full text-center mb-10">
                     {renderEmailStatus()}
                </div>

                <div className="text-sm text-gray-400">
                    <p>Un inspector se pondrá en contacto contigo en breve.</p>
                </div>
              </>
            ) : (
                <p className="text-lg sm:text-xl text-gray-300 mb-8">Cargando detalles de la orden...</p>
            )}

            <div className="mt-10">
                <Link href="/" className="bg-yellow-500 text-black font-bold py-3 px-8 rounded-lg hover:bg-yellow-400 transition-colors duration-300">
                    Volver al Inicio
                </Link>
            </div>
        </div>
    </div>
  );
};

export default ConfirmationPage;
