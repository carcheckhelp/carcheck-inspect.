import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebaseAdmin'; // Import the function

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = getDb(); // Get the database instance inside the handler
    const reportsSnapshot = await db.collection('reports').get();
    
    if (reportsSnapshot.empty) {
      return NextResponse.json([], { status: 200 });
    }

    const reports = reportsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        vehicle: {
          make: data.vehicle.make,
          model: data.vehicle.model,
          year: data.vehicle.year,
        },
        executiveSummary: {
          rating: data.executiveSummary.rating,
        },
      };
    });

    return NextResponse.json(reports);

  } catch (error) {
    console.error("Error fetching reports from Firestore:", error);
    return new NextResponse(
      JSON.stringify({ message: 'Error interno del servidor al obtener los informes.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
