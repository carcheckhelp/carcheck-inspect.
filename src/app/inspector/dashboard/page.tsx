'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import InspectionPDF from '@/components/InspectionPDF';

// Dynamically import PDFDownloadLink to avoid SSR issues with @react-pdf/renderer
const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { 
    ssr: false,
    loading: () => <button className="bg-gray-700 text-white font-bold py-2 px-4 rounded opacity-50 cursor-wait">Cargando PDF...</button>
  }
);

interface Order {
    id: string;
    clientName: string;
    vehicle: string;
    status: string;
    date: string;
    inspectionResults?: any;
    aiReport?: string;
    createdAt?: any;
    personalInfo?: any;
}

export default function InspectorDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/inspector/orders');
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();
        setOrders(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStartInspection = (orderId: string) => {
    router.push(`/inspector/inspection/${orderId}`);
  };

  if (loading) return <div className="min-h-screen bg-black text-white p-8">Cargando órdenes...</div>;
  if (error) return <div className="min-h-screen bg-black text-red-500 p-8">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-yellow-500">Panel de Inspector</h1>
            <button 
                onClick={() => router.push('/')}
                className="text-gray-400 hover:text-white"
            >
                Salir
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
                <div key={order.id} className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-yellow-500/50 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <span className="text-xs text-gray-500 block mb-1">Orden #{order.id}</span>
                            <h3 className="text-xl font-bold text-white">{order.vehicle}</h3>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                            order.status === 'completed' ? 'bg-green-900 text-green-300' :
                            order.status === 'in_progress' ? 'bg-blue-900 text-blue-300' :
                            'bg-yellow-900 text-yellow-300'
                        }`}>
                            {order.status === 'completed' ? 'Completada' :
                             order.status === 'in_progress' ? 'En Progreso' : 'Pendiente'}
                        </span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-400 mb-6">
                        <p>Cliente: <span className="text-gray-300">{order.clientName}</span></p>
                        <p>Fecha: <span className="text-gray-300">{order.date}</span></p>
                    </div>

                    <div className="flex flex-col gap-2">
                        {order.status !== 'completed' ? (
                            <button 
                                onClick={() => handleStartInspection(order.id)}
                                className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-4 rounded transition-colors"
                            >
                                {order.status === 'in_progress' ? 'Continuar Inspección' : 'Iniciar Inspección'}
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => handleStartInspection(order.id)}
                                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors"
                                >
                                    Ver Detalles
                                </button>
                                {order.aiReport && isClient && (
                                    <PDFDownloadLink document={<InspectionPDF order={order} />} fileName={`reporte_${order.id}.pdf`}>
                                        {({ blob, url, loading, error }) => (
                                            <button 
                                                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition-colors flex items-center justify-center"
                                                title="Descargar PDF"
                                                disabled={loading}
                                            >
                                               {loading ? '...' : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                                    </svg>
                                               )}
                                            </button>
                                        )}
                                    </PDFDownloadLink>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ))}

            {orders.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500">
                    No hay órdenes asignadas por el momento.
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
