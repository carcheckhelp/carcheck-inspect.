import { GoogleGenerativeAI } from '@google/generative-ai';
import { inspectionCategories } from './inspectionPoints';

// Usar la clave proporcionada si no hay una variable de entorno
const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyD-_i_GI9EGgDqqqIr6Unbq4rxbJMFrLyo';

if (!apiKey) {
    console.error("CRITICAL: GEMINI_API_KEY is missing!");
}

const genAI = new GoogleGenerativeAI(apiKey);

export const runInspectionReport = async (inspectionData: any) => {
  if (!apiKey) {
      console.error("Cannot generate report: No Gemini API Key provided.");
      return "El análisis automático no está disponible porque falta la configuración de IA del sistema.";
  }

  // IMPORTANTE: gemini-pro original ha sido deprecado en algunas regiones/versiones.
  // Usamos gemini-1.5-flash que es el estándar actual rápido y gratuito (tier free).
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

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
                const statusText = status === 'fail' ? 'MALO (Requiere reparación urgente)' : 'ATENCIÓN (Requiere revisión futura)';
                inspectionDetailsText += `- ${point}: ${statusText}\n`;
            }
        }
        if (!hasIssues) {
            inspectionDetailsText += "- Todos los puntos verificados en esta categoría están en buen estado.\n";
        }
    }
  }

  const prompt = `
    Eres un experto mecánico automotriz senior y perito certificado de vehículos.
    
    Genera un **Informe de Inspección Vehicular Profesional** para un cliente comprador.
    
    **Datos del Vehículo:**
    - Vehículo: ${inspectionData.vehicle.make} ${inspectionData.vehicle.model} ${inspectionData.vehicle.year}
    - Cliente: ${inspectionData.clientName}

    ${inspectionDetailsText}

    **Estructura del Informe:**
    1.  **Veredicto General:** ¿Recomiendas la compra? (Sí/No/Con Reservas) y puntaje del 1 al 10.
    2.  **Análisis de Fallos:** Explica técnicamente los problemas encontrados ("MALO" o "ATENCIÓN") y sus riesgos.
    3.  **Recomendaciones:** Lista de reparaciones urgentes y estimación de costos (Bajo/Medio/Alto).
    
    Sé directo y profesional. Usa Markdown.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error: any) {
    console.error('Error generating inspection report:', error);
    
    const errorMessage = error.message || error.toString();
    
    if (errorMessage.includes('API key')) return 'Error de configuración: Clave de API inválida.';
    if (errorMessage.includes('404')) return `El modelo de IA no está disponible temporalmente (${errorMessage}).`;

    return `Error técnico al generar el análisis: ${errorMessage}. Por favor contacte a soporte.`;
  }
};
