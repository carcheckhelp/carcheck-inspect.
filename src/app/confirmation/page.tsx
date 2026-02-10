'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
// Import icons directly from lucide-react or create simple SVG components if library missing
// Assuming lucide-react is available as per package.json
import { CheckCircle, XCircle, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function ConfirmationContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState('procesando'); // procesando, exito, error
    const [debugMessage, setDebugMessage] = useState('');
    const [orderNumber, setOrderNumber] = useState('');
    const [canRetry, setCanRetry] = useState(false);
    
    // Ref to prevent double execution in Strict Mode
    const processingRef = useRef(false);

    useEffect(() => {
        // If already processing or processed, do nothing
        if (processingRef.current) return;
        
        const processAppointment = async () => {
            const appointmentDataString = localStorage.getItem('appointmentData');
            
            if (!appointmentDataString) {
                // If no data, maybe it was already processed and cleared?
                // Or user navigated here directly.
                setStatus('error');
                setDebugMessage('No se encontraron datos de la cita. Es posible que ya se haya procesado.');
                return;
            }

            // Mark as processing to block subsequent calls
            processingRef.current = true;

            let appointmentData;
            try {
                appointmentData = JSON.parse(appointmentDataString);
            } catch (e) {
                setStatus('error');
                setDebugMessage('Error al leer los datos de la cita.');
                return;
            }
            
            // Reuse existing order number if present (idempotency check), or generate new one
            // Ideally payment page should generate it, but we do it here if missing.
            const generatedOrderNumber = appointmentData.orderNumber || `CC-${Date.now()}`;
            setOrderNumber(generatedOrderNumber);
            appointmentData.orderNumber = generatedOrderNumber;

            // Paso 1: Guardar en la base de datos
            try {
                setDebugMessage('Guardando cita...');
                const saveResponse = await fetch('/api/save-appointment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(appointmentData),
                });

                if (!saveResponse.ok) {
                    const errorData = await saveResponse.json();
                    throw new Error(errorData.error || 'Error al guardar la cita');
                }
            } catch (error: any) {
                setStatus('error');
                setDebugMessage(`Error al guardar: ${error.message}`);
                processingRef.current = false; // Allow retry if save failed
                return; 
            }

            // Paso 2: Enviar correos
            try {
                setDebugMessage('Enviando correos...');
                const emailResponse = await fetch('/api/send-emails', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(appointmentData),
                });

                if (!emailResponse.ok) {
                    console.warn('Email sending reported an issue, but order is saved.');
                    // We don't fail the whole process if email fails, as order is saved.
                }
            } catch (error: any) {
                console.error('Email sending failed:', error);
                // Continue to success state
            }
            
            // Éxito final
            setStatus('exito');
            localStorage.removeItem('appointmentData');
        };

        processAppointment();
    }, []);

    const handleRetry = () => {
        router.push('/schedule/payment');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4 font-sans text-white">
             <header className="absolute top-8 left-8">
                <Link href="/">
                <h1 className="text-4xl md:text-5xl font-bold">
                    <span style={{ color: '#B8860B' }}>Car</span>
                    <span style={{ color: '#FFD700' }}>Check</span>
                </h1>
                </Link>
            </header>
            
            <div className="bg-gray-900 border border-gray-800 p-8 md:p-12 rounded-2xl shadow-2xl text-center max-w-lg w-full relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50"></div>
                
                {status === 'procesando' && (
                    <>
                        <Loader2 className="animate-spin h-16 w-16 text-yellow-500 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold mb-2">Procesando tu solicitud</h2>
                        <p className="text-gray-400">{debugMessage}</p>
                    </>
                )}

                {status === 'exito' && (
                    <>
                        <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold mb-4 text-yellow-400">¡Cita Confirmada!</h2>
                        <p className="text-gray-300 mb-6">
                            Tu número de orden es <br/>
                            <span className="font-mono font-bold text-2xl text-white">{orderNumber}</span>
                        </p>
                        <p className="text-sm text-gray-400 mb-8">
                            Hemos enviado los detalles a tu correo y al inspector asignado.
                        </p>
                        <button 
                            onClick={() => router.push('/')}
                            className="bg-yellow-500 text-black font-bold px-8 py-3 rounded-lg hover:bg-yellow-400 transition-transform transform hover:scale-105"
                        >
                            Volver al Inicio
                        </button>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <XCircle className="h-20 w-20 text-red-500 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold mb-4">Hubo un problema</h2>
                        <p className="text-red-300 mb-6 bg-red-900/20 p-4 rounded text-sm">
                            {debugMessage}
                        </p>
                        <button 
                            onClick={() => router.push('/')}
                            className="bg-gray-800 hover:bg-gray-700 text-white font-bold px-6 py-2 rounded-lg transition-colors"
                        >
                            Ir al Inicio
                        </button>
                    </>
                )}
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
