import { GoogleGenerativeAI } from '@google/generative-ai';

// IMPORTANT: You must get your own API key from Google AI Studio and add it as an environment variable.
// Do not commit your API key to your repository.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const runInspectionReport = async (inspectionData: any) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `
    Eres un experto mecánico y perito de vehículos. Tu tarea es generar un informe de inspección detallado, profesional y fácil de entender para el propietario de un vehículo basado en los datos proporcionados.

    **Datos de la Inspección:**
    - **Vehículo:** ${inspectionData.vehicle.make} ${inspectionData.vehicle.model} (${inspectionData.vehicle.year})
    - **VIN:** ${inspectionData.vehicle.vin}
    - **Inspector:** ${inspectionData.inspector.name}

    **Puntuaciones (1=Muy Mal, 5=Excelente):**
    - Motor: ${inspectionData.scores.engine}/5
    - Transmisión: ${inspectionData.scores.transmission}/5
    - Frenos: ${inspectionData.scores.brakes}/5
    - Suspensión: ${inspectionData.scores.suspension}/5
    - Llantas: ${inspectionData.scores.tires}/5
    - Carrocería: ${inspectionData.scores.body}/5
    - Interior: ${inspectionData.scores.interior}/5

    **Observaciones del Inspector:**
    ${inspectionData.notes}

    **Instrucciones para el Informe:**
    1.  **Título Claro:** Comienza con un título como "Informe de Inspección para [Marca y Modelo del Vehículo]".
    2.  **Resumen Ejecutivo (Sección "En Resumen"):** Proporciona un párrafo corto y conciso que resuma el estado general del vehículo. Indica si el vehículo está en condiciones excelentes, buenas, regulares o malas, y si recomiendas la compra o si se necesita precaución.
    3.  **Análisis por Categoría:**
        *   Crea una sección para cada categoría evaluada (Motor, Transmisión, etc.).
        *   Traduce la puntuación numérica a una evaluación cualitativa (Ej: 5/5 -> Excelente, 3/5 -> Regular, 1/5 -> Requiere Atención Inmediata).
        *   Explica en términos sencillos qué significa esa puntuación para el propietario. Por ejemplo, si los frenos tienen un 2/5, explica qué problemas podría causar (distancia de frenado larga, ruidos, etc.).
    4.  **Observaciones del Inspector:** Incluye las notas del inspector en una sección claramente marcada, ya que son la visión directa del profesional que vio el coche.
    5.  **Recomendaciones Clave:** Basado en las puntuaciones y las observaciones, crea una lista de recomendaciones claras y accionables. Prioriza los problemas de seguridad (frenos, llantas, suspensión) y luego los problemas mecánicos importantes.
    6.  **Tono Profesional pero Accesible:** Usa un lenguaje que un no experto pueda entender, evitando la jerga técnica excesiva. El objetivo es empoderar al propietario con información, no confundirlo.

    Genera el informe en formato Markdown.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error('Error generating inspection report:', error);
    return 'Error al generar el informe. Por favor, inténtelo de nuevo.';
  }
};
