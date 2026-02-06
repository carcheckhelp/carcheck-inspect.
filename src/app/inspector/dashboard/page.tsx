'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const InspectorDashboardPage = () => {
  const router = useRouter();
  const [orders, setOrders] = useState([
    { id: '12345', clientName: 'Juan Perez', vehicle: 'Toyota Camry 2021', status: 'Pendiente' },
    { id: '67890', clientName: 'Maria Rodriguez', vehicle: 'Honda Civic 2020', status: 'En Proceso' },
    { id: '54321', clientName: 'Carlos Gomez', vehicle: 'Ford Mustang 2022', status: 'Completada' },
    { id: '98765', clientName: 'Ana Martinez', vehicle: 'Chevrolet Traverse 2023', status: 'Pendiente' },
  ]);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const handleStartInspection = (orderId: string) => {
    router.push(`/inspector/inspection/${orderId}`);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-8">
      <header className="w-full max-w-6xl flex justify-between items-center mb-8">
        <Link href="/">

          <h1 className="text-5xl font-bold">
            <span style={{ color: '#B8860B' }}>Car</span>
            <span style={{ color: '#FFD700' }}>Check</span>
          </h1>

        </Link>
        <nav>
          <Link href="/inspector/login" className="text-yellow-500 hover:underline">
            Cerrar Sesión
          </Link>
        </nav>
      </header>
      <main className="w-full max-w-6xl bg-gray-900 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6">Órdenes Asignadas</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg">
            <thead>
              <tr className="bg-gray-700">
                <th className="p-4 text-left text-lg font-bold">ID Orden</th>
                <th className="p-4 text-left text-lg font-bold">Cliente</th>
                <th className="p-4 text-left text-lg font-bold">Vehículo</th>
                <th className="p-4 text-left text-lg font-bold">Estado</th>
                <th className="p-4 text-center text-lg font-bold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                  <td className="p-4">{order.id}</td>
                  <td className="p-4">{order.clientName}</td>
                  <td className="p-4">{order.vehicle}</td>
                  <td className="p-4">
                     <select 
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="p-2 bg-gray-700 border border-gray-600 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="En Proceso">En Proceso</option>
                      <option value="Completada">Completada</option>
                    </select>
                  </td>
                  <td className="p-4 flex justify-center items-center space-x-2">
                    <button 
                      onClick={() => handleStartInspection(order.id)}
                      className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-500 transition-colors duration-300"
                    >
                      Iniciar Inspección
                    </button>
                    <button 
                      disabled={order.status !== 'Completada'}
                      className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-500 transition-colors duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                      Descargar Reporte
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-8 text-center">
            <Link href="/" className="text-yellow-500 hover:underline">
                Volver a Inicio
            </Link>
        </div>
      </main>
    </div>
  );
};

export default InspectorDashboardPage;
