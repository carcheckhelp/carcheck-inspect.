'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Order {
  id: string;
  clientName: string;
  vehicle: string;
  status: string;
  createdAt: string;
}

const InspectorDashboardPage = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/inspector/orders');
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
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

  const handleStatusChange = async (orderId: string, newStatus: string) => {
      // Optimistic update
      const previousOrders = [...orders];
      setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
      ));

      try {
          // In a real app, update via API
           // await fetch(`/api/inspector/orders/${orderId}`, { 
           //     method: 'PATCH', 
           //     body: JSON.stringify({ status: newStatus }) 
           // });
           console.log(`Updated status for ${orderId} to ${newStatus}`);

      } catch (err) {
          // Revert on error
          console.error("Failed to update status", err);
          setOrders(previousOrders);
          alert("Failed to update status");
      }
  };


  const handleStartInspection = (orderId: string) => {
    router.push(`/inspector/inspection/${orderId}`);
  };

  if (loading) {
    return <div className="min-h-screen bg-black text-white flex justify-center items-center">Cargando órdenes...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-black text-red-500 flex justify-center items-center">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-8">
      <header className="w-full max-w-6xl flex justify-between items-center mb-8">
         <Link href="/">
          <h1 className="text-3xl font-bold">
            <span style={{ color: '#B8860B' }}>Car</span>
            <span style={{ color: '#FFD700' }}>Check</span>
            <span className="text-white ml-2 text-xl">Inspector</span>
          </h1>
        </Link>
        <nav>
          <Link href="/inspector/login" className="text-yellow-500 hover:underline">
            Cerrar Sesión
          </Link>
        </nav>
      </header>
      
      <main className="w-full max-w-6xl bg-gray-900 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-yellow-500">Órdenes Asignadas</h2>
        
        {orders.length === 0 ? (
            <p className="text-gray-400">No hay órdenes asignadas actualmente.</p>
        ) : (
            <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg">
                <thead>
                <tr className="bg-gray-700 text-gray-300">
                    <th className="p-4 text-left font-bold">ID Orden</th>
                    <th className="p-4 text-left font-bold">Cliente</th>
                    <th className="p-4 text-left font-bold">Vehículo</th>
                    <th className="p-4 text-left font-bold">Fecha</th>
                    <th className="p-4 text-left font-bold">Estado</th>
                    <th className="p-4 text-center font-bold">Acciones</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-750 transition-colors">
                    <td className="p-4 font-mono text-sm">{order.id}</td>
                    <td className="p-4">{order.clientName}</td>
                    <td className="p-4">{order.vehicle}</td>
                    <td className="p-4 text-sm text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase
                            ${order.status === 'pending' ? 'bg-yellow-900 text-yellow-200' : 
                              order.status === 'in_progress' ? 'bg-blue-900 text-blue-200' :
                              order.status === 'completed' ? 'bg-green-900 text-green-200' : 'bg-gray-700'}
                        `}>
                            {order.status === 'pending' ? 'Pendiente' : 
                             order.status === 'in_progress' ? 'En Proceso' :
                             order.status === 'completed' ? 'Completada' : order.status}
                        </span>
                    </td>
                    <td className="p-4 flex justify-center items-center space-x-2">
                        <button 
                        onClick={() => handleStartInspection(order.id)}
                        className="bg-blue-600 text-white text-sm font-bold py-2 px-3 rounded hover:bg-blue-500 transition-colors"
                        >
                        {order.status === 'completed' ? 'Ver Inspección' : 'Inspeccionar'}
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        )}
      </main>
    </div>
  );
};

export default InspectorDashboardPage;
