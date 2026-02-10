'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const DownloadInspectionButton = dynamic(
    () => import('@/components/DownloadInspectionButton'),
    { ssr: false, loading: () => <button className="w-full bg-blue-600 opacity-50 text-white font-bold py-3 px-4 rounded-lg cursor-wait">Cargando PDF...</button> }
);

interface Order {
  id: string;
  createdAt: any;
  status: string;
  vehicle: string; // Wait, vehicle might be an object {make, model, year} or string based on previous code
  vehicleInfo?: { make: string; model: string; year: string }; // Add alternative structure
  inspectionResults?: any;
  aiReport?: string;
  // ... other fields
}

// Helper function to format date safely
const formatDate = (dateValue: any) => {
    if (!dateValue) return 'N/A';
    try {
        // Handle Firestore Timestamp
        if (dateValue.seconds) {
            return new Date(dateValue.seconds * 1000).toLocaleDateString();
        }
        // Handle ISO String or Date object
        return new Date(dateValue).toLocaleDateString();
    } catch (e) {
        return 'Fecha Inválida';
    }
};

// Helper to get vehicle string safely
const getVehicleName = (order: any) => {
    if (typeof order.vehicle === 'string') return order.vehicle;
    if (order.vehicleInfo) {
        return `${order.vehicleInfo.make} ${order.vehicleInfo.model} ${order.vehicleInfo.year}`;
    }
    // Fallback if vehicle is object but structure is different
    if (typeof order.vehicle === 'object') {
         return `${order.vehicle.make || ''} ${order.vehicle.model || ''} ${order.vehicle.year || ''}`;
    }
    return 'Vehículo desconocido';
};

export default function TrackOrderPage() {
  const searchParams = useSearchParams();
  const orderIdParam = searchParams.get('orderId');
  
  const [orderId, setOrderId] = useState(orderIdParam || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (orderIdParam) {
        fetchOrder(orderIdParam.trim());
    }
  }, [orderIdParam]);

  const fetchOrder = async (id: string) => {
    // Clean ID: remove spaces, remove '#' prefix if present
    const cleanId = id.trim().replace(/^#/, '');

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      // Add timestamp to prevent caching
      const response = await fetch(`/api/report/${cleanId}?t=${Date.now()}`, {
          cache: 'no-store', // Ensure no caching
          headers: {
              'Cache-Control': 'no-cache'
          }
      }); 
      
      if (!response.ok) {
        if (response.status === 404) {
             throw new Error(`Orden "${cleanId}" no encontrada. Verifique el número.`);
        }
        throw new Error('Error al buscar la orden.');
      }
      
      const data = await response.json();
      console.log('Order data received:', data); // Debug log
      setOrder(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId.trim()) {
      fetchOrder(orderId);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-yellow-500 mb-6 text-center">Rastrear Orden</h1>
        
        <form onSubmit={handleSubmit} className="mb-8 flex gap-2">
          <input
            type="text"
            placeholder="Ingresa tu número de orden (ej: CC-123...)"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500 uppercase"
          />
          <button 
            type="submit" 
            className="bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg hover:bg-yellow-400"
            disabled={loading}
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </form>

        {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-lg mb-6 text-center">
                {error}
            </div>
        )}

        {order && (
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 animate-fade-in">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-white mb-1">Orden #{order.id}</h2>
                        <p className="text-gray-400 text-sm">
                            Fecha: {formatDate(order.createdAt)}
                        </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        order.status === 'completed' ? 'bg-green-900 text-green-300 border border-green-700' :
                        order.status === 'in_progress' ? 'bg-blue-900 text-blue-300 border border-blue-700' :
                        'bg-yellow-900 text-yellow-300 border border-yellow-700'
                    }`}>
                        {order.status === 'completed' ? 'Completada' : 
                         order.status === 'in_progress' ? 'En Progreso' : 'Pendiente'}
                    </span>
                </div>

                <div className="space-y-4 mb-6">
                    <div className="flex justify-between border-b border-gray-800 pb-2">
                        <span className="text-gray-400">Vehículo</span>
                        <span className="font-medium text-right">{getVehicleName(order)}</span>
                    </div>
                    {/* Add more details here */}
                </div>

                {/* Verificar explícitamente el estado y el reporte */}
                {order.status === 'completed' ? (
                    order.aiReport ? (
                        <div className="mt-6 pt-6 border-t border-gray-800">
                            <h3 className="text-lg font-bold text-yellow-500 mb-3">Reporte de Inspección Disponible</h3>
                            <p className="text-gray-400 text-sm mb-4">
                                Tu inspección ha sido completada y el análisis detallado está listo para descargar.
                            </p>
                            
                            <div className="w-full">
                                <DownloadInspectionButton 
                                    order={order} 
                                    label="Descargar Reporte PDF"
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="mt-6 pt-6 border-t border-gray-800 text-center">
                            <div className="bg-yellow-900/30 border border-yellow-700 p-4 rounded mb-2">
                                <p className="text-yellow-200 font-bold mb-1">Inspección Completada</p>
                                <p className="text-gray-400 text-sm">
                                    El reporte se está generando o hubo un error al crear el análisis inteligente. 
                                    Por favor contacte a soporte si esto persiste.
                                </p>
                            </div>
                        </div>
                    )
                ) : (
                    <div className="mt-6 pt-6 border-t border-gray-800 text-center">
                         <p className="text-gray-500 italic">
                            El reporte estará disponible una vez que el inspector complete la revisión.
                        </p>
                    </div>
                )}
                
                {/* Debug info - visible only to identify the issue */}
                <div className="mt-4 p-2 bg-gray-800 text-xs text-gray-500 font-mono rounded overflow-auto hidden">
                    Debug: Status="{order.status}" | HasReport={order.aiReport ? 'Yes' : 'No'} | ID={order.id}
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
