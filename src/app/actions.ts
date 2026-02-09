'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { auth } from '@/lib/firebase/admin';
import { runInspectionReport } from '@/lib/gemini';
import { updateOrderWithReport } from '@/lib/firebase/firestore';

export type FormState = {
    error?: string;
    success?: boolean;
    message?: string;
};

// --- Report Generation Action ---
export async function generateInspectionReport(inspectionData: any) {
  try {
    const report = await runInspectionReport(inspectionData);
    await updateOrderWithReport(inspectionData.orderId, report, "Completado");
    return {
      success: true,
      report: report,
    };
  } catch (error) {
    console.error("Error in generateInspectionReport Server Action:", error);
    return {
      success: false,
      error: "Ocurrió un error al generar o guardar el informe.",
    };
  }
}

// --- Authentication Actions ---
const loginSchema = z.object({
    email: z.string().email("Por favor, introduce un email válido."),
    password: z.string().min(1, "La contraseña no puede estar vacía."),
});

export async function loginInspector(prevState: FormState, formData: FormData): Promise<FormState> {
    const validatedFields = loginSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            error: validatedFields.error.issues.map(e => e.message).join(', '),
        };
    }

    const { email, password } = validatedFields.data;

    try {
        const userRecord = await auth.getUserByEmail(email);
        
        // In a real app, verify password here.
        return {
            success: true,
            message: "Inicio de sesión exitoso.",
        };

    } catch (error: any) {
        let errorMessage = "Credenciales incorrectas.";
        if (error.code === 'auth/user-not-found') {
            errorMessage = "El usuario no existe.";
        } else if (error.code === 'auth/invalid-credential') {
             errorMessage = "La contraseña es incorrecta.";
        }
        console.error('Firebase Login Error:', error);
        return {
            error: errorMessage,
        };
    }
}

const passwordResetSchema = z.object({
    email: z.string().email("Por favor, introduce un email válido."),
});

export async function sendPasswordResetEmail(prevState: FormState, formData: FormData): Promise<FormState> {
    const validatedFields = passwordResetSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
             error: validatedFields.error.issues.map(e => e.message).join(', '),
        };
    }

    const { email } = validatedFields.data;

    try {
        await auth.getUserByEmail(email); // Check if user exists
        const link = await auth.generatePasswordResetLink(email);
        
        console.log("Password reset link:", link);

        return {
            success: true,
            message: "Se ha enviado un enlace para restablecer la contraseña a tu correo.",
        };
    } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
            return {
                success: true, 
                message: "Si tu correo está registrado, recibirás un enlace para restablecer la contraseña.",
            };
        }
        console.error('Password Reset Error:', error);
        return {
            error: "Ocurrió un error al intentar restablecer la contraseña.",
        };
    }
}
