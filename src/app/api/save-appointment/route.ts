import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate essential data
    if (!data.orderNumber) {
        return NextResponse.json({ error: 'Order number is required' }, { status: 400 });
    }

    // Save to Firestore collection 'appointments'
    // Use orderNumber as the document ID for easy lookup
    await db.collection('appointments').doc(data.orderNumber).set({
        ...data,
        createdAt: new Date().toISOString(),
        status: data.status || 'pending', // Default to pending if not set
        updatedAt: new Date().toISOString()
    });

    return NextResponse.json({ message: 'Appointment saved successfully', id: data.orderNumber });
  } catch (error: any) {
    console.error('Error saving appointment:', error);
    return NextResponse.json({ 
        error: 'Failed to save appointment', 
        details: error.message 
    }, { status: 500 });
  }
}
