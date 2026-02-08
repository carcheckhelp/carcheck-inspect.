import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin'; // Using aliased path

export const dynamic = 'force-dynamic'; // This is the fix!

export async function GET() {
  try {
    const reportsSnapshot = await db.collection('reports').get();
    
    if (reportsSnapshot.empty) {
      return NextResponse.json([], { status: 200 });
    }

    // Map over the documents to create a simplified list for the index page
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
