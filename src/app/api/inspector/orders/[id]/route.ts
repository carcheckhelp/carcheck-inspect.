import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const orderId = params.id;
        const doc = await db.collection('appointments').doc(orderId).get();

        if (!doc.exists) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json({ id: doc.id, ...doc.data() });
    } catch (error: any) {
        console.error('Error fetching order details:', error);
        return NextResponse.json({ error: 'Failed to fetch order details', details: error.message }, { status: 500 });
    }
}
