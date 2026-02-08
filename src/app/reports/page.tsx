'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Loader, AlertTriangle, Car } from 'lucide-react';

// --- Type Definitions ---
type ReportSummary = {
  id: string;
  vehicle: {
    make: string;
    model: string;
    year: number;
  };
  executiveSummary: {
    rating: 'Excelente' | 'Bueno' | 'Regular' | 'Precaución';
  };
};

const RatingBadge = ({ rating }: { rating: string }) => {
  const color = rating === 'Excelente' ? 'bg-green-500' : rating === 'Bueno' ? 'bg-blue-500' : rating === 'Regular' ? 'bg-yellow-500' : 'bg-red-500';
  return <span className={`px-3 py-1 text-sm font-bold rounded-full text-black ${color}`}>{rating}</span>;
};

const ReportsIndexPage = () => {
  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('/api/reports');
        if (!response.ok) {
          throw new Error('No se pudo cargar la lista de informes.');
        }
        const data: ReportSummary[] = await response.json();
        setReports(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-4 sm:p-8">
      <header className="w-full max-w-5xl mx-auto mb-8 text-left">
        <Link href="/">
            <h1 className="text-5xl font-bold">
                <span style={{ color: '#B8860B' }}>Car</span>
                <span style={{ color: '#FFD700' }}>Check</span>
            </h1>
        </Link>
      </header>

      <main className="w-full max-w-5xl">
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold">Informes Disponibles</h2>
            <Link href="/" className="bg-gray-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors duration-300">
                Ir al Inicio
            </Link>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center p-16">
            <Loader className="animate-spin text-yellow-500" size={48} />
            <p className="mt-4 text-gray-300">Cargando informes...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-300 p-6 rounded-lg flex items-center">
            <AlertTriangle className="mr-4" size={24} />
            <div>
                <h3 className="font-bold">Error</h3>
                <p>{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <div key={report.id} className="bg-gray-900 rounded-2xl shadow-lg overflow-hidden flex flex-col justify-between transform hover:-translate-y-1 transition-transform duration-300">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <Car className="text-yellow-400" size={40}/>
                        <RatingBadge rating={report.executiveSummary.rating} />
                    </div>
                    <p className="text-sm text-gray-400">{report.vehicle.year}</p>
                    <h3 className="text-xl font-bold text-white">{`${report.vehicle.make} ${report.vehicle.model}`}</h3>
                </div>
                <Link href={`/report/${report.id}`} className="block bg-yellow-500 text-center text-black font-bold py-3 hover:bg-yellow-400 transition-colors duration-300">
                    Ver Informe
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ReportsIndexPage;
