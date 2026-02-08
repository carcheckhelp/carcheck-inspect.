'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getOrdersByClient } from '@/lib/firebase/firestore';
import Link from 'next/link';

const OrdersDisplay = () => {
    const [customerOrders, setCustomerOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const searchParams = useSearchParams();

    useEffect(() => {
        const email = searchParams.get('email');
        if (!email) {
            setError('No se proporcionó un correo electrónico para la búsqueda.');
            return;
        }

        const fetchOrders = async () => {
            setIsLoading(true);
            setError(null);
            setCustomerOrders([]);

            try {
                const orders = await getOrdersByClient(email);
                if (orders.length === 0) {
                    setError('No se encontraron órdenes para este correo electrónico.');
                } else {
                    setCustomerOrders(orders);
                }
            } catch (err) {
                setError('Error al cargar las órdenes. Por favor, inténtelo de nuevo más tarde.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [searchParams]);

    if (isLoading) {
        return <p className="text-yellow-400 text-lg">Buscando órdenes...</p>;
    }

    if (error) {
        return <p className="text-red-500 text-lg">{error}</p>;
    }

    return (
        <div className="w-full max-w-4xl text-center">
            {customerOrders.length > 0 && (
                <div className="bg-gray-900 p-8 rounded-lg shadow-lg text-left">
                    <h3 className="text-3xl font-bold mb-6 text-yellow-400">Sus Órdenes</h3>
                    <div className="space-y-6">
                        {customerOrders.map(order => (
                            <div key={order.id} className="bg-gray-800 p-6 rounded-lg">
                                <p className="text-xl font-bold">Orden ID: <span className="text-yellow-500">{order.id}</span></p>
                                <p><span className="font-bold">Paquete:</span> {order.packageName}</p>
                                <p><span className="font-bold">Precio:</span> ${order.price.toLocaleString()}</p>
                                <p><span className="font-bold">Estado:</span> <span className="text-green-400">{order.status || 'Recibida'}</span></p>
                                {order.status === 'Completado' && (
                                    <Link href={`/report/${order.id}`} className="text-yellow-500 hover:underline">
                                        Ver Reporte
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
             <div className="mt-8">
                <Link href="/track" className="bg-gray-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors duration-300">
                Volver a la búsqueda
                </Link>
            </div>
        </div>
    );
};

export default OrdersDisplay;
