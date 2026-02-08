'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const ConfirmationPage = () => {
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    // Recuperar los datos de la orden desde localStorage para mostrar el resumen.
    const orderNumber = localStorage.getItem('orderNumber');
    const selectedPackageStr = localStorage.getItem('selectedPackage');
    const personalInfoStr = localStorage.getItem('personalInfo');

    if (orderNumber && selectedPackageStr && personalInfoStr) {
      setOrderDetails({
        orderNumber,
        packageName: JSON.parse(selectedPackageStr).name,
        clientName: JSON.parse(personalInfoStr).name,
      });
    } 

    // Limpiar el localStorage excepto los datos del inspector si son necesarios en otro lugar.
    // Si no lo son, se pueden limpiar todos.
    localStorage.removeItem('selectedPackage');
    localStorage.removeItem('personalInfo');
    localStorage.removeItem('vehicleInfo');
    localStorage.removeItem('sellerInfo');
    localStorage.removeItem('paymentMethod');
    // Dejamos orderNumber por si se quiere mostrar en más detalle.

  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6 sm:p-8 text-center">
        <div className="w-full max-w-3xl bg-black rounded-2xl shadow-2xl shadow-yellow-500/20 border border-yellow-500/30 p-8 sm:p-12">
            
            <div className="animate-pulse mb-6">
                <svg className="w-24 h-24 text-green-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-green-400 mb-4">¡Cita Confirmada!</h1>
            
            {orderDetails ? (
              <>
                <p className="text-lg sm:text-xl text-gray-300 mb-2">Gracias, <span className="font-bold text-white">{orderDetails.clientName}</span>. Hemos recibido tu solicitud.</p>
                <p className="text-lg sm:text-xl text-gray-300 mb-8">
                    Tu número de orden es: <span className="font-mono bg-gray-800 text-yellow-400 py-1 px-3 rounded-md">{orderDetails.orderNumber}</span>
                </p>
                
                <div className="w-full text-center mb-10">
                     <p className="text-green-400">¡Correos de confirmación enviados! Revisa tu bandeja de entrada.</p>
                </div>

                <div className="text-sm text-gray-400">
                    <p>Recibirás un correo electrónico con los detalles de tu cita y los próximos pasos.</p>
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
