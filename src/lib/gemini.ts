import { GoogleGenerativeAI } from '@google/generative-ai';
import { inspectionCategories } from './inspectionPoints';

// Usar la clave proporcionada si no hay una variable de entorno
const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyD-_i_GI9EGgDqqqIr6Unbq4rxbJMFrLyo';

if (!apiKey) {
    console.error("CRITICAL: GEMINI_API_KEY is missing!");
}

const genAI = new GoogleGenerativeAI(apiKey);

// Función de respaldo (Fallback) por si Gemini falla o no hay API Key
const generateFallbackReport = (inspectionData: any) => {
    let report = `## Informe de Inspección (Modo Respaldo)\n\n`;
    report += `**Vehículo:** ${inspectionData.vehicle.make} ${inspectionData.vehicle.model} ${inspectionData.vehicle.year}\n\n`;
    
    let criticalIssues = [];
    let attentionIssues = [];
    
    if (inspectionData.inspectionResults) {
        for (const [point, status] of Object.entries(inspectionData.inspectionResults)) {
            if (status === 'fail') criticalIssues.push(point);
            if (status === 'attention') attentionIssues.push(point);
        }
    }

    report += `### Resumen del Estado\n`;
    if (criticalIssues.length > 0) {
        report += `El vehículo presenta **${criticalIssues.length} problemas críticos** que requieren reparación inmediata. No se recomienda la compra sin antes presupuestar estas reparaciones.\n`;
    } else if (attentionIssues.length > 0) {
        report += `El vehículo se encuentra en condiciones generales aceptables, pero tiene **${attentionIssues.length} puntos de atención** que requerirán mantenimiento a mediano plazo.\n`;
    } else {
        report += `El vehículo se encuentra en **excelentes condiciones**. No se detectaron fallos visibles durante la inspección.\n`;
    }

    report += `\n### Análisis de Fallos Detectados\n`;
    if (criticalIssues.length > 0) {
        report += `**Requieren Atención Inmediata (Riesgo de Seguridad/Mecánico):**\n`;
        criticalIssues.forEach(issue => report += `- ${issue}\n`);
    }
    if (attentionIssues.length > 0) {
        report += `\n**Puntos a Observar (Desgaste Normal/Mantenimiento Futuro):**\n`;
        attentionIssues.forEach(issue => report += `- ${issue}\n`);
    }
    if (criticalIssues.length === 0 && attentionIssues.length === 0) {
        report += `No se encontraron fallos significativos.\n`;
    }

    report += `\n### Recomendaciones Generales\n`;
    report += `1. **Mantenimiento Preventivo:** Realizar cambio de aceite y filtros si no hay historial reciente.\n`;
    report += `2. **Documentación:** Verificar que no existan multas pendientes y realizar el cambio de propietario.\n`;
    if (attentionIssues.length > 0) {
        report += `3. **Seguimiento:** Programar una revisión de los puntos de "Atención" en los próximos 3-6 meses.\n`;
    }

    return report;
};

export const runInspectionReport = async (inspectionData: any) => {
  // Intentar usar Gemini primero
  try {
      if (!apiKey) throw new Error("No API Key");

      // Actualizado a gemini-1.5-pro para mejor razonamiento (versión de pago/premium)
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

      // Formatear resultados detallados para el prompt (INCLUYENDO TODO)
      let inspectionDetailsText = "**Detalle Completo de la Inspección:**\n";
      
      if (inspectionData.inspectionResults) {
        for (const category of inspectionCategories) {
            inspectionDetailsText += `\n**Categoría: ${category.title}**\n`;
            
            // Observaciones
            if (inspectionData.categoryObservations && inspectionData.categoryObservations[category.id]) {
                 inspectionDetailsText += `*Observaciones del Inspector:* ${inspectionData.categoryObservations[category.id]}\n`;
            }

            const categoryPoints = category.points;
            let categoryHasIssues = false;

            for (const point of categoryPoints) {
                const status = inspectionData.inspectionResults[point] || 'na'; // Default to na if missing
                let statusText = 'No inspeccionado';
                
                if (status === 'ok') statusText = 'BUENO (Funciona correctamente)';
                if (status === 'attention') {
                    statusText = 'ATENCIÓN (Desgaste visible o requiere revisión futura)';
                    categoryHasIssues = true;
                }
                if (status === 'fail') {
                    statusText = 'MALO (Falla crítica, requiere reparación)';
                    categoryHasIssues = true;
                }
                
                // Incluimos TODOS los puntos para que la IA vea el panorama completo
                inspectionDetailsText += `- ${point}: ${statusText}\n`;
            }
        }
      }

      const prompt = `
        Actúa como un Perito Mecánico Senior y Asesor de Compra Automotriz.
        
        Tu tarea es generar un informe detallado para el cliente interesado en este vehículo.
        
        **Vehículo:** ${inspectionData.vehicle.make} ${inspectionData.vehicle.model} ${inspectionData.vehicle.year}
        **Cliente:** ${inspectionData.clientName}

        ${inspectionDetailsText}

        **Instrucciones para el Informe:**
        1.  **Resumen Ejecutivo:** Comienza con una valoración clara (Puntaje 1-10) y si recomiendas la compra.
        2.  **Estado General:** Resume lo que ESTÁ BIEN. Es importante que el cliente sepa qué sistemas funcionan correctamente para darle tranquilidad.
        3.  **Análisis de Problemas (Si existen):** Explica los puntos marcados como MALO o ATENCIÓN. ¿Qué implican? ¿Son caros de arreglar?
        4.  **Recomendaciones de Mantenimiento (IA Proactiva):** Incluso si el auto está perfecto, da 3-4 recomendaciones para mantenerlo así (ej. tipo de aceite, cuidado de pintura, revisión de frenos por kilometraje). Si hay fallos, prioriza sus reparaciones.
        
        Usa un tono profesional, objetivo y útil. Formato Markdown limpio.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();

  } catch (error: any) {
    console.error('Error generating Gemini report:', error);
    console.log('Falling back to rule-based report generator...');
    
    // Fallback a lógica preprogramada si falla la IA
    return generateFallbackReport(inspectionData);
  }
};
