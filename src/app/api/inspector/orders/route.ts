import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // In a real app, we would verify the inspector's identity here.
    const snapshot = await db.collection('appointments').get();

    const orders = snapshot.docs.map(doc => {
        const data = doc.data();
        // Check if name exists directly or if it's split into firstName/lastName
        const clientName = data.personalInfo?.name 
          ? data.personalInfo.name 
          : `${data.personalInfo?.firstName || ''} ${data.personalInfo?.lastName || ''}`.trim();

        return {
            id: doc.id,
            clientName: clientName || 'N/A',
            vehicle: `${data.vehicleInfo?.make || 'N/A'} ${data.vehicleInfo?.model || ''} ${data.vehicleInfo?.year || ''}`,
            status: data.status || 'pending',
            createdAt: data.createdAt || new Date().toISOString()
        };
    });

    // Sort manually if needed, or rely on Firestore ordering if index exists
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error('Error fetching inspector orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders', details: error.message }, { status: 500 });
  }
}
