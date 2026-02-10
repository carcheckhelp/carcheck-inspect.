import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';

// Register fonts (optional, using default Helvetica for now)
// Font.register({ family: 'Roboto', src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf' });

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 3,
    borderBottomColor: '#F59E0B', // Yellow-500
    paddingBottom: 15,
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827', // Gray-900
    letterSpacing: 1,
  },
  logoAccent: {
    color: '#F59E0B',
  },
  headerInfo: {
    textAlign: 'right',
  },
  title: {
    fontSize: 24,
    fontWeight: 'heavy', // Not standard in Helvetica but usually renders bold
    marginBottom: 20,
    textAlign: 'center',
    color: '#1F2937', // Gray-800
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  section: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#F9FAFB', // Gray-50
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2563EB', // Blue-600
    borderBottomWidth: 1,
    borderBottomColor: '#DBEAFE',
    paddingBottom: 5,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  label: {
    width: 140,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#6B7280', // Gray-500
  },
  value: {
    flex: 1,
    fontSize: 11,
    color: '#111827',
    fontWeight: 'medium',
  },
  aiReportContainer: {
    marginTop: 10,
    padding: 15,
    backgroundColor: '#F0FDF4', // Green-50
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981', // Green-500
  },
  aiReportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#047857', // Green-700
  },
  aiReportText: {
    fontSize: 10,
    lineHeight: 1.6,
    color: '#374151', // Gray-700
    textAlign: 'justify',
  },
  issuesContainer: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#FECACA', // Red-200
    backgroundColor: '#FEF2F2', // Red-50
    borderRadius: 8,
    padding: 10,
  },
  issuesTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#B91C1C', // Red-700
    marginBottom: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  gridItem: {
    width: '48%',
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: '2%',
  },
  pointName: {
    fontSize: 10,
    width: '70%',
    color: '#374151',
  },
  pointStatusFail: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#DC2626', // Red-600
    padding: '2 6',
    backgroundColor: '#FEE2E2',
    borderRadius: 4,
    textAlign: 'center',
  },
  pointStatusAttention: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#D97706', // Yellow-600
    padding: '2 6',
    backgroundColor: '#FEF3C7',
    borderRadius: 4,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#9CA3AF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 10,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    fontSize: 8,
    color: '#9CA3AF',
  },
  vehicleInfoBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  infoCard: {
    width: '48%',
    padding: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
  },
  infoCardLabel: {
    fontSize: 8,
    color: '#6B7280',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  infoCardValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
  }
});

interface InspectionPDFProps {
  order: any;
}

const InspectionPDF = ({ order }: InspectionPDFProps) => {
  const { id, vehicle, personalInfo, inspectionResults, categoryObservations, aiReport, createdAt, orderNumber } = order;
  const date = createdAt 
    ? (createdAt.seconds ? new Date(createdAt.seconds * 1000).toLocaleDateString() : new Date(createdAt).toLocaleDateString())
    : new Date().toLocaleDateString();

  const finalOrderId = orderNumber || id;
  
  // Calculate stats
  const totalPoints = inspectionResults ? Object.keys(inspectionResults).filter(k => inspectionResults[k] !== 'na').length : 0;
  const passedPoints = inspectionResults ? Object.values(inspectionResults).filter((v: any) => v === 'ok').length : 0;
  const failedPoints = inspectionResults ? Object.values(inspectionResults).filter((v: any) => v === 'fail').length : 0;
  const attentionPoints = inspectionResults ? Object.values(inspectionResults).filter((v: any) => v === 'attention').length : 0;
  
  const score = totalPoints > 0 ? Math.round((passedPoints / totalPoints) * 10) : 0; // Score out of 10

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>Car<Text style={styles.logoAccent}>Check</Text></Text>
          <View style={styles.headerInfo}>
             <Text style={{ fontSize: 10, color: '#6B7280', marginBottom: 2 }}>Orden #{finalOrderId}</Text>
             <Text style={{ fontSize: 10, color: '#6B7280', marginBottom: 2 }}>Fecha: {date}</Text>
             <Text style={{ fontSize: 10, color: '#10B981', fontWeight: 'bold' }}>ESTADO: COMPLETADO</Text>
          </View>
        </View>

        <Text style={styles.title}>Informe Técnico de Inspección</Text>

        {/* Vehicle & Client Info */}
        <View style={styles.vehicleInfoBlock}>
            <View style={styles.infoCard}>
                <Text style={styles.infoCardLabel}>Vehículo Inspeccionado</Text>
                <Text style={styles.infoCardValue}>
                    {typeof vehicle === 'string' ? vehicle : `${vehicle?.make || ''} ${vehicle?.model || ''} ${vehicle?.year || ''}`}
                </Text>
                {/* Optional: Add VIN or mileage if available */}
            </View>
            <View style={styles.infoCard}>
                <Text style={styles.infoCardLabel}>Cliente / Solicitante</Text>
                <Text style={styles.infoCardValue}>{personalInfo?.fullName || personalInfo?.name || 'Cliente'}</Text>
            </View>
        </View>

        {/* Executive Summary Stats */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
            <View style={{ ...styles.infoCard, width: '30%', backgroundColor: '#EFF6FF', alignItems: 'center' }}>
                <Text style={{...styles.infoCardLabel, color: '#1E40AF'}}>Puntaje General</Text>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1D4ED8' }}>{score}/10</Text>
            </View>
            <View style={{ ...styles.infoCard, width: '30%', backgroundColor: '#FEF2F2', alignItems: 'center' }}>
                <Text style={{...styles.infoCardLabel, color: '#991B1B'}}>Defectos Graves</Text>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#DC2626' }}>{failedPoints}</Text>
            </View>
            <View style={{ ...styles.infoCard, width: '30%', backgroundColor: '#FFFBEB', alignItems: 'center' }}>
                <Text style={{...styles.infoCardLabel, color: '#92400E'}}>Atención Requerida</Text>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#D97706' }}>{attentionPoints}</Text>
            </View>
        </View>

        {/* AI Analysis */}
        {aiReport && (
            <View style={styles.section}>
                 <View style={styles.aiReportContainer}>
                    <Text style={styles.aiReportTitle}>Análisis Profesional e Inteligente</Text>
                    {/* React-PDF doesn't support Markdown directly. Simple replacement. */}
                    <Text style={styles.aiReportText}>
                        {aiReport
                            .replace(/\*\*/g, '') // Remove bold markers
                            .replace(/\*/g, '• ') // Replace bullets
                            .replace(/#/g, '') // Remove headers
                        }
                    </Text>
                 </View>
            </View>
        )}

        {/* Detailed Issues List */}
        {(failedPoints > 0 || attentionPoints > 0) && (
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Hallazgos Críticos y Observaciones</Text>
                <View style={styles.grid}>
                    {inspectionResults && Object.entries(inspectionResults).map(([key, value]: [string, any]) => {
                        if (value === 'fail' || value === 'attention') {
                            return (
                                <View key={key} style={styles.gridItem}>
                                    <Text style={styles.pointName}>{key}</Text>
                                    <Text style={value === 'fail' ? styles.pointStatusFail : styles.pointStatusAttention}>
                                        {value === 'fail' ? 'MALO' : 'ATENCIÓN'}
                                    </Text>
                                </View>
                            );
                        }
                        return null;
                    })}
                </View>
                
                {/* Observations */}
                {categoryObservations && Object.values(categoryObservations).some((obs: any) => obs && obs.trim().length > 0) && (
                    <View style={{ marginTop: 15 }}>
                        <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 5, color: '#4B5563' }}>Notas Adicionales del Inspector:</Text>
                        {Object.entries(categoryObservations).map(([catId, obs]: [string, any]) => (
                             obs && obs.trim().length > 0 ? (
                                <Text key={catId} style={{ fontSize: 10, color: '#374151', marginBottom: 4, paddingLeft: 10 }}>
                                    • {obs}
                                </Text>
                             ) : null
                        ))}
                    </View>
                )}
            </View>
        )}

        {/* If everything is OK */}
        {inspectionResults && failedPoints === 0 && attentionPoints === 0 && (
             <View style={{ ...styles.section, backgroundColor: '#ECFDF5', borderColor: '#10B981' }}>
                 <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#047857', textAlign: 'center' }}>
                     ¡Vehículo en Excelente Estado!
                 </Text>
                 <Text style={{ fontSize: 10, color: '#065F46', textAlign: 'center', marginTop: 5 }}>
                     No se encontraron defectos mecánicos ni estéticos significativos durante la inspección.
                 </Text>
             </View>
        )}

        <View style={styles.footer}>
          <Text>Informe generado automáticamente por la plataforma CarCheck | carcheckdr.com</Text>
          <Text style={{ marginTop: 4 }}>Este documento es informativo y refleja el estado del vehículo al momento de la inspección.</Text>
        </View>
        
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
            `${pageNumber} / ${totalPages}`
        )} fixed />
      </Page>
    </Document>
  );
};

export default InspectionPDF;
