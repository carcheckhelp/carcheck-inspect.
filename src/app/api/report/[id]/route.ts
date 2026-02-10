import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const orderId = params.id;
        
        console.log(`[API Report] Fetching order: ${orderId}`);

        // CORRECCIÓN: Buscar en la colección 'appointments', que es donde se guardan las órdenes e inspecciones.
        let doc = await db.collection('appointments').doc(orderId).get();
        let data = doc.exists ? doc.data() : null;
        let id = doc.id;

        if (!doc.exists) {
            console.log(`[API Report] Not found by ID. Searching by orderNumber...`);
            // Intentar buscar por campo 'orderNumber' si el ID no coincide directamente (por si acaso)
            const querySnapshot = await db.collection('appointments').where('orderNumber', '==', orderId).limit(1).get();
            
            if (!querySnapshot.empty) {
                doc = querySnapshot.docs[0];
                data = doc.data();
                id = doc.id;
                console.log(`[API Report] Found by orderNumber: ${id}`);
            } else {
                console.log(`[API Report] Order not found.`);
                return NextResponse.json({ error: 'Order not found' }, { status: 404 });
            }
        }

        if (data) {
             console.log(`[API Report] Returning data for ${id}. Status: ${data.status}, Has AI Report: ${!!data.aiReport}`);
        }

        return NextResponse.json({ id, ...data });
    } catch (error: any) {
        console.error('Error fetching order details:', error);
        return NextResponse.json({ error: 'Failed to fetch order details', details: error.message }, { status: 500 });
    }
}
