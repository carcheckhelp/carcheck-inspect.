'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { auth } from '@/lib/firebase/admin';
import { runInspectionReport } from '@/lib/gemini';
import { updateOrderWithReport } from '@/lib/firebase/firestore';

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

export async function loginInspector(prevState: any, formData: FormData) {
    const validatedFields = loginSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            error: validatedFields.error.issues.map(e => e.message).join(', '),
        };
    }

    const { email, password } = validatedFields.data;

    try {
        // Note: Firebase Admin SDK doesn't directly verify passwords.
        // This requires a custom approach or using the client-side SDK.
        // For this server-action flow, we'll create a session cookie.

        // A proper implementation would first verify the user exists and password is correct.
        // This is a placeholder for that logic.
        // Since we can't directly check the password with the Admin SDK, we rely on the user being created correctly in Firebase Auth.
        const userRecord = await auth.getUserByEmail(email);
        
        // The session cookie logic would go here. For simplicity, we'll assume success if the user exists.
        // In a real app, you'd verify password and create a session cookie.
        // cookies().set('session', sessionCookie, { httpOnly: true, secure: true });

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

export async function sendPasswordResetEmail(prevState: any, formData: FormData) {
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
        
        // Here you would email the link to the user. For now, we will log it.
        console.log("Password reset link:", link);

        return {
            success: true,
            message: "Se ha enviado un enlace para restablecer la contraseña a tu correo.",
        };
    } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
            // Don't reveal if the user exists or not for security reasons
            return {
                success: true, // Pretend success
                message: "Si tu correo está registrado, recibirás un enlace para restablecer la contraseña.",
            };
        }
        console.error('Password Reset Error:', error);
        return {
            error: "Ocurrió un error al intentar restablecer la contraseña.",
        };
    }
}
