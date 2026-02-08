'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState('transfer');
  const [orderSummary, setOrderSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const selectedPackageStr = localStorage.getItem('selectedPackage');
      const personalInfoStr = localStorage.getItem('personalInfo');
      const vehicleInfoStr = localStorage.getItem('vehicleInfo');
      const sellerInfoStr = localStorage.getItem('sellerInfo'); // Added sellerInfo

      if (selectedPackageStr && personalInfoStr && vehicleInfoStr && sellerInfoStr) {
        const selectedPackage = JSON.parse(selectedPackageStr);
        const personalInfo = JSON.parse(personalInfoStr);
        const vehicleInfo = JSON.parse(vehicleInfoStr);
        const sellerInfo = JSON.parse(sellerInfoStr); // Added sellerInfo

        setOrderSummary({
          selectedPackage,
          personalInfo,
          vehicleInfo,
          sellerInfo,
        });
      } else {
        setError("Información esencial para el pago no fue encontrada. Por favor, reinicia el proceso.");
      }
    } catch (e) {
      console.error(e);
      setError("Ocurrió un error al cargar la información de tu orden.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateOrderNumber = () => {
    const prefix = 'CC';
    const timestamp = Date.now().toString(36).toUpperCase();
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${randomPart}`;
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const orderNumber = generateOrderNumber();
      const emailPayload = { ...orderSummary, orderNumber };

      const response = await fetch('/api/send-emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailPayload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Ocurrió un error al procesar tu solicitud.');
      }

      // Store the final details before redirecting
      localStorage.setItem('paymentMethod', paymentMethod);
      localStorage.setItem('orderNumber', orderNumber);

      router.push('/schedule/confirmation');

    } catch (err: any) {
      console.error("Payment handling failed:", err);
      setError(err.message || 'No se pudo confirmar la cita. Por favor, intenta de nuevo.');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
        <h2 className="text-2xl text-yellow-400">Cargando...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      <header className="absolute top-8 left-8">
        <Link href="/">
          <h1 className="text-5xl font-bold">
            <span style={{ color: '#B8860B' }}>Car</span>
            <span style={{ color: '#FFD700' }}>Check</span>
          </h1>
        </Link>
      </header>

      <main className="w-full max-w-2xl bg-gray-900 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">Finalizar Pago</h2>

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 p-4 rounded-lg mb-6 text-center">
            <p className="font-bold">Error en la Solicitud</p>
            <p>{error}</p>
          </div>
        )}

        {orderSummary && (
          <div className="bg-gray-800 p-6 rounded-lg mb-8">
              <h3 className="text-2xl font-bold mb-4 text-yellow-400">Resumen de la Orden</h3>
              <div className="space-y-3 text-lg">
                  <p><span className="font-bold text-gray-400">Paquete:</span> {orderSummary.selectedPackage.name}</p>
                  <p><span className="font-bold text-gray-400">Precio:</span> ${orderSummary.selectedPackage.price.toLocaleString()}</p>
                  <hr className="border-gray-700"/>
                  <p><span className="font-bold text-gray-400">Nombre:</span> {orderSummary.personalInfo.name}</p>
                  <p><span className="font-bold text-gray-400">Email:</span> {orderSummary.personalInfo.email}</p>
                  <hr className="border-gray-700"/>
                  <p><span className="font-bold text-gray-400">Vehículo:</span> {orderSummary.vehicleInfo.year} {orderSummary.vehicleInfo.make} {orderSummary.vehicleInfo.model}</p>
                  <p><span className="font-bold text-gray-400">Cita:</span> {orderSummary.vehicleInfo.appointmentDate} a las {orderSummary.vehicleInfo.appointmentTime}</p>
              </div>
          </div>
        )}

        <form onSubmit={handlePayment}>
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-4">Método de Pago</h3>
            <div className="flex rounded-lg border border-gray-700 overflow-hidden">
                <button type="button" onClick={() => setPaymentMethod('transfer')} className={`flex-1 p-3 font-bold transition-colors duration-300 ${paymentMethod === 'transfer' ? 'bg-yellow-500 text-black' : 'bg-gray-800 hover:bg-gray-700'}`}>Transferencia</button>
                <button type="button" onClick={() => setPaymentMethod('paypal')} className={`flex-1 p-3 font-bold transition-colors duration-300 ${paymentMethod === 'paypal' ? 'bg-yellow-500 text-black' : 'bg-gray-800 hover:bg-gray-700'}`}>PayPal</button>
                <button type="button" onClick={() => setPaymentMethod('cash')} className={`flex-1 p-3 font-bold transition-colors duration-300 ${paymentMethod === 'cash' ? 'bg-yellow-500 text-black' : 'bg-gray-800 hover:bg-gray-700'}`}>Efectivo</button>
            </div>
          </div>

          {paymentMethod === 'transfer' && (
            <div className="bg-gray-800 p-4 rounded-lg text-center">
                <p className="font-bold text-lg">Datos para la Transferencia</p>
                <p>Banco: <span className="text-yellow-400">Banco Popular</span></p>
                <p>Cuenta: <span className="text-yellow-400">825107128</span></p>
                <p>A nombre de: <span className="text-yellow-400">CarCheck SRL</span></p>
                <p className="mt-2 text-sm">Luego de realizar la transferencia, envíe el comprobante a <span className="font-bold">pagos@carcheck.do</span></p>
            </div>
          )}
          {paymentMethod === 'paypal' && (
            <div className="bg-gray-800 p-4 rounded-lg text-center">
                 <p className="font-bold text-lg mb-4">Pagar con PayPal</p>
                 <p className="mb-4">Será redirigido a PayPal para completar su pago de forma segura.</p>
                 <button type="button" className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-500 transition-colors duration-300">
                    Pagar con PayPal
                 </button>
            </div>
          )}
          {paymentMethod === 'cash' && (
            <div className="bg-gray-800 p-4 rounded-lg text-center">
                <p className="font-bold text-lg">Pago en Efectivo</p>
                <p>El pago se realizará en efectivo al momento de la inspección del vehículo.</p>
            </div>
          )}

          <div className="flex justify-between mt-8">
            <Link href="/schedule/vehicle-info" className="bg-gray-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors duration-300">
              Atrás
            </Link>
            <button type="submit" disabled={isSubmitting} className="bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg hover:bg-yellow-400 transition-colors duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed">
              {isSubmitting ? 'Confirmando...' : (paymentMethod === 'cash' ? 'Confirmar Cita' : 'Pagar y Confirmar')}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default PaymentPage;
