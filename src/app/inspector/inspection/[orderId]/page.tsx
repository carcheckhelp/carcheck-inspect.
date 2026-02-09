'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { inspectionCategories } from '@/lib/inspectionPoints';

interface Order {
  id: string;
  clientName: string;
  vehicle: string;
  status: string;
}

const InspectionPage = ({ params }: { params: { orderId: string } }) => {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State to store inspection results: { [pointName]: status }
  // status can be 'ok', 'attention', 'fail'
  const [inspectionResults, setInspectionResults] = useState<Record<string, string>>({});
  
  // State to store observations per category
  const [categoryObservations, setCategoryObservations] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/inspector/orders/${params.orderId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch order details');
        }
        const data = await response.json();
        setOrder(data);
        
        // Load existing inspection data if available
        if (data.inspectionResults) {
            setInspectionResults(data.inspectionResults);
        }
        if (data.categoryObservations) {
            setCategoryObservations(data.categoryObservations);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params.orderId]);

  const handlePointChange = (point: string, status: string) => {
    setInspectionResults(prev => ({
      ...prev,
      [point]: status
    }));
  };

  const handleObservationChange = (categoryId: string, observation: string) => {
    setCategoryObservations(prev => ({
      ...prev,
      [categoryId]: observation
    }));
  };

  const calculateProgress = () => {
      const totalPoints = inspectionCategories.reduce((acc, cat) => acc + cat.points.length, 0);
      const completedPoints = Object.keys(inspectionResults).length;
      return Math.round((completedPoints / totalPoints) * 100);
  };

  const handleSave = async () => {
      try {
          // In a real app, send data to API
          console.log('Saving inspection:', { inspectionResults, categoryObservations });
          // await fetch(`/api/inspector/inspection/${params.orderId}`, {
          //   method: 'POST',
          //   body: JSON.stringify({ inspectionResults, categoryObservations })
          // });
          alert('Inspección guardada localmente (simulación)');
      } catch (e) {
          console.error('Error saving:', e);
          alert('Error al guardar');
      }
  };

  if (loading) return <div className="min-h-screen bg-black text-white flex justify-center items-center">Cargando detalles...</div>;
  if (error) return <div className="min-h-screen bg-black text-red-500 flex justify-center items-center">Error: {error}</div>;

  const progress = calculateProgress();

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-yellow-500">
                Inspección <span className="text-white">#{params.orderId}</span>
            </h1>
            <button 
                onClick={() => router.back()}
                className="text-gray-400 hover:text-white"
            >
                Volver
            </button>
        </div>

        {order && (
            <div className="bg-gray-900 p-4 rounded-lg mb-6 border border-gray-800">
            <p className="text-lg"><strong>Vehículo:</strong> {order.vehicle}</p>
            <p className="text-gray-400">Cliente: {order.clientName}</p>
            </div>
        )}

        <div className="sticky top-0 z-10 bg-black py-4 border-b border-gray-800 mb-6">
            <div className="flex justify-between text-sm mb-1">
                <span>Progreso</span>
                <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2.5">
                <div className="bg-yellow-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
        </div>

        <div className="space-y-8">
            {inspectionCategories.map((category) => (
                <div key={category.id} className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                    <h2 className="text-xl font-bold mb-4 text-blue-400 border-b border-gray-800 pb-2">
                        {category.title}
                    </h2>
                    <div className="space-y-4">
                        {category.points.map((point) => (
                            <div key={point} className="flex flex-col md:flex-row md:items-center justify-between gap-3 py-2 border-b border-gray-800 last:border-0">
                                <span className="text-gray-300 flex-1">{point}</span>
                                <div className="flex gap-2 shrink-0">
                                    <button
                                        onClick={() => handlePointChange(point, 'ok')}
                                        className={`px-3 py-1 rounded text-sm font-bold transition-colors ${
                                            inspectionResults[point] === 'ok' 
                                            ? 'bg-green-600 text-white ring-2 ring-green-400' 
                                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                        }`}
                                    >
                                        Bien
                                    </button>
                                    <button
                                        onClick={() => handlePointChange(point, 'attention')}
                                        className={`px-3 py-1 rounded text-sm font-bold transition-colors ${
                                            inspectionResults[point] === 'attention' 
                                            ? 'bg-yellow-600 text-white ring-2 ring-yellow-400' 
                                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                        }`}
                                    >
                                        Atención
                                    </button>
                                    <button
                                        onClick={() => handlePointChange(point, 'fail')}
                                        className={`px-3 py-1 rounded text-sm font-bold transition-colors ${
                                            inspectionResults[point] === 'fail' 
                                            ? 'bg-red-600 text-white ring-2 ring-red-400' 
                                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                        }`}
                                    >
                                        Mal
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Sección de Observaciones por Categoría */}
                    <div className="mt-6 pt-4 border-t border-gray-800">
                        <label htmlFor={`obs-${category.id}`} className="block text-sm font-medium text-gray-400 mb-2">
                            Observaciones para {category.title} (Opcional):
                        </label>
                        <textarea
                            id={`obs-${category.id}`}
                            rows={3}
                            className="w-full bg-black text-white border border-gray-700 rounded p-3 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
                            placeholder="Escribe aquí detalles adicionales, daños específicos, etc..."
                            value={categoryObservations[category.id] || ''}
                            onChange={(e) => handleObservationChange(category.id, e.target.value)}
                        />
                    </div>
                </div>
            ))}
        </div>

        <div className="mt-8 flex justify-end gap-4">
            <button 
                className="bg-gray-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-600"
                onClick={() => router.back()}
            >
                Cancelar
            </button>
            <button 
                className="bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg hover:bg-yellow-400 shadow-lg shadow-yellow-500/20"
                onClick={handleSave}
            >
                Guardar Inspección
            </button>
        </div>
      </div>
    </div>
  );
};

export default InspectionPage;
