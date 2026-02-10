import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';
import { runInspectionReport } from '@/lib/gemini';

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

export async function POST(request: Request, { params }: { params: { id: string } }) {
    try {
        const orderId = params.id;
        const body = await request.json();
        const { inspectionResults, categoryObservations, status } = body;

        // 1. Get current order data to have context for Gemini
        const docRef = db.collection('appointments').doc(orderId);
        const docSnapshot = await docRef.get();
        
        if (!docSnapshot.exists) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        const currentData = docSnapshot.data();
        // Use vehicleInfo if available, otherwise fallback
        const vehicle = currentData?.vehicleInfo ? currentData.vehicleInfo : { make: 'Desconocido', model: 'Desconocido', year: 'Desconocido' };
        const clientName = currentData?.personalInfo?.fullName || 'Cliente';

        // 2. Prepare data for Gemini
        const inspectionDataForGemini = {
            vehicle,
            clientName,
            inspectionResults,
            categoryObservations
        };

        // 3. Generate Report using Gemini
        console.log(`Generating Gemini report for Order #${orderId}...`);
        let aiReport = null;
        try {
             aiReport = await runInspectionReport(inspectionDataForGemini);
        } catch (geminiError) {
            console.error('Gemini generation failed:', geminiError);
            // Don't fail the save if Gemini fails, just proceed without AI report
            aiReport = null;
        }

        // 4. Update Firestore with results AND the AI Report
        const updateData: any = {
            inspectionResults,
            categoryObservations,
            status: status || 'completed',
            updatedAt: new Date().toISOString(),
        };

        if (aiReport) {
            updateData.aiReport = aiReport;
        }

        await docRef.update(updateData);
        console.log(`Order #${orderId} updated successfully with inspection data.`);

        return NextResponse.json({ 
            message: 'Inspection saved successfully',
            aiReportGenerated: !!aiReport
        });

    } catch (error: any) {
        console.error('Error saving inspection:', error);
        return NextResponse.json({ error: 'Failed to save inspection', details: error.message }, { status: 500 });
    }
}
