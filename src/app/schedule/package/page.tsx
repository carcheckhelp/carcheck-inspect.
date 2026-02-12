'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const packages = [
  {
    name: 'Core',
    price: 4000,
    features: [
      'Inspección mecánica completa (Motor, Transmisión)',
      'Revisión de frenos, suspensión y dirección',
      'Evaluación de carrocería y pintura',
      'Escaneo básico (Check Engine)',
      'Prueba de manejo'
    ],
    description: 'La evaluación fundamental para asegurar la operatividad básica y seguridad del vehículo. Ideal para una primera revisión.',
    minYear: 0,
    maxYear: 2019,
  },
  {
    name: 'CarCheck Plus',
    price: 5000,
    features: [
        'Todo lo incluido en el plan Core',
        'Reporte de Historial CARFAX incluido',
        'Verificación de odómetro real',
        'Historial de accidentes y servicios previos',
        'Validación de título y propiedad'
    ],
    description: 'La combinación perfecta de inspección física y revisión de historial. Recomendado para evitar fraudes y problemas ocultos.',
    minYear: 0,
    maxYear: 2019,
  },
  {
    name: 'Pro',
    price: 8000,
    features: [
        'Todo lo incluido en CarCheck Plus',
        'Escaneo electrónico avanzado de todos los módulos',
        'Prueba de componentes electrónicos y accesorios',
        'Análisis de vida útil de batería y alternador',
        'Revisión detallada de sistemas de seguridad (Airbags, ABS)'
    ],
    description: 'Nuestra inspección más completa. Indispensable para vehículos modernos (2020+) con sistemas electrónicos complejos.',
    minYear: 2020,
    maxYear: 9999,
  },
];

const PackagePage = () => {
  const router = useRouter();

  const handleSelectPackage = (pkg: any) => {
    // We can save only the name or the whole object. 
    // Saving the whole object is safer for the next steps.
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
                      MÁS COMPLETO
                  </div>
              )}

              <h3 className="text-3xl font-bold mb-2 text-white group-hover:text-yellow-400 transition-colors">{pkg.name}</h3>
              <p className="text-sm text-gray-400 mb-6 flex-grow">{pkg.description}</p>
              
              <div className="mb-8">
                  <span className="text-4xl font-bold text-white">${pkg.price.toLocaleString()}</span>
                  <span className="text-gray-500 ml-2 text-sm">DOP</span>
              </div>

              <ul className="space-y-3 mb-8">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="flex items-start text-gray-300 text-sm">
                    <svg className="w-5 h-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => handleSelectPackage(pkg)} 
                className="w-full font-bold py-4 rounded-lg transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:shadow-lg hover:shadow-yellow-500/40"
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
