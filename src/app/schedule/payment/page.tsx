'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const PaymentPage = () => {
  const router = useRouter();

  const handleNonPayPalPayment = () => {
    router.push('/schedule/confirmation');
  };

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
      <main className="w-full max-w-md bg-gray-900 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">Elige un Método de Pago</h2>
        <div className="space-y-4">
          <a href="https://www.paypal.com/paypalme/carcheck1" target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-500 transition-colors duration-300">
            PayPal
          </a>
          <button onClick={handleNonPayPalPayment} className="w-full bg-gray-700 text-white font-bold py-3 rounded-lg hover:bg-gray-600 transition-colors duration-300">
            Transferencia Bancaria
          </button>
          <button onClick={handleNonPayPalPayment} className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-500 transition-colors duration-300">
            Efectivo
          </button>
        </div>
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400 mb-4">
            Si pagas con PayPal, se abrirá una nueva pestaña. Una vez completado el pago, puedes cerrar esa pestaña y hacer clic en &quot;Siguiente&quot; para generar tu orden.
          </p>
          <button onClick={() => router.push('/schedule/confirmation')} className="bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg hover:bg-yellow-400 transition-colors duration-300">
            Siguiente
          </button>
        </div>
        <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Descargo de responsabilidad: CarCheck realiza una inspección pre-compra para evaluar la condición del vehículo al momento de la revisión. No nos responsabilizamos por fallas o daños que puedan ocurrir después de la compra.
            </p>
        </div>
        <div className="mt-8 text-center">
          <Link href="/schedule/vehicle-info" className="text-yellow-500 hover:underline">
            Atrás
          </Link>
        </div>
      </main>
    </div>
  );
};

export default PaymentPage;
