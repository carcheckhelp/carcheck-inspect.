import { db } from './src/lib/firebaseAdmin'; // Adjust path as needed

// --- Type Definitions (copied for script self-containment) ---
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

// --- Mock Data ---
const reportsToSeed: Record<string, InspectionReport> = {
    'toyota-corolla-2018-xyz': {
        vehicle: {
            make: 'Toyota',
            model: 'Corolla',
            year: 2018,
        },
        executiveSummary: {
            rating: 'Bueno',
            summary: 'El vehículo se encuentra en buen estado general para su año y kilometraje. Presenta un rendimiento sólido del motor y la transmisión, pero requiere atención en los frenos y algunos detalles cosméticos menores. Se recomienda la compra, condicionada a la realización de las reparaciones sugeridas.',
        },
        categories: [
            { name: 'Motor', score: 4, maxScore: 5, summary: 'Rendimiento Óptimo', details: 'El motor arranca sin problemas...' },
            { name: 'Transmisión', score: 5, maxScore: 5, summary: 'Excelente', details: 'Los cambios de marcha son suaves...' },
            { name: 'Frenos', score: 2, maxScore: 5, summary: 'Requiere Atención Inmediata', details: 'Las pastillas de freno delanteras están cerca de su límite...' },
        ],
        inspectorNotes: 'Durante la prueba de manejo, el vehículo demostró un comportamiento predecible...',
        recommendations: [
            { priority: 'Alta', text: 'Reemplazar pastillas y rectificar discos de freno delanteros.' },
            { priority: 'Media', text: 'Reemplazar las dos llantas traseras en los próximos 5,000 km.' },
        ],
    },
    'ford-f150-2020-abc': {
        vehicle: {
            make: 'Ford',
            model: 'F-150',
            year: 2020,
        },
        executiveSummary: {
            rating: 'Excelente',
            summary: 'Esta F-150 está en condiciones excepcionales. El motor V8 tiene una potencia impresionante...',
        },
        categories: [
            { name: 'Motor', score: 5, maxScore: 5, summary: 'Impecable', details: 'Motor 5.0L V8 funcionando a la perfección...' },
            { name: 'Transmisión', score: 5, maxScore: 5, summary: 'Perfecta', details: 'La transmisión de 10 velocidades cambia de forma imperceptible...' },
            { name: 'Carrocería y Chasis', score: 5, maxScore: 5, summary: 'Sin Detalles', details: 'La pintura no tiene rayones ni abolladuras...' },
        ],
        inspectorNotes: 'Es una de las F-150 mejor cuidadas que he inspeccionado...',
        recommendations: [
            { priority: 'Baja', text: 'Realizar el próximo cambio de aceite en 7,000 km...' },
        ],
    }
};

async function seedDatabase() {
  console.log('Starting to seed database...');
  const batch = db.batch();

  for (const [id, reportData] of Object.entries(reportsToSeed)) {
    const reportRef = db.collection('reports').doc(id);
    batch.set(reportRef, reportData);
    console.log(`- Preparing to seed report with ID: ${id}`);
  }

  try {
    await batch.commit();
    console.log('\nDatabase seeded successfully!');
    console.log(`${Object.keys(reportsToSeed).length} reports have been added to the 'reports' collection.`);
  } catch (error) {
    console.error('\nError while seeding database:', error);
  }
}

seedDatabase();
