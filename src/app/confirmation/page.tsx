'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CircleCheck, CircleX, LoaderCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function ConfirmationContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState('procesando'); // procesando, exito, error
    const [debugMessage, setDebugMessage] = useState('');
    const [orderNumber, setOrderNumber] = useState('');
    const [canRetry, setCanRetry] = useState(false);

    useEffect(() => {
        const processAppointment = async () => {
            const appointmentDataString = localStorage.getItem('appointmentData');
            if (!appointmentDataString) {
                setStatus('error');
                setDebugMessage('No se encontraron datos de la cita en el almacenamiento local. Es posible que la página se haya recargado o que el proceso ya haya finalizado.');
                setCanRetry(true); // Allow going back
                return;
            }

            const appointmentData = JSON.parse(appointmentDataString);
            
            // Reuse existing order number if retrying, or generate new one
            const generatedOrderNumber = appointmentData.orderNumber || `CC-${Date.now()}`;
            setOrderNumber(generatedOrderNumber);
            appointmentData.orderNumber = generatedOrderNumber;

            // Paso 1: Guardar en la base de datos
            try {
                setStatus('procesando');
                setDebugMessage('Paso 1: Guardando la cita en la base de datos...');
                const saveResponse = await fetch('/api/save-appointment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(appointmentData),
                });

                if (!saveResponse.ok) {
                    const errorData = await saveResponse.json();
                    throw new Error(`La API respondió con un error: ${errorData.error} ${errorData.details ? ' - ' + errorData.details : ''}`);
                }
                setDebugMessage('Paso 1 Exitoso: La cita se guardó correctamente.');

            } catch (error: any) {
                setStatus('error');
                setDebugMessage(`Paso 1 Fallido: ${error.message}`);
                return; // Detener si el guardado falla
            }

            // Paso 2: Enviar correos
            try {
                setDebugMessage('Paso 2: Enviando correos de confirmación...');
                const emailResponse = await fetch('/api/send-emails', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(appointmentData),
                });

                if (!emailResponse.ok) {
                    const errorData = await emailResponse.json();
                    throw new Error(`La API de correos respondió con un error: ${errorData.error} ${errorData.details ? ' - ' + errorData.details : ''}`);
                }
                setDebugMessage('Paso 2 Exitoso: Correos enviados correctamente.');

            } catch (error: any) {
                setStatus('error');
                setDebugMessage(`Paso 2 Fallido: ${error.message}`);
                return; // Detener si el envío de correos falla
            }
            
            // Éxito final
            setStatus('exito');
            setDebugMessage('¡Proceso completado! La cita está agendada y los correos han sido enviados.');
            localStorage.removeItem('appointmentData');
        };

        processAppointment();
    }, []);

    const handleRetry = () => {
        // Navigate back to payment to regenerate data
        router.push('/schedule/payment');
    };

    const renderStatus = () => {
        switch (status) {
            case 'procesando':
                return (
                    <>
                        <LoaderCircle className="animate-spin h-20 w-20 text-yellow-500 mx-auto" />
                        <h1 className="text-3xl font-bold mt-6 text-white">Procesando tu cita...</h1>
                        <p className="text-gray-400 mt-2">Por favor, espera un momento mientras confirmamos los detalles.</p>
                        <p className="text-xs text-gray-600 mt-6 font-mono">{debugMessage}</p>
                    </>
                );
            case 'exito':
                return (
                    <>
                        <CircleCheck className="h-24 w-24 text-yellow-400 mx-auto drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
                        <h1 className="text-3xl font-bold mt-6 text-white">¡Cita Agendada!</h1>
                        <p className="text-gray-300 mt-4 text-lg">
                            Tu número de orden es <span className="font-bold text-yellow-400 text-xl tracking-wider">{orderNumber}</span>
                        </p>
                        <p className="text-gray-400 mt-2">
                            Hemos enviado un correo de confirmación con todos los detalles.
                        </p>
                        <button 
                            onClick={() => router.push('/')}
                            className="mt-8 bg-yellow-500 text-black font-bold px-8 py-3 rounded-lg hover:bg-yellow-400 transition-transform transform hover:scale-105 shadow-lg shadow-yellow-500/20"
                        >
                            Volver al Inicio
                        </button>
                    </>
                );
            case 'error':
                return (
                    <>
                        <CircleX className="h-24 w-24 text-red-500 mx-auto" />
                        <h1 className="text-3xl font-bold mt-6 text-white">Error en el Proceso</h1>
                        <div className="mt-6 bg-red-900/30 border border-red-500/50 text-red-200 px-6 py-4 rounded-lg text-left w-full">
                            <p className="font-bold text-red-400 mb-2">Detalles del Error:</p>
                            <p className="text-sm font-mono break-words opacity-90">{debugMessage || 'Ocurrió un error inesperado.'}</p>
                        </div>
                        
                        {canRetry ? (
                            <button 
                                onClick={handleRetry}
                                className="mt-8 bg-yellow-500 text-black font-bold px-8 py-3 rounded-lg hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2 w-full"
                            >
                                <ArrowLeft size={20} />
                                Volver al Pago e Intentar de Nuevo
                            </button>
                        ) : (
                            <div className="mt-8">
                                <p className="text-gray-500 text-sm mb-4">Por favor, contacta a soporte si el problema persiste.</p>
                                <button 
                                    onClick={() => router.push('/')}
                                    className="bg-gray-800 text-white font-bold px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    Volver al Inicio
                                </button>
                            </div>
                        )}
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4 font-sans">
             <header className="absolute top-8 left-8">
                <Link href="/">
                <h1 className="text-4xl md:text-5xl font-bold">
                    <span style={{ color: '#B8860B' }}>Car</span>
                    <span style={{ color: '#FFD700' }}>Check</span>
                </h1>
                </Link>
            </header>
            <div className="bg-gray-900 border border-gray-800 p-8 md:p-12 rounded-2xl shadow-2xl text-center max-w-lg w-full relative overflow-hidden">
                {/* Decorative background glow */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50"></div>
                
                {renderStatus()}
            </div>
        </div>
    );
}

export default function ConfirmationPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Cargando...</div>}>
            <ConfirmationContent />
        </Suspense>
    );
}
