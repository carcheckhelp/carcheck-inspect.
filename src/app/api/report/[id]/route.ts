import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';

export const dynamic = 'force-dynamic'; // This is the fix!

// This signature is required by the specific version of Next.js/Turbopack being used.
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    // Await the params promise to resolve
    const { id } = await context.params;

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
    // It's good practice to type the error object
    console.error(`Error fetching report from Firestore:`, error);
    return new NextResponse(
      JSON.stringify({ 
        message: 'Error interno del servidor al obtener el informe.',
        error: error.message // Include error message for better debugging
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
