
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CircleCheck, CircleX, LoaderCircle, Mail, User, Car, Calendar } from 'lucide-react';

function ConfirmationContent() {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState('procesando'); // procesando, exito, error
    const [debugMessage, setDebugMessage] = useState('');
    const [orderNumber, setOrderNumber] = useState('');

    useEffect(() => {
        const processAppointment = async () => {
            const appointmentDataString = localStorage.getItem('appointmentData');
            if (!appointmentDataString) {
                setStatus('error');
                setDebugMessage('No se encontraron datos de la cita en el almacenamiento local.');
                return;
            }

            const appointmentData = JSON.parse(appointmentDataString);
            const generatedOrderNumber = `CC-${Date.now()}`;
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
                    throw new Error(`La API respondió con un error: ${errorData.error || 'Error desconocido'}`);
                }
                setDebugMessage('Paso 1 Exitoso: La cita se guardó correctamente.');

            } catch (error: any) {
                setStatus('error');
                setDebugMessage(`Paso 1 Fallido: ${error.message}`);
                return; // Detener si el guardado falla
            }

            // Paso 2.1: Enviar correo al cliente
            try {
                setDebugMessage('Paso 2.1: Enviando correo de confirmación al cliente...');
                const customerEmailResponse = await fetch('/api/send-customer-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(appointmentData),
                });

                if (!customerEmailResponse.ok) {
                    const errorData = await customerEmailResponse.json();
                    throw new Error(`La API respondió con un error: ${errorData.error || 'Error desconocido'}`);
                }
                setDebugMessage('Paso 2.1 Exitoso: Correo de confirmación enviado.');

            } catch (error: any) {
                setStatus('error');
                setDebugMessage(`Paso 2.1 Fallido: ${error.message}`);
                return; // Detener si el correo al cliente falla
            }
            
            // Paso 2.2: Enviar correo al inspector
            try {
                setDebugMessage('Paso 2.2: Enviando notificación al inspector...');
                const inspectorEmailResponse = await fetch('/api/send-inspector-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(appointmentData),
                });

                if (!inspectorEmailResponse.ok) {
                    const errorData = await inspectorEmailResponse.json();
                    throw new Error(`La API respondió con un error: ${errorData.error || 'Error desconocido'}`);
                }
                setDebugMessage('Paso 2.2 Exitoso: Correo de notificación enviado.');

            } catch (error: any) {
                setStatus('error');
                setDebugMessage(`Paso 2.2 Fallido: ${error.message}`);
                return; // Detener si el correo al inspector falla
            }
            

            // Éxito final
            setStatus('exito');
            setDebugMessage('¡Proceso completado! La cita está agendada y los correos han sido enviados.');
            localStorage.removeItem('appointmentData');
        };

        processAppointment();
    }, []);

    const renderStatus = () => {
        switch (status) {
            case 'procesando':
                return (
                    <>
                        <LoaderCircle className="animate-spin h-16 w-16 text-blue-500" />
                        <h1 className="text-2xl font-bold mt-4">Procesando tu cita...</h1>
                        <p className="text-gray-600 mt-2">Por favor, espera un momento.</p>
                    </>
                );
            case 'exito':
                return (
                    <>
                        <CircleCheck className="h-16 w-16 text-green-500" />
                        <h1 className="text-2xl font-bold mt-4">¡Cita Agendada con Éxito!</h1>
                        <p className="text-gray-600 mt-2">Tu número de orden es <span className="font-semibold text-gray-800">{orderNumber}</span>.</p>
                        <p className="text-gray-600 mt-1">Hemos enviado un correo de confirmación con los detalles.</p>
                    </>
                );
            case 'error':
                return (
                    <>
                        <CircleX className="h-16 w-16 text-red-500" />
                        <h1 className="text-2xl font-bold mt-4">Hubo un problema</h1>
                        <p className="text-gray-600 mt-2">No pudimos agendar tu cita. Por favor, intenta de nuevo.</p>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
                {renderStatus()}
            </div>
            {debugMessage && (
                <div className="mt-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-md w-full text-sm font-mono">
                    <p className="font-bold mb-2">Mensaje de Depuración:</p>
                    <p>{debugMessage}</p>
                </div>
            )}
        </div>
    );
}

export default function ConfirmationPage() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <ConfirmationContent />
        </Suspense>
    );
}
