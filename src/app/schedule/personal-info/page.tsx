'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const PersonalInfoPage = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    const savedInfo = localStorage.getItem('personalInfo');
    if (savedInfo) {
      const { name, phone, email } = JSON.parse(savedInfo);
      if (name) setName(name);
      if (phone) setPhone(phone);
      if (email) setEmail(email);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const personalInfo = { name, phone, email };
    localStorage.setItem('personalInfo', JSON.stringify(personalInfo));
    router.push('/schedule/vehicle-info');
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
      <main className="w-full max-w-lg bg-gray-900 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">Datos Personales</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-lg font-bold mb-2">Nombre</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-lg font-bold mb-2">Teléfono</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="email" className="block text-lg font-bold mb-2">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>
          <div className="flex justify-between mt-8">
            <Link href="/schedule/package" className="bg-gray-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors duration-300">
              Atrás
            </Link>
            <button type="submit" className="bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg hover:bg-yellow-400 transition-colors duration-300">
              Siguiente
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default PersonalInfoPage;
