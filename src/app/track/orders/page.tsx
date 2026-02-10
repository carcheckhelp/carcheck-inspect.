'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import InspectionPDF from '@/components/InspectionPDF';

// Dynamically import PDFDownloadLink to avoid SSR issues with @react-pdf/renderer
const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { 
    ssr: false,
    loading: () => <button className="w-full bg-blue-600 opacity-50 text-white font-bold py-3 px-4 rounded-lg cursor-wait">Cargando Generador PDF...</button>
  }
);

interface Order {
  id: string;
  createdAt: any;
  status: string;
  vehicle: string;
  inspectionResults?: any;
  aiReport?: string;
  // ... other fields
}

export default function TrackOrderPage() {
  const searchParams = useSearchParams();
  const orderIdParam = searchParams.get('orderId');
  
  const [orderId, setOrderId] = useState(orderIdParam || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (orderIdParam) {
        fetchOrder(orderIdParam);
    }
  }, [orderIdParam]);

  const fetchOrder = async (id: string) => {
    setLoading(true);
    setError('');
    setOrder(null);

    try {
      // Reusing the inspector API for simplicity, but ideally should be a public/customer API
      // Since we don't have authentication yet, this is "public" effectively.
      const response = await fetch(`/api/report/${id}`); 
      
      if (!response.ok) {
        if (response.status === 404) {
             throw new Error('Orden no encontrada. Verifique el número.');
        }
        throw new Error('Error al buscar la orden.');
      }
      
      const data = await response.json();
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
            placeholder="Ingresa tu número de orden (ej: ORD-123...)"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500"
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
            <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-lg mb-6">
                {error}
            </div>
        )}

        {order && (
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 animate-fade-in">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-white mb-1">Orden #{order.id}</h2>
                        <p className="text-gray-400 text-sm">
                            Fecha: {order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
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
                        <span className="font-medium text-right">{order.vehicle}</span>
                    </div>
                    {/* Add more details here */}
                </div>

                {order.status === 'completed' && order.aiReport ? (
                    <div className="mt-6 pt-6 border-t border-gray-800">
                        <h3 className="text-lg font-bold text-yellow-500 mb-3">Reporte de Inspección Disponible</h3>
                        <p className="text-gray-400 text-sm mb-4">
                            Tu inspección ha sido completada y el análisis detallado está listo para descargar.
                        </p>
                        
                        {isClient && (
                            <PDFDownloadLink document={<InspectionPDF order={order} />} fileName={`reporte_carcheck_${order.id}.pdf`}>
                                {({ blob, url, loading, error }) => (
                                    <button 
                                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                        disabled={loading}
                                    >
                                        {loading ? 'Generando PDF...' : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                                </svg>
                                                Descargar Reporte PDF
                                            </>
                                        )}
                                    </button>
                                )}
                            </PDFDownloadLink>
                        )}
                    </div>
                ) : (
                    <div className="mt-6 pt-6 border-t border-gray-800 text-center">
                        <p className="text-gray-500 italic">
                            {order.status === 'completed' 
                                ? 'La inspección está completa pero el reporte aún se está procesando.' 
                                : 'El reporte estará disponible una vez que el inspector complete la revisión.'}
                        </p>
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
}
