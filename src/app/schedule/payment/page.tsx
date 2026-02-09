'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState('transfer');
  const [orderSummary, setOrderSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Load order summary from localStorage
    try {
      const selectedPackageStr = localStorage.getItem('selectedPackage');
      const personalInfoStr = localStorage.getItem('personalInfo');
      const vehicleInfoStr = localStorage.getItem('vehicleInfo');
      const sellerInfoStr = localStorage.getItem('sellerInfo');

      if (selectedPackageStr && personalInfoStr && vehicleInfoStr && sellerInfoStr) {
        setOrderSummary({
          selectedPackage: JSON.parse(selectedPackageStr),
          personalInfo: JSON.parse(personalInfoStr),
          vehicleInfo: JSON.parse(vehicleInfoStr),
          sellerInfo: JSON.parse(sellerInfoStr),
        });
      } else {
        // If data is missing, redirect to start (or show error)
        // For now, show error
        console.error("Missing data in localStorage");
        setError("Faltan datos de la orden. Por favor, reinicie el proceso.");
      }
    } catch (e) {
      console.error(e);
      setError("Error al cargar los datos.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleConfirmation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderSummary) return;

    setIsSubmitting(true);

    // Construct the full appointment data object
    const appointmentData = {
        ...orderSummary,
        paymentMethod,
        createdAt: new Date().toISOString(),
        status: 'pending', // Initial status
    };

    // Save to localStorage for the Confirmation Page to pick up
    localStorage.setItem('appointmentData', JSON.stringify(appointmentData));

    // Navigate to confirmation page
    router.push('/confirmation'); // Note: changed from /schedule/confirmation to /confirmation based on file list
  };

  if (isLoading) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center"><p>Cargando...</p></div>;
  }

  if (error) {
      return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
            <p className="text-red-500 text-xl">{error}</p>
            <Link href="/schedule/package" className="mt-4 bg-yellow-500 text-black px-4 py-2 rounded">Reiniciar</Link>
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

      <main className="w-full max-w-2xl bg-gray-900 p-8 rounded-lg shadow-lg mt-20 md:mt-0">
        <h2 className="text-3xl font-bold mb-6 text-center">Resumen y Pago</h2>

        {/* Order Summary Display */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8 border border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-yellow-400 border-b border-gray-600 pb-2">Resumen de la Orden</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                    <p className="text-gray-400">Paquete:</p>
                    <p className="font-semibold text-white">{orderSummary.selectedPackage.name}</p>
                </div>
                <div>
                    <p className="text-gray-400">Precio:</p>
                    <p className="font-semibold text-yellow-400">${orderSummary.selectedPackage.price.toLocaleString()}</p>
                </div>
                <div>
                    <p className="text-gray-400">Vehículo:</p>
                    <p className="font-semibold text-white">{orderSummary.vehicleInfo.year} {orderSummary.vehicleInfo.make} {orderSummary.vehicleInfo.model}</p>
                </div>
                <div>
                    <p className="text-gray-400">Fecha Cita:</p>
                    <p className="font-semibold text-white">{orderSummary.vehicleInfo.appointmentDate} - {orderSummary.vehicleInfo.appointmentTime}</p>
                </div>
            </div>
        </div>

        <form onSubmit={handleConfirmation}>
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Selecciona Método de Pago</h3>
            
            <div className="grid grid-cols-3 gap-2 mb-6">
                <button 
                    type="button" 
                    onClick={() => setPaymentMethod('transfer')} 
                    className={`p-3 rounded-lg font-bold text-sm md:text-base transition-all ${paymentMethod === 'transfer' ? 'bg-yellow-500 text-black ring-2 ring-yellow-300' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                >
                    Transferencia
                </button>
                <button 
                    type="button" 
                    onClick={() => setPaymentMethod('paypal')} 
                    className={`p-3 rounded-lg font-bold text-sm md:text-base transition-all ${paymentMethod === 'paypal' ? 'bg-yellow-500 text-black ring-2 ring-yellow-300' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                >
                    PayPal
                </button>
                <button 
                    type="button" 
                    onClick={() => setPaymentMethod('cash')} 
                    className={`p-3 rounded-lg font-bold text-sm md:text-base transition-all ${paymentMethod === 'cash' ? 'bg-yellow-500 text-black ring-2 ring-yellow-300' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                >
                    Efectivo
                </button>
            </div>

            {/* Payment Details Sections */}
            {paymentMethod === 'transfer' && (
                <div className="bg-gray-800 p-5 rounded-lg border border-gray-700 animate-fadeIn">
                    <p className="font-bold text-lg mb-2 text-center text-yellow-400">Datos Bancarios</p>
                    <div className="space-y-2 text-center">
                        <p>Banco: <span className="font-bold text-white">BHD</span></p>
                        <p>Cuenta: <span className="font-bold text-white tracking-wider">16718560011</span></p>
                        <p>Beneficiario: <span className="font-bold text-white">Venecia Tavarez</span></p>
                    </div>
                    <div className="mt-4 text-xs text-gray-400 text-center bg-gray-900 p-3 rounded">
                        <p className="mb-1">Enviar comprobante a:</p>
                        <p className="font-mono text-yellow-500">carcheckhelp1@outlook.com</p>
                        <p className="mt-1 flex justify-center items-center gap-1">
                            <FaWhatsapp className="text-green-500"/> <span>809-315-7892</span>
                        </p>
                    </div>
                </div>
            )}

            {paymentMethod === 'paypal' && (
                <div className="bg-gray-800 p-5 rounded-lg border border-gray-700 text-center animate-fadeIn">
                    <p className="mb-4 text-gray-300">Para completar su pago de forma segura vía PayPal:</p>
                    <a href="https://www.paypal.com/paypalme/carcheck1" target="_blank" rel="noopener noreferrer" className="inline-block bg-[#0070ba] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#003087] transition-colors">
                        Pagar con PayPal
                    </a>
                    <p className="mt-4 text-xs text-gray-500">Luego de pagar, presione "Confirmar Cita" abajo.</p>
                </div>
            )}

            {paymentMethod === 'cash' && (
                <div className="bg-gray-800 p-5 rounded-lg border border-gray-700 text-center animate-fadeIn">
                    <p className="text-gray-300">El pago se realizará en efectivo directamente al inspector al momento de la revisión.</p>
                </div>
            )}
          </div>

          <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-700">
            <Link href="/schedule/vehicle-info" className="text-gray-400 hover:text-white transition-colors underline">
              Volver atrás
            </Link>
            <button 
                type="submit" 
                disabled={isSubmitting} 
                className="bg-yellow-500 text-black font-bold py-4 px-8 rounded-lg hover:bg-yellow-400 transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-yellow-500/20"
            >
              {isSubmitting ? 'Procesando...' : 'Confirmar Cita'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default PaymentPage;
