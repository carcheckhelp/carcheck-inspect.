import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebaseAdmin'; // Import the function, not the db instance

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    // Await the params promise to resolve
    const { id } = await context.params;

    // Get the database instance inside the request handler
    const db = getDb();

    const reportDoc = await db.collection('reports').doc(id).get();

    if (!reportDoc.exists) {
      return new NextResponse(
        JSON.stringify({ message: `No se encontró un informe con el ID: ${id}` }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const reportData = reportDoc.data();

    const report = {
      id: reportDoc.id,
      ...reportData
    };

    return NextResponse.json(report);

  } catch (error: any) {
    console.error(`Error fetching report from Firestore:`, error);
    return new NextResponse(
      JSON.stringify({ 
        message: 'Error interno del servidor al obtener el informe.',
        error: error.message
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
