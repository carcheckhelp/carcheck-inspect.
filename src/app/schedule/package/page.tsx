'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const packages = [
  {
    name: 'Core',
    price: 4000,
    features: [
      'Inspección de ABS, SRS, TPMS',
      'Inspección de motor',
      'Inspección de carrocería y luces',
    ],
    description: 'Ideal para vehículos del 2019 y anteriores.',
    extra: null,
  },
  {
    name: 'CarCheck Plus',
    price: 5000,
    features: [],
    description: 'Incluye todo lo de Core, más un reporte Carfax. Recomendado para vehículos del 2019 y anteriores.',
    extra: '+ Reporte Carfax',
  },
  {
    name: 'Pro',
    price: 8000,
    features: [],
    description: 'Incluye todo lo de CarCheck Plus, con diagnósticos avanzados. Indispensable para vehículos del 2020 en adelante.',
    extra: 'Destinado a vehículos 2020 en adelante',
  },
];

const PackagePage = () => {
  const router = useRouter();

  const selectPackage = (pkg: { name: string; price: number }) => {
    localStorage.setItem('selectedPackage', JSON.stringify(pkg));
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
          {packages.map((pkg) => (
            <div key={pkg.name} className="bg-gray-900 p-8 rounded-lg shadow-lg hover:shadow-yellow-500/50 transition-shadow duration-300 flex flex-col">
              <h3 className="text-3xl font-bold mb-4 text-yellow-400">{pkg.name}</h3>
              <p className="text-5xl font-bold mb-4">${pkg.price.toLocaleString()}</p>
              {pkg.description && <p className="text-lg mb-4 h-24">{pkg.description}</p>}
              {pkg.features.length > 0 && (
                <ul className="text-left space-y-2 mb-6">
                  {pkg.features.map((feature, i) => <li key={i}>{feature}</li>)}
                </ul>
              )}
              {pkg.extra && <p className="text-lg font-bold mb-4">{pkg.extra}</p>}
              <div className="flex-grow"></div>
              <button onClick={() => selectPackage(pkg)} className="w-full mt-4 bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors duration-300">
                Seleccionar
              </button>
            </div>
          ))}
        </div>
        <div className="mt-8">
            <Link href="/" className="bg-gray-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors duration-300">
              Volver al Inicio
            </Link>
        </div>
      </main>
    </div>
  );
};

export default PackagePage;
