'use server';

import { z } from 'zod';

// Define el esquema para un punto de inspección
const inspectionPointSchema = z.object({
  id: z.string(),
  label: z.string(),
  score: z.number().nullable(),
});

// Define el esquema para una sección de inspección
const inspectionSectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  points: z.array(inspectionPointSchema),
  observations: z.string(),
});

// Define el esquema para los datos completos de la inspección
const inspectionDataSchema = z.array(inspectionSectionSchema);

export async function generateInspectionReport(inspectionData: any) {
  const validatedFields = inspectionDataSchema.safeParse(inspectionData);

  if (!validatedFields.success) {
    return {
      error: "Datos de inspección inválidos.",
      details: validatedFields.error.flatten().fieldErrors,
    };
  }

  // 1. Formatear los datos para la entrada de la IA de Gemini
  let prompt = "Genera un reporte de inspección de vehículo basado en los siguientes datos. Proporciona un resumen general y una lista de recomendaciones futuras. El tono debe ser profesional y fácil de entender para un cliente no experto.\n\n";

  validatedFields.data.forEach(section => {
    prompt += `**Sección: ${section.title}**\n`;
    section.points.forEach(point => {
      prompt += `- ${point.label}: Puntuación ${point.score}/5\n`;
    });
    if (section.observations) {
      prompt += `  Observaciones: ${section.observations}\n`;
    }
    prompt += '\n';
  });

  console.log("--- PROMPT PARA GEMINI ---");
  console.log(prompt);
  console.log("--------------------------");

  // 2. Simular la llamada a la API de Gemini
  // En un caso real, aquí llamarías a tu modelo de Gemini:
  // const result = await gemini.generateContent(prompt);
  // const response = await result.response;
  // const text = response.text();

  // Respuesta simulada para fines de demostración
  const simulatedGeminiResponse = `
    **Resumen General del Vehículo:**
    El vehículo se encuentra en condiciones generales aceptables, con algunos puntos de atención que requieren consideración. El motor y la transmisión funcionan correctamente, sin ruidos o vibraciones significativas. El interior está bien conservado, aunque muestra signos de uso normal. La carrocería presenta algunos defectos cosméticos menores, como rayones superficiales, pero no se han detectado daños estructurales.

    **Recomendaciones Futuras:**
    1.  **Carrocería:** Se recomienda pulir los paneles con rayones superficiales para mejorar la estética.
    2.  **Neumáticos:** Vigilar el desgaste de los neumáticos delanteros y considerar su rotación en los próximos 5,000 km.
    3.  **Fluidos:** Aunque los niveles son correctos, se sugiere un cambio del líquido de frenos en el próximo servicio de mantenimiento para garantizar un rendimiento óptimo.
    4.  **Inspección Profesional:** Se aconseja realizar una alineación y balanceo en los próximos 6 meses.
  `;

  // 3. Simular la actualización en la base de datos (p. ej., Firestore)
  console.log("Actualizando el estado de la orden a 'Completada' en la base de datos.");

  // 4. Devolver la respuesta generada por la IA
  return {
    success: true,
    report: simulatedGeminiResponse,
  };
}
