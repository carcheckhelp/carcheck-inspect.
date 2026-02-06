'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { generateInspectionReport } from '@/app/actions';

// Tipos de datos
interface InspectionPoint {
  id: string;
  label: string;
  score: number | null;
}

interface InspectionSection {
  id: string;
  title: string;
  points: InspectionPoint[];
  observations: string;
}

const InspectionFormPage = () => {
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as string;
  const [isLoading, setIsLoading] = useState(false);

  const [sections, setSections] = useState<InspectionSection[]>([
    {
        id: 'carroceria',
        title: 'Carrocería',
        points: [
            { id: 'c1', label: 'Pintura y acabado exterior', score: null },
            { id: 'c2', label: 'Estado de los paneles (abolladuras, rayones)', score: null },
            { id: 'c3', label: 'Alineación de puertas y capó', score: null },
            { id: 'c4', label: 'Estado de los parachoques', score: null },
            { id: 'c5', label: 'Cristales y espejos (grietas, astillas)', score: null },
        ],
        observations: '',
    },
    {
        id: 'interior',
        title: 'Interior',
        points: [
            { id: 'i1', label: 'Estado de la tapicería y asientos', score: null },
            { id: 'i2', label: 'Funcionamiento de cinturones de seguridad', score: null },
            { id: 'i3', label: 'Estado del tablero y controles', score: null },
            { id: 'i4', label: 'Sistema de aire acondicionado y calefacción', score: null },
            { id: 'i5', label: 'Equipo de audio y navegación', score: null },
        ],
        observations: '',
    },
    {
      id: 'motor',
      title: 'Motor',
      points: [
        { id: 'm1', label: 'Arranque y ralentí del motor', score: null },
        { id: 'm2', label: 'Ruidos o vibraciones anormales', score: null },
        { id: 'm3', label: 'Fugas de aceite o refrigerante', score: null },
        { id: 'm4', label: 'Estado de mangueras y correas', score: null },
        { id: 'm5', label: 'Sistema de escape (humo, ruidos)', score: null },
      ],
      observations: '',
    },
    {
        id: 'transmision',
        title: 'Transmisión',
        points: [
            { id: 't1', label: 'Cambio de marchas (suavidad)', score: null },
            { id: 't2', label: 'Ruidos o vibraciones en la transmisión', score: null },
            { id: 't3', label: 'Fugas de fluido de transmisión', score: null },
            { id: 't4', label: 'Respuesta del embrague (en manuales)', score: null },
        ],
        observations: '',
    },
    {
        id: 'luces',
        title: 'Luces',
        points: [
            { id: 'l1', label: 'Faros delanteros (altas y bajas)', score: null },
            { id: 'l2', label: 'Luces traseras y de freno', score: null },
            { id: 'l3', label: 'Intermitentes y luces de emergencia', score: null },
            { id: 'l4', label: 'Luces interiores y del tablero', score: null },
        ],
        observations: '',
    },
    {
        id: 'fluidos',
        title: 'Niveles de Fluidos',
        points: [
            { id: 'f1', label: 'Nivel y estado del aceite del motor', score: null },
            { id: 'f2', label: 'Nivel y estado del líquido refrigerante', score: null },
            { id: 'f3', label: 'Nivel del líquido de frenos', score: null },
            { id: 'f4', label: 'Nivel del líquido de dirección asistida', score: null },
            { id: 'f5', label: 'Nivel del líquido limpiaparabrisas', score: null },
        ],
        observations: '',
    },
  ]);

  const handleScoreChange = (sectionId: string, pointId: string, score: number) => {
    setSections(sections.map(section => 
      section.id === sectionId ? {
        ...section,
        points: section.points.map(point => 
          point.id === pointId ? { ...point, score } : point
        )
      } : section
    ));
  };

  const handleObservationsChange = (sectionId: string, value: string) => {
    setSections(sections.map(section => 
      section.id === sectionId ? { ...section, observations: value } : section
    ));
  };

  const finishInspection = async () => {
    setIsLoading(true);
    console.log('Enviando datos de la inspección...', sections);

    const result = await generateInspectionReport(sections);

    if (result.error) {
      alert(`Error: ${result.error}`);
      setIsLoading(false);
      return;
    }

    console.log('Reporte generado:', result.report);
    alert('Inspección finalizada y reporte generado con éxito.');
    
    // Aquí, también actualizarías el estado de la orden en tu base de datos a 'Completada'

    setIsLoading(false);
    router.push('/inspector/dashboard');
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-6 text-center text-yellow-500">Inspección del Vehículo - Orden #{orderId}</h1>
      <div className="space-y-8">
        {sections.map(section => (
          <div key={section.id} className="bg-gray-900 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">{section.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {section.points.map(point => (
                    <div key={point.id} className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                        <label className="text-lg">{point.label}</label>
                        <div className="flex space-x-2">
                            {[1, 2, 3, 4, 5].map(scoreValue => (
                                <button 
                                    key={scoreValue} 
                                    onClick={() => handleScoreChange(section.id, point.id, scoreValue)}
                                    className={`w-10 h-10 rounded-full font-bold transition-all duration-200 ${point.score === scoreValue ? 'bg-yellow-500 text-black scale-110' : 'bg-gray-700 hover:bg-yellow-400 hover:text-black'}`}>
                                    {scoreValue}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <textarea 
                value={section.observations} 
                onChange={(e) => handleObservationsChange(section.id, e.target.value)}
                placeholder="Observaciones del inspector..."
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 mt-4"
                rows={3}
            ></textarea>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <button onClick={finishInspection} className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-500 transition-colors duration-300 text-lg disabled:bg-gray-500" disabled={isLoading}>
          {isLoading ? 'Generando Reporte...' : 'Finalizar Inspección y Generar Reporte'}
        </button>
      </div>
    </div>
  );
};

export default InspectionFormPage;
