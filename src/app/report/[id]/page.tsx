'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AlertTriangle, Toolbox, MessageSquare, Loader } from 'lucide-react';

// --- Type Definitions ---
type ReportCategory = {
  name: string;
  score: number;
  maxScore: number;
  summary: string;
  details: string;
};

type InspectionReport = {
  vehicle: {
    make: string;
    model: string;
    year: number;
  };
  executiveSummary: {
    rating: 'Excelente' | 'Bueno' | 'Regular' | 'Precaución';
    summary: string;
  };
  categories: ReportCategory[];
  inspectorNotes: string;
  recommendations: {
    priority: 'Alta' | 'Media' | 'Baja';
    text: string;
  }[];
};

// --- Helper Components ---
const ScoreIndicator = ({ score, maxScore }: { score: number; maxScore: number }) => {
  const scoreColor = score <= 2 ? 'bg-red-500' : score <= 3 ? 'bg-yellow-500' : 'bg-green-500';
  return (
    <div className="flex items-center gap-2">
      <div className="w-full bg-gray-700 rounded-full h-2.5">
        <div className={`${scoreColor} h-2.5 rounded-full`} style={{ width: `${(score / maxScore) * 100}%` }}></div>
      </div>
      <span className="font-bold text-lg">{score}/{maxScore}</span>
    </div>
  );
};

const RatingBadge = ({ rating }: { rating: string }) => {
  const color = rating === 'Excelente' ? 'bg-green-500' : rating === 'Bueno' ? 'bg-blue-500' : rating === 'Regular' ? 'bg-yellow-500' : 'bg-red-500';
  return <span className={`px-3 py-1 text-sm font-bold rounded-full text-black ${color}`}>{rating}</span>;
};

// --- Main Page Component ---
const ReportPage = () => {
  const params = useParams();
  const id = params.id as string;

  const [report, setReport] = useState<InspectionReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchReport = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/report/${id}`);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('El informe solicitado no existe.');
            } else {
                throw new Error('No se pudo cargar el informe.');
            }
        }
        const data: InspectionReport = await response.json();
        setReport(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  if (loading) {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
            <Loader className="animate-spin text-yellow-500" size={64} />
            <p className="mt-4 text-lg text-gray-300">Cargando informe...</p>
        </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 text-center">
            <AlertTriangle className="text-red-500" size={64} />
            <h2 className="mt-4 text-2xl font-bold">Ha Ocurrido un Error</h2>
            <p className="mt-2 text-lg text-red-400">{error}</p>
            <Link href="/" className="mt-8 bg-yellow-500 text-black font-bold py-3 px-8 rounded-lg hover:bg-yellow-400 transition-colors duration-300">
              Volver al Inicio
            </Link>
        </div>
    );
  }

  if (!report) {
    return null; 
  }

  const { vehicle, executiveSummary, categories, inspectorNotes, recommendations } = report;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-4 sm:p-8">
       <header className="w-full max-w-4xl mx-auto mb-8 text-left">
        <Link href="/">
          <h1 className="text-5xl font-bold">
            <span style={{ color: '#B8860B' }}>Car</span>
            <span style={{ color: '#FFD700' }}>Check</span>
          </h1>
        </Link>
      </header>

      <main className="w-full max-w-4xl bg-gray-900 rounded-2xl shadow-2xl p-6 sm:p-10">
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-2">Informe de Inspección</h2>
        <p className="text-xl sm:text-2xl text-yellow-400 font-bold mb-8">{`${vehicle.year} ${vehicle.make} ${vehicle.model}`}</p>

        <div className="bg-gray-800 rounded-xl p-6 mb-10 border border-yellow-500/50">
          <div className="flex items-center justify-between mb-4">
             <h3 className="text-2xl font-bold">En Resumen</h3>
             <RatingBadge rating={executiveSummary.rating} />
          </div>
          <p className="text-gray-300 leading-relaxed">{executiveSummary.summary}</p>
        </div>

        <div className="mb-10">
          <h3 className="text-2xl font-bold mb-6">Análisis por Categoría</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((cat) => (
              <div key={cat.name} className="bg-gray-800 p-5 rounded-lg">
                <h4 className="font-bold text-lg mb-1">{cat.name}</h4>
                <p className="text-sm text-yellow-400 font-semibold mb-2">{cat.summary}</p>
                <ScoreIndicator score={cat.score} maxScore={cat.maxScore} />
                <p className="text-sm text-gray-400 mt-2">{cat.details}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-800/50 border border-dashed border-gray-700 rounded-xl p-6">
                 <h3 className="flex items-center text-2xl font-bold mb-4"><MessageSquare className="mr-3 text-yellow-400"/>Observaciones del Inspector</h3>
                 <p className="text-gray-300 italic"> {`"${inspectorNotes}"`}</p>
            </div>

            <div className="bg-gray-800 rounded-xl p-6">
                 <h3 className="flex items-center text-2xl font-bold mb-4"><Toolbox className="mr-3 text-yellow-400"/>Recomendaciones Clave</h3>
                 <ul className="space-y-4">
                    {recommendations.map(rec => (
                        <li key={rec.text} className="flex items-start">
                            <AlertTriangle className={`mr-3 mt-1 ${rec.priority === 'Alta' ? 'text-red-500' : rec.priority === 'Media' ? 'text-yellow-500' : 'text-green-500' }`} size={20}/>
                            <div>
                                <span className="font-bold">{rec.priority}: </span>
                                <span className="text-gray-300">{rec.text}</span>
                            </div>
                        </li>
                    ))}
                 </ul>
            </div>
        </div>
      </main>
        <footer className="w-full max-w-4xl mx-auto mt-10 text-center">
             <Link href="/" className="bg-yellow-500 text-black font-bold py-3 px-8 rounded-lg hover:bg-yellow-400 transition-colors duration-300 text-lg">
                Volver al Inicio
              </Link>
        </footer>
    </div>
  );
};

export default ReportPage;
