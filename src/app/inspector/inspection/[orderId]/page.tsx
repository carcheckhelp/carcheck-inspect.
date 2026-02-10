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
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State to store inspection results: { [pointName]: status }
  // status can be 'ok', 'attention', 'fail', 'na' (not applicable)
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
      // Solo cuentan los puntos que NO son "na" (No Aplica)
      const applicablePoints = inspectionCategories.flatMap(c => c.points)
        .filter(point => inspectionResults[point] !== 'na');
        
      if (applicablePoints.length === 0) return 0;

      const completedPoints = applicablePoints.filter(point => 
          inspectionResults[point] && inspectionResults[point] !== 'na'
      ).length;

      // Necesitamos normalizar respecto al total de puntos posibles que no se han marcado como NA
      // Pero para la barra de progreso mientras se llena, mejor usamos el total fijo
      const totalPoints = inspectionCategories.reduce((acc, cat) => acc + cat.points.length, 0);
      const answeredPoints = Object.keys(inspectionResults).length;
      
      return Math.round((answeredPoints / totalPoints) * 100);
  };

  const validateInspection = () => {
      // Get all points from all categories
      const allPoints = inspectionCategories.flatMap(c => c.points);
      
      // Check if every point has a status in inspectionResults (either 'ok', 'attention', 'fail', or 'na')
      const missingPoints = allPoints.filter(point => !inspectionResults[point]);
      
      return missingPoints;
  };

  const handleSave = async () => {
      const missingPoints = validateInspection();
      
      if (missingPoints.length > 0) {
          alert(`No puedes guardar la inspección. Faltan ${missingPoints.length} puntos por revisar.\n\nPor favor revisa todas las categorías.`);
          return;
      }

      setSaving(true);
      try {
          const response = await fetch(`/api/inspector/orders/${params.orderId}`, {
              method: 'POST', // Use POST or PUT to update
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                  inspectionResults, 
                  categoryObservations,
                  status: 'completed' // Mark as completed or in-progress
              })
          });

          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || 'Failed to save inspection');
          }

          alert('Inspección guardada correctamente y reporte generado.');
          router.push('/inspector/dashboard'); 
      } catch (e: any) {
          console.error('Error saving:', e);
          alert(`Error al guardar: ${e.message}`);
      } finally {
          setSaving(false);
      }
  };

  if (loading) return <div className="min-h-screen bg-black text-white flex justify-center items-center">Cargando detalles...</div>;
  if (error) return <div className="min-h-screen bg-black text-red-500 flex justify-center items-center">Error: {error}</div>;

  const progress = calculateProgress();
  const missingPointsCount = validateInspection().length;

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
                <span>Progreso {missingPointsCount > 0 ? `(${missingPointsCount} pendientes)` : '(Completo)'}</span>
                <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2.5">
                <div 
                    className={`h-2.5 rounded-full transition-all duration-300 ${progress === 100 ? 'bg-green-500' : 'bg-yellow-500'}`} 
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>

        <div className="space-y-8">
            {inspectionCategories.map((category) => (
                <div key={category.id} className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                    <h2 className="text-xl font-bold mb-4 text-blue-400 border-b border-gray-800 pb-2 flex justify-between">
                        {category.title}
                        {/* Indicador visual si la categoría está completa o no */}
                        {category.points.every(p => inspectionResults[p]) ? (
                            <span className="text-green-500 text-sm font-normal">✓ Completa</span>
                        ) : (
                            <span className="text-yellow-500 text-sm font-normal">● Pendiente</span>
                        )}
                    </h2>
                    <div className="space-y-4">
                        {category.points.map((point) => (
                            <div key={point} className={`flex flex-col md:flex-row md:items-center justify-between gap-3 py-2 border-b border-gray-800 last:border-0 ${inspectionResults[point] === 'na' ? 'opacity-50' : ''}`}>
                                <span className={`text-gray-300 flex-1 ${inspectionResults[point] === 'na' ? 'line-through' : ''}`}>{point}</span>
                                <div className="flex gap-2 shrink-0">
                                    <button
                                        onClick={() => handlePointChange(point, 'ok')}
                                        disabled={inspectionResults[point] === 'na'}
                                        className={`px-3 py-1 rounded text-sm font-bold transition-colors ${
                                            inspectionResults[point] === 'ok' 
                                            ? 'bg-green-600 text-white ring-2 ring-green-400' 
                                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed'
                                        }`}
                                    >
                                        Bien
                                    </button>
                                    <button
                                        onClick={() => handlePointChange(point, 'attention')}
                                        disabled={inspectionResults[point] === 'na'}
                                        className={`px-3 py-1 rounded text-sm font-bold transition-colors ${
                                            inspectionResults[point] === 'attention' 
                                            ? 'bg-yellow-600 text-white ring-2 ring-yellow-400' 
                                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed'
                                        }`}
                                    >
                                        Atención
                                    </button>
                                    <button
                                        onClick={() => handlePointChange(point, 'fail')}
                                        disabled={inspectionResults[point] === 'na'}
                                        className={`px-3 py-1 rounded text-sm font-bold transition-colors ${
                                            inspectionResults[point] === 'fail' 
                                            ? 'bg-red-600 text-white ring-2 ring-red-400' 
                                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed'
                                        }`}
                                    >
                                        Mal
                                    </button>
                                    
                                    {/* Botón para marcar como No Aplica */}
                                    <button
                                        onClick={() => handlePointChange(point, inspectionResults[point] === 'na' ? '' : 'na')}
                                        className={`px-2 py-1 rounded text-sm font-bold transition-colors ml-2 ${
                                            inspectionResults[point] === 'na'
                                            ? 'bg-gray-600 text-white ring-2 ring-gray-400'
                                            : 'bg-gray-800 text-gray-500 hover:bg-gray-700 hover:text-gray-300'
                                        }`}
                                        title={inspectionResults[point] === 'na' ? "Habilitar punto" : "Marcar como No Aplica"}
                                    >
                                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
                                        </svg>
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

        <div className="mt-8 flex justify-end gap-4 pb-12">
            <button 
                className="bg-gray-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-600 disabled:opacity-50"
                onClick={() => router.back()}
                disabled={saving}
            >
                Cancelar
            </button>
            <button 
                className={`text-black font-bold py-3 px-6 rounded-lg shadow-lg disabled:opacity-50 flex items-center transition-colors ${
                    missingPointsCount > 0 
                    ? 'bg-gray-500 cursor-not-allowed' // Deshabilitado visualmente si faltan puntos
                    : 'bg-yellow-500 hover:bg-yellow-400 shadow-yellow-500/20'
                }`}
                onClick={handleSave}
                disabled={saving} // Ya no deshabilitamos el botón por puntos faltantes en el HTML 'disabled', sino que manejamos la validación en onClick para poder mostrar el mensaje de alerta.
            >
                {saving ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Guardando...
                    </>
                ) : (
                    missingPointsCount > 0 ? `Faltan ${missingPointsCount} Puntos` : 'Guardar Inspección'
                )}
            </button>
        </div>
      </div>
    </div>
  );
};

export default InspectionPage;
