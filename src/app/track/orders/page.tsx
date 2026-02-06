'use client';
import Link from 'next/link';

const OrdersPage = () => {
  // Dummy data for customer orders
  const customerOrders = [
    { id: 'ABC123XYZ', status: 'Completado', reportUrl: '#' },
    { id: 'DEF456UVW', status: 'En Proceso', reportUrl: null },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-8">
      <header className="w-full max-w-6xl flex justify-between items-center mb-8">
        <h1 className="text-5xl font-bold">
          <span style={{ color: '#B8860B' }}>Car</span>
          <span style={{ color: '#FFD700' }}>Check</span>
        </h1>
        <nav>
          <Link href="/track" className="text-yellow-500 hover:underline">
            Buscar de Nuevo
          </Link>
        </nav>
      </header>
      <main className="w-full max-w-4xl bg-gray-900 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6">Mis Órdenes</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg">
            <thead>
              <tr className="bg-gray-700">
                <th className="p-4 text-left text-lg font-bold">ID de Orden</th>
                <th className="p-4 text-left text-lg font-bold">Estado</th>
                <th className="p-4 text-left text-lg font-bold">Reporte</th>
              </tr>
            </thead>
            <tbody>
              {customerOrders.map((order, index) => (
                <tr key={order.id} className={`${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'} border-b border-gray-700`}>
                  <td className="p-4">{order.id}</td>
                  <td className={`p-4 ${order.status === 'Completado' ? 'text-green-400' : 'text-yellow-400'}`}>
                    {order.status}
                  </td>
                  <td className="p-4">
                    {order.reportUrl ? (
                      <a href={order.reportUrl} className="text-blue-400 hover:underline" download>Descargar</a>
                    ) : (
                      'No disponible'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default OrdersPage;
