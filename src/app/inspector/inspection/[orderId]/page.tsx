'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Order {
  id: string;
  clientName: string;
  vehicle: string;
  status: string;
  // ... other properties
}

const InspectionPage = ({ params }: { params: { orderId: string } }) => {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/inspector/orders/${params.orderId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch order details');
        }
        const data = await response.json();
        setOrder(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params.orderId]);

  if (loading) return <div className="text-white">Cargando detalles de la inspección...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-4">Inspección - Orden #{params.orderId}</h1>
      {order && (
        <div className="bg-gray-900 p-6 rounded shadow-lg">
          <p><strong>Cliente:</strong> {order.clientName}</p>
          <p><strong>Vehículo:</strong> {order.vehicle}</p>
          <p><strong>Estado:</strong> {order.status}</p>
          {/* Formulario de inspección iría aquí */}
          <button 
            className="mt-4 bg-yellow-500 text-black font-bold py-2 px-4 rounded hover:bg-yellow-400"
            onClick={() => router.back()}
          >
            Volver
          </button>
        </div>
      )}
    </div>
  );
};

export default InspectionPage;
