import { GoogleGenerativeAI } from '@google/generative-ai';
import { inspectionCategories } from './inspectionPoints';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const runInspectionReport = async (inspectionData: any) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  // Format the detailed inspection results for the prompt
  let inspectionDetailsText = "";
  
  if (inspectionData.inspectionResults) {
    inspectionDetailsText += "**Detalle de Puntos Inspeccionados:**\n";
    // Group by category to make it easier for Gemini
    for (const category of inspectionCategories) {
        inspectionDetailsText += `\n**Categoría: ${category.title}**\n`;
        
        // Add observations for this category if any
        if (inspectionData.categoryObservations && inspectionData.categoryObservations[category.id]) {
             inspectionDetailsText += `*Observaciones del Inspector:* ${inspectionData.categoryObservations[category.id]}\n`;
        }

        const categoryPoints = category.points;
        let hasIssues = false;

        for (const point of categoryPoints) {
            const status = inspectionData.inspectionResults[point];
            if (status === 'attention' || status === 'fail') {
                hasIssues = true;
                const statusText = status === 'fail' ? 'MALO (Requiere reparación)' : 'ATENCIÓN (Requiere revisión)';
                inspectionDetailsText += `- ${point}: ${statusText}\n`;
            }
        }
        if (!hasIssues) {
            inspectionDetailsText += "- Todos los puntos verificados en esta categoría están en buen estado.\n";
        }
    }
  }

  const prompt = `
    Eres un experto mecánico automotriz senior y perito certificado de vehículos con años de experiencia evaluando autos usados para compradores potenciales.
    
    Tu tarea es generar un **Informe de Inspección Vehicular Premium** basado en los datos recolectados por un inspector en campo. El cliente final es una persona que probablemente no sepa mucho de mecánica, por lo que tu lenguaje debe ser claro, profesional, empático y directo.

    **Datos del Vehículo:**
    - Vehículo: ${inspectionData.vehicle.make} ${inspectionData.vehicle.model} ${inspectionData.vehicle.year}
    - Cliente: ${inspectionData.clientName}

    ${inspectionDetailsText}

    **Instrucciones Específicas para el Informe:**

    1.  **Resumen Ejecutivo (Vital):** Comienza con un veredicto claro. ¿Es una buena compra? Usa un sistema de semáforo (Verde: Compra segura, Amarillo: Precaución/Negociar, Rojo: Evitar/Riesgo alto). Resume los 2-3 hallazgos más críticos aquí.

    2.  **Análisis de Estado (Por Categorías):**
        *   Analiza las categorías (Motor, Transmisión, Carrocería, Interior, etc.) basándote en los puntos marcados como "MALO" o "ATENCIÓN".
        *   Si una categoría no tiene problemas, indícalo brevemente ("El motor funciona correctamente sin fugas ni ruidos aparentes").
        *   Para los problemas encontrados, explica **por qué es importante** y **qué podría pasar si no se arregla**. (Ej: "La fuga en el amortiguador delantero afecta la estabilidad en frenado y debe cambiarse pronto").

    3.  **Observaciones del Inspector:** Si hay notas específicas del inspector en los datos, intégralas en el análisis de la categoría correspondiente o crea una sección de "Notas de Campo" si son generales.

    4.  **Recomendaciones de Reparación y Mantenimiento:**
        *   Crea una lista priorizada de lo que se debe arreglar **Inmediatamente (Seguridad)**, **Pronto (Mecánica)** y **Eventualmente (Estética/Confort)**.
        *   Si es posible, estima la urgencia de cada reparación.

    5.  **Estimación de Costos (Aproximada):** Si detectas fallos graves (como fugas de aceite, fallos en transmisión, frenos en mal estado), menciona si la reparación suele ser costosa (Alta, Media, Baja) para dar contexto al comprador, sin dar precios exactos en moneda.

    6.  **Conclusión Final:** Un párrafo de cierre amigable recomendando si proceder con la compra, negociar el precio debido a los desperfectos, o buscar otro vehículo.

    **Formato:** Usa Markdown limpio con encabezados, viñetas y negritas para facilitar la lectura rápida. NO inventes fallos que no estén en los datos. Si todo está bien, felicita al comprador por encontrar un buen vehículo.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error('Error generating inspection report:', error);
    return 'Error al generar el análisis inteligente. Por favor, inténtelo de nuevo más tarde.';
  }
};
