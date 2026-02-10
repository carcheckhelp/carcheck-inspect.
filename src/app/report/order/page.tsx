'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getOrderById } from '@/lib/firebase/firestore';
import { CheckCircle2, AlertTriangle, Info, Clock, Download } from 'lucide-react';
import DownloadInspectionButton from '@/components/DownloadInspectionButton';

// Utility to render Markdown as HTML with styling
function markdownToHtml(md: string): string {
    if (!md) return '';
    return md
        .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-cyan-400 mb-6">$1</h1>')
        .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold text-white mt-8 mb-4 border-b border-gray-700 pb-2">$1</h2>')
        .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold text-cyan-300 mt-6 mb-3">$1</h3>')
        .replace(/\n/g, '<br />')
        .replace(/\*\*(.*)\*\*/g, '<strong class="text-yellow-400 font-bold">$1</strong>')
        .replace(/\* (.*)/g, '<li class="ml-6 list-disc text-gray-300 mb-1">$1</li>')
        .replace(/- (.*)/g, '<li class="ml-6 list-disc text-gray-300 mb-1">$1</li>');
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
                    // If data exists but no report yet, we might want to show partial data
                    setOrderData(data); 
                } else {
                    setError(`No se encontró ninguna orden con el ID: ${orderId}`);
                }
            } catch (err) {
                setError("Error al cargar el informe. Verifique la conexión.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchOrder();
    }, [orderId]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-400 animate-pulse">Generando informe detallado...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
                <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6 max-w-md text-center">
                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-red-400 mb-2">Error</h2>
                    <p className="text-gray-300">{error}</p>
                </div>
            </div>
        );
    }

    if (!orderData) return null;

    const reportHtml = orderData.report ? markdownToHtml(orderData.report) : '';
    
    // Categorize inspection points for display
    const passedPoints = [];
    const attentionPoints = [];
    const failedPoints = [];

    if (orderData.inspectionResults) {
        Object.entries(orderData.inspectionResults).forEach(([key, value]) => {
            if (value === 'ok') passedPoints.push(key);
            else if (value === 'attention') attentionPoints.push(key);
            else if (value === 'fail') failedPoints.push(key);
        });
    }

    return (
        <div className="min-h-screen bg-gray-950 text-gray-200 font-sans pb-12">
            {/* Header / Hero */}
            <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-10 shadow-lg">
                <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Informe <span className="text-cyan-400">CarCheck</span></h1>
                        <p className="text-sm text-gray-400">Orden #{orderData.orderNumber || orderId}</p>
                    </div>
                    <DownloadInspectionButton order={orderData} />
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
                
                {/* Vehicle Summary Card */}
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-xl">
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <Info className="w-5 h-5 text-cyan-400" />
                        Vehículo Inspeccionado
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Marca</p>
                            <p className="text-lg font-medium text-white">{orderData.vehicle.make}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Modelo</p>
                            <p className="text-lg font-medium text-white">{orderData.vehicle.model}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Año</p>
                            <p className="text-lg font-medium text-white">{orderData.vehicle.year}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">VIN</p>
                            <p className="text-lg font-medium text-white font-mono">{orderData.vehicle.vin || 'N/A'}</p>
                        </div>
                    </div>
                </div>

                {/* AI Executive Summary */}
                {reportHtml && (
                    <div className="bg-gray-900 rounded-xl p-8 border border-cyan-900/30 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                            <Info className="w-64 h-64 text-cyan-400" />
                        </div>
                        <div className="prose prose-invert max-w-none relative z-10" dangerouslySetInnerHTML={{ __html: reportHtml }} />
                    </div>
                )}

                {/* Detailed Inspection Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Issues Column */}
                    <div className="space-y-6">
                        {failedPoints.length > 0 && (
                            <div className="bg-red-950/30 rounded-xl p-6 border border-red-900/50">
                                <h3 className="text-red-400 font-bold text-lg mb-4 flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5" />
                                    Fallos Críticos Detectados ({failedPoints.length})
                                </h3>
                                <ul className="space-y-2">
                                    {failedPoints.map(point => (
                                        <li key={point} className="flex items-start gap-2 text-red-200/80 text-sm">
                                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {attentionPoints.length > 0 && (
                            <div className="bg-yellow-950/30 rounded-xl p-6 border border-yellow-900/50">
                                <h3 className="text-yellow-400 font-bold text-lg mb-4 flex items-center gap-2">
                                    <Clock className="w-5 h-5" />
                                    Requiere Atención Futura ({attentionPoints.length})
                                </h3>
                                <ul className="space-y-2">
                                    {attentionPoints.map(point => (
                                        <li key={point} className="flex items-start gap-2 text-yellow-200/80 text-sm">
                                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-yellow-500 shrink-0"></span>
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Passed & Observations Column */}
                    <div className="space-y-6">
                        <div className="bg-green-950/20 rounded-xl p-6 border border-green-900/30">
                            <h3 className="text-green-400 font-bold text-lg mb-4 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5" />
                                Puntos Aprobados ({passedPoints.length})
                            </h3>
                            <div className="max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                                <ul className="space-y-2">
                                    {passedPoints.map(point => (
                                        <li key={point} className="flex items-center gap-2 text-green-200/60 text-sm">
                                            <CheckCircle2 className="w-3 h-3 text-green-500/50" />
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                         {/* Inspector Notes */}
                         {orderData.categoryObservations && Object.values(orderData.categoryObservations).some((obs: any) => obs && obs.trim()) && (
                            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                                <h3 className="text-gray-300 font-bold text-lg mb-4">Notas del Inspector</h3>
                                <div className="space-y-3">
                                    {Object.entries(orderData.categoryObservations).map(([catId, obs]: [string, any]) => (
                                        obs && obs.trim() ? (
                                            <div key={catId} className="text-sm text-gray-400 italic border-l-2 border-gray-600 pl-3">
                                                "{obs}"
                                            </div>
                                        ) : null
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="text-center pt-8 border-t border-gray-800">
                    <p className="text-gray-500 text-sm">
                        Este informe fue generado utilizando tecnología de IA para asistir en la interpretación de los datos recolectados.
                        Siempre consulte con su mecánico de confianza para reparaciones mayores.
                    </p>
                </div>
            </div>
        </div>
    );
}
