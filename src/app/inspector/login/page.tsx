'use client';
import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginInspector } from '@/app/actions';

const initialState = {
  error: ''
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="w-full bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors duration-300 disabled:bg-gray-500" disabled={pending}>
      {pending ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
    </button>
  );
}

const InspectorLoginPage = () => {
  const [state, formAction] = useFormState(loginInspector, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.push('/inspector/dashboard');
    }
  }, [state, router]);

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
        <h2 className="text-3xl font-bold mb-6 text-center">Acceso de Inspector</h2>
        <form action={formAction}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-lg font-bold mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-lg font-bold mb-2">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>
          {state?.error && <p className="text-red-500 text-center mb-4">{state.error}</p>}
          <SubmitButton />
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

export default InspectorLoginPage;
