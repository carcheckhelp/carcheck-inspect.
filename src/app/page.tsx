'use client';
import Link from 'next/link';
import { FileText, Calendar, User, Shield, Search, Car } from 'lucide-react';


const HomePage = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-between p-8">
      <header className="w-full max-w-6xl flex justify-between items-center">
        <h1 className="text-6xl font-bold">
          <span style={{ color: '#B8860B' }}>Car</span>
          <span style={{ color: '#FFD700' }}>Check</span>
        </h1>
      </header>
      <main className="w-full max-w-6xl flex-grow flex flex-col justify-center items-center text-center">
        <h2 className="text-4xl font-bold mb-4">La mejor forma de comprar un vehículo</h2>
        <p className="text-lg mb-12 max-w-3xl">
          CarCheck te ofrece una preinspección de compra para que tengas la tranquilidad de saber que estás haciendo una buena inversión. Agenda una cita con nuestros inspectores expertos y recibe un reporte detallado del estado del vehículo.
        </p>

        <div className="grid md:grid-cols-3 gap-8 w-full">
          <Link href="/schedule/package" className="bg-gray-900 p-8 rounded-lg shadow-lg hover:shadow-yellow-500/50 transition-shadow duration-300 flex flex-col items-center">

            <Calendar size={48} className="mb-4 text-yellow-400" />
            <h3 className="text-2xl font-bold">Agendar Cita</h3>

          </Link>
          <Link href="/track" className="bg-gray-900 p-8 rounded-lg shadow-lg hover:shadow-yellow-500/50 transition-shadow duration-300 flex flex-col items-center">

            <Search size={48} className="mb-4 text-yellow-400" />
            <h3 className="text-2xl font-bold">Seguir Orden</h3>

          </Link>
          <Link href="/inspector/login" className="bg-gray-900 p-8 rounded-lg shadow-lg hover:shadow-yellow-500/50 transition-shadow duration-300 flex flex-col items-center">

            <User size={48} className="mb-4 text-yellow-400" />
            <h3 className="text-2xl font-bold">Inspector</h3>

          </Link>
        </div>
      </main>
      <footer className="w-full max-w-6xl text-center text-gray-500 mt-12">
        <p>&copy; {new Date().getFullYear()} CarCheck. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default HomePage;
