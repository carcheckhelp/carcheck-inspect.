'use client';

import { useFormState, useFormStatus } from 'react-dom';
import Link from 'next/link';
import { sendPasswordResetEmail, type FormState } from '@/app/actions';

const initialState: FormState = {
  error: '',
  message: ''
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="w-full bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors duration-300 disabled:bg-gray-500" disabled={pending}>
      {pending ? 'Enviando Enlace...' : 'Enviar Enlace de Reseteo'}
    </button>
  );
}

const ForgotPasswordPage = () => {
  const [state, formAction] = useFormState(sendPasswordResetEmail, initialState);

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
        <h2 className="text-3xl font-bold mb-6 text-center">Restablecer Contraseña</h2>
        <p className="text-center text-gray-400 mb-6">Introduce tu correo y te enviaremos un enlace para que puedas volver a acceder a tu cuenta.</p>
        
        {state?.success ? (
          <p className="text-green-500 text-center mb-4">{state.message}</p>
        ) : (
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
            {state?.error && <p className="text-red-500 text-center mb-4">{state.error}</p>}
            <SubmitButton />
          </form>
        )}

        <div className="mt-6 text-center">
          <Link href="/inspector/login" className="text-yellow-500 hover:underline">
            Volver a Iniciar Sesión
          </Link>
        </div>
      </main>
    </div>
  );
};

export default ForgotPasswordPage;
