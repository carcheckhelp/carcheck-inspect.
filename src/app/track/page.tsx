'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const TrackOrderPage = () => {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/track/orders?email=${email}`);
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
        <h2 className="text-3xl font-bold mb-6 text-center">Seguir Orden</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="emailOrPhone" className="block text-lg font-bold mb-2">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>
          <button type="submit" className="w-full bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors duration-300">
            Rastrear
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link href="/" className="text-yellow-500 hover:underline">
            Volver al Inicio
          </Link>
        </div>
      </main>
    </div>
  );
};

export default TrackOrderPage;
