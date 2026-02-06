'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const InspectorLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful');
      router.push('/inspector/dashboard');
    } catch (error: any) {
      console.error('Login error:', error.message);
      setError('Credenciales inválidas. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

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
      <main className="w-full max-w-md bg-gray-900 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">Acceso de Inspector</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
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
          <div className="mb-6">
            <label htmlFor="password" className="block text-lg font-bold mb-2">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <button type="submit" className="w-full bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors duration-300 disabled:bg-gray-500" disabled={isLoading}>
            {isLoading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link href="/" legacyBehavior>
            <a className="text-yellow-500 hover:underline">Volver al Inicio</a>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default InspectorLoginPage;
