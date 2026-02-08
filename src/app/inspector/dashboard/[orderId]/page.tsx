'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { generateInspectionReport } from '@/app/actions';
import { getOrderById } from '@/lib/firebase/firestore';

const inspectionCategories = [
  { id: 'engine', label: 'Motor' },
  { id: 'transmission', label: 'Transmisión' },
  { id: 'brakes', label: 'Frenos' },
  { id: 'suspension', label: 'Suspensión' },
  { id: 'tires', label: 'Llantas' },
  { id: 'body', label: 'Carrocería' },
  { id: 'interior', label: 'Interior' },
];

const faceRatings = [
  { score: 1, emoji: '😞' },
  { score: 2, emoji: '😟' },
  { score: 3, emoji: '😐' },
  { score: 4, emoji: '🙂' },
  { score: 5, emoji: '😄' },
];

export default function InspectionPage() {
  const params = useParams();
  const orderId = params.orderId as string;

  const [orderData, setOrderData] = useState<any>(null);
  const [scores, setScores] = useState<Record<string, number | null>>({});
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [report, setReport] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;

    async function fetchOrder() {
      try {
        const data = await getOrderById(orderId);
        if (data) {
          setOrderData(data);
        } else {
          setError(`No se encontró ninguna orden con el ID: ${orderId}`);
        }
      } catch (err) {
        setError("Error al cargar los datos de la orden. ¿Están bien configuradas las credenciales de Firebase?");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]);

  const handleScoreChange = (categoryId: string, score: number) => {
    setScores(prev => ({ ...prev, [categoryId]: score }));
  };

  const handleSubmit = async () => {
    if (!orderData) return;

    setIsSubmitting(true);
    setReport('');

    const inspectionData = {
      orderId: orderData.id,
      vehicle: orderData.vehicle,
      scores,
      notes,
    };

    const result = await generateInspectionReport(inspectionData);

    if (result.success) {
      setReport(result.report || '');
    } else {
      setError(result.error || 'Ocurrió un error al generar el informe.');
    }

    setIsSubmitting(false);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">Cargando datos de la orden...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen bg-gray-900 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-cyan-400">Inspección de Vehículo</h1>
          <p className="text-gray-400">Orden #{orderData?.id}</p>
          {orderData && <p className="text-lg">{orderData.vehicle.make} {orderData.vehicle.model} ({orderData.vehicle.year})</p>}
        </header>

        <div className="space-y-6">
          {inspectionCategories.map(category => (
            <div key={category.id} className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-4 text-white">{category.label}</h3>
              <div className="flex items-center justify-around">
                {faceRatings.map(({ score, emoji }) => (
                  <button
                    key={score}
                    onClick={() => handleScoreChange(category.id, score)}
                    className={`text-5xl p-3 rounded-full transition-transform duration-200 ${scores[category.id] === score ? 'bg-cyan-500 scale-110 shadow-cyan-400/50 shadow-lg' : 'hover:scale-110'}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-4 text-white">Observaciones Adicionales</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full h-32 p-4 bg-gray-700 rounded-md text-white focus:ring-2 focus:ring-cyan-500 outline-none"
            placeholder="Añade aquí cualquier detalle importante..."
          />
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 disabled:opacity-50"
          >
            {isSubmitting ? 'Generando Informe...' : 'Generar Informe con IA'}
          </button>
        </div>

        {report && (
          <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-4 text-cyan-400">Informe de Inspección Generado</h2>
            <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: report.replace(/\n/g, '<br />') }} />
          </div>
        )}
      </div>
    </div>
  );
}
