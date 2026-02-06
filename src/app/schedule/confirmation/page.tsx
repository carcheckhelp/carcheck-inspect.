'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const ConfirmationPage = () => {
  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => {
    // Generate a random order number
    setOrderNumber(Math.random().toString(36).substr(2, 9).toUpperCase());
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      <header className="absolute top-8 left-8">
        <Link href="/" legacyBehavior>
          <a>
            <h1 className="text-5xl font-bold">
              <span style={{ color: '#B8860B' }}>Car</span>
              <span style={{ color: '#FFD700' }}>Check</span>
            </h1>
          </a>
        </Link>
      </header>
      <main className="w-full max-w-lg text-center bg-gray-900 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-4 text-green-400">¡Cita Agendada!</h2>
        <p className="text-lg mb-6">Gracias por confiar en CarCheck. Tu número de orden es:</p>
        <p className="text-4xl font-mono p-4 bg-gray-800 rounded-lg inline-block">{orderNumber}</p>
        <div className="mt-8">
          <Link href="/" legacyBehavior>
            <a className="bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg hover:bg-yellow-400 transition-colors duration-300">Volver al Inicio</a>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default ConfirmationPage;
