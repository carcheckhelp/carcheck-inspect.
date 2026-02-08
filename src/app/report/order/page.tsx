'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getOrderById } from '@/lib/firebase/firestore';

// A simple utility to convert Markdown to basic HTML
// This function can be expanded for more complex Markdown features.
function markdownToHtml(md: string): string {
    if (!md) return '';
    return md
        .replace(/^# (.*$)/gim, '<h1 class="text-4xl font-bold text-cyan-300 mb-6">$1</h1>')
        .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold text-white mt-8 mb-4">$1</h2>')
        .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold text-cyan-400 mt-6 mb-3">$1</h3>')
        .replace(/\n/g, '<br />')
        .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
        .replace(/\* (.*)/g, '<li class="ml-6 list-disc">$1</li>');
}

export default function ReportPage() {
    const params = useParams();
    const orderId = params.orderId as string;
    const [orderData, setOrderData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!orderId) return;

        async function fetchOrder() {
            try {
                const data = await getOrderById(orderId);
                if (data && data.report) {
                    setOrderData(data);
                } else if (data) {
                    setError("El informe para esta orden aún no está disponible.");
                } else {
                    setError(`No se encontró ninguna orden con el ID: ${orderId}`);
                }
            } catch (err) {
                setError("Error al cargar el informe. Verifique la configuración de Firebase.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchOrder();
    }, [orderId]);

    if (isLoading) {
        return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center"><p>Cargando informe...</p></div>;
    }

    if (error) {
        return <div className="min-h-screen bg-gray-900 text-red-400 flex items-center justify-center"><p>{error}</p></div>;
    }

    if (!orderData) {
        // This case should ideally not be hit if error handling is correct, but it's a good fallback.
        return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center"><p>No se pudo cargar el informe.</p></div>;
    }

    const reportHtml = markdownToHtml(orderData.report);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-300 font-sans p-4 sm:p-8">
            <div className="max-w-4xl mx-auto bg-gray-800 rounded-2xl shadow-2xl shadow-cyan-500/10 overflow-hidden">
                <header className="p-8 bg-gray-900 border-b border-gray-700">
                    <h1 className="text-3xl font-bold text-cyan-400">Informe Final de Inspección</h1>
                    <p className="text-gray-400 mt-1">Orden: <span className="font-mono">{orderId}</span></p>
                </header>

                <div className="p-8">
                    <div className="mb-8 pb-8 border-b border-gray-700">
                        <h2 className="text-2xl font-semibold text-white mb-4">Detalles del Vehículo</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-lg">
                            <div><strong className="text-gray-400">Marca:</strong> {orderData.vehicle.make}</div>
                            <div><strong className="text-gray-400">Modelo:</strong> {orderData.vehicle.model}</div>
                            <div><strong className="text-gray-400">Año:</strong> {orderData.vehicle.year}</div>
                            <div className="col-span-2"><strong className="text-gray-400">VIN:</strong> <span className="font-mono">{orderData.vehicle.vin}</span></div>
                        </div>
                    </div>

                    <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: reportHtml }} />
                </div>

                <footer className="p-8 bg-gray-900 mt-8 border-t border-gray-700 text-center">
                    <p className="text-gray-500">Generado con CarCheck & Gemini AI</p>
                </footer>
            </div>
        </div>
    );
}
