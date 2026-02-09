'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
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
    minYear: 0,
    maxYear: 2019,
  },
  {
    name: 'CarCheck Plus',
    price: 5000,
    features: [
        'Incluye todo lo de Core',
        'Reporte Carfax incluido'
    ],
    description: 'Recomendado para vehículos del 2019 y anteriores.',
    minYear: 0,
    maxYear: 2019,
  },
  {
    name: 'Pro',
    price: 8000,
    features: [
        'Incluye todo lo de CarCheck Plus',
        'Diagnósticos avanzados'
    ],
    description: 'Indispensable para vehículos del 2020 en adelante.',
    minYear: 2020,
    maxYear: 9999,
  },
];

const PackagePage = () => {
  const router = useRouter();

  const handleSelectPackage = (pkg: any) => {
    localStorage.setItem('selectedPackage', JSON.stringify(pkg));
    router.push('/schedule/personal-info');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      <header className="w-full max-w-6xl flex justify-between items-center mb-12">
        <Link href="/">
          <h1 className="text-4xl font-bold">
            <span style={{ color: '#B8860B' }}>Car</span>
            <span style={{ color: '#FFD700' }}>Check</span>
          </h1>
        </Link>
      </header>
      
      <main className="w-full max-w-6xl">
        <h2 className="text-4xl font-bold mb-4 text-center text-yellow-500">Elige tu Paquete de Inspección</h2>
        <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            Selecciona el paquete que mejor se adapte al año y necesidades de tu vehículo.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <div key={pkg.name} className="bg-gray-900 border border-gray-800 p-8 rounded-xl shadow-lg hover:shadow-yellow-500/20 hover:border-yellow-500/50 transition-all duration-300 flex flex-col relative overflow-hidden group">
              
              {/* Highlight badge for Pro */}
              {pkg.name === 'Pro' && (
                  <div className="absolute top-0 right-0 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-bl-lg">
                      RECOMENDADO
                  </div>
              )}

              <h3 className="text-3xl font-bold mb-2 text-white group-hover:text-yellow-400 transition-colors">{pkg.name}</h3>
              <p className="text-sm text-gray-400 mb-6 h-12">{pkg.description}</p>
              
              <div className="mb-8">
                  <span className="text-5xl font-bold text-white">${pkg.price.toLocaleString()}</span>
                  <span className="text-gray-500 ml-2">DOP</span>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="flex items-start text-gray-300">
                    <svg className="w-5 h-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => handleSelectPackage(pkg)} 
                className={`w-full font-bold py-4 rounded-lg transition-all duration-300 transform hover:-translate-y-1 ${
                    pkg.name === 'Pro' 
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:shadow-lg hover:shadow-yellow-500/40' 
                    : 'bg-gray-800 text-white hover:bg-gray-700 hover:text-yellow-400'
                }`}
              >
                Seleccionar {pkg.name}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
            <Link href="/" className="text-gray-500 hover:text-white transition-colors underline">
              Cancelar y volver al inicio
            </Link>
        </div>
      </main>
    </div>
  );
};

export default PackagePage;
