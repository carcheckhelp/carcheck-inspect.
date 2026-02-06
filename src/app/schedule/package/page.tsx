'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const PackagePage = () => {
  const router = useRouter();

  const selectPackage = (packageName: string) => {
    // TODO: Save package selection
    console.log(`Selected package: ${packageName}`);
    router.push('/schedule/personal-info');
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
      <main className="w-full max-w-4xl text-center">
        <h2 className="text-4xl font-bold mb-8">Elige tu Paquete</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-900 p-8 rounded-lg shadow-lg hover:shadow-yellow-500/50 transition-shadow duration-300">
            <h3 className="text-3xl font-bold mb-4 text-yellow-400">Core</h3>
            <p className="text-5xl font-bold mb-4">$4000</p>
            <ul className="text-left space-y-2 mb-6">
              <li>Inspección de ABS, SRS, TPMS</li>
              <li>Inspección de motor</li>
              <li>Inspección de carrocería y luces</li>
            </ul>
            <button onClick={() => selectPackage('Core')} className="w-full bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors duration-300">
              Seleccionar
            </button>
          </div>
          <div className="bg-gray-900 p-8 rounded-lg shadow-lg hover:shadow-yellow-500/50 transition-shadow duration-300">
            <h3 className="text-3xl font-bold mb-4 text-yellow-400">CarCheck Plus</h3>
            <p className="text-5xl font-bold mb-4">$5000</p>
            <p className="text-lg mb-4">Incluye todo lo de Core</p>
            <p className="text-2xl font-bold mb-4">+ Reporte Carfax</p>
            <button onClick={() => selectPackage('CarCheck Plus')} className="w-full bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors duration-300">
              Seleccionar
            </button>
          </div>
          <div className="bg-gray-900 p-8 rounded-lg shadow-lg hover:shadow-yellow-500/50 transition-shadow duration-300">
            <h3 className="text-3xl font-bold mb-4 text-yellow-400">Pro</h3>
            <p className="text-5xl font-bold mb-4">$8000</p>
            <p className="text-lg mb-4">Incluye todo lo de CarCheck Plus</p>
            <p className="text-2xl font-bold mb-4">Destinado a vehículos 2020 en adelante</p>
            <button onClick={() => selectPackage('Pro')} className="w-full bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors duration-300">
              Seleccionar
            </button>
          </div>
        </div>
        <div className="mt-8">
          <Link href="/" className="text-yellow-500 hover:underline">
            Volver al Inicio
          </Link>
        </div>
      </main>
    </div>
  );
};

export default PackagePage;
