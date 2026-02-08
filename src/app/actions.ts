'use server';

import { z } from 'zod';
import { runInspectionReport } from '@/lib/gemini';
import { updateOrderWithReport } from '@/lib/firebase/firestore';

export async function generateInspectionReport(inspectionData: any) {
  try {
    // 1. Generate the report using Gemini AI
    const report = await runInspectionReport(inspectionData);

    // 2. Save the generated report and update the status in Firestore
    await updateOrderWithReport(inspectionData.orderId, report, "Completado");

    // 3. Return success and the report content to the client
    return {
      success: true,
      report: report,
    };
  } catch (error) {
    console.error("Error in generateInspectionReport Server Action:", error);
    return {
      success: false,
      error: "Ocurrió un error al generar o guardar el informe en la base de datos.",
    };
  }
}

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export async function loginInspector(prevState: any, formData: FormData) {
    const validatedFields = loginSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            error: "Email o contraseña inválidos.",
        };
    }

    const { email, password } = validatedFields.data;

    // IMPORTANT: These credentials are for demonstration only.
    // In a real application, use a secure authentication provider.
    if (email === "carcheckhelp1@outlook.com" && password === "Febrero2929") {
        return {
            success: true,
            message: "Inicio de sesión exitoso.",
        };
    }

    return {
        error: "Credenciales incorrectas.",
    };
}
