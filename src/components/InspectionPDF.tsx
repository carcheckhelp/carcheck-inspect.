import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

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
    borderBottomWidth: 2,
    borderBottomColor: '#F59E0B', // Yellow-500
    paddingBottom: 10,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  logoAccent: {
    color: '#F59E0B',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#111827', // Gray-900
  },
  section: {
    margin: 10,
    padding: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2563EB', // Blue-600
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 4,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: 120,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#4B5563', // Gray-600
  },
  value: {
    flex: 1,
    fontSize: 10,
    color: '#111827',
  },
  aiReportContainer: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#F3F4F6', // Gray-100
    borderRadius: 5,
  },
  aiReportTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#059669', // Emerald-600
  },
  aiReportText: {
    fontSize: 10,
    lineHeight: 1.5,
    color: '#374151', // Gray-700
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
  statusBadge: {
    padding: '4 8',
    borderRadius: 4,
    fontSize: 10,
    color: 'white',
    backgroundColor: '#10B981', // Green
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  gridItem: {
    width: '50%',
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointName: {
    fontSize: 9,
    width: '70%',
  },
  pointStatus: {
    fontSize: 9,
    fontWeight: 'bold',
  }
});

interface InspectionPDFProps {
  order: any;
}

const InspectionPDF = ({ order }: InspectionPDFProps) => {
  const { id, vehicle, personalInfo, inspectionResults, categoryObservations, aiReport, createdAt } = order;
  const date = createdAt ? new Date(createdAt.seconds * 1000).toLocaleDateString() : new Date().toLocaleDateString();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>Car<Text style={styles.logoAccent}>Check</Text></Text>
          <View>
             <Text style={{ fontSize: 10, color: '#6B7280' }}>Orden #{id}</Text>
             <Text style={{ fontSize: 10, color: '#6B7280' }}>Fecha: {date}</Text>
          </View>
        </View>

        <Text style={styles.title}>Informe de Inspección Vehicular</Text>

        {/* Vehicle Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalles del Vehículo</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Vehículo:</Text>
            <Text style={styles.value}>{vehicle?.make} {vehicle?.model} {vehicle?.year}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Cliente:</Text>
            <Text style={styles.value}>{personalInfo?.fullName}</Text>
          </View>
          {/* Add more vehicle details if available */}
        </View>

        {/* AI Analysis */}
        {aiReport && (
            <View style={styles.section}>
                 <View style={styles.aiReportContainer}>
                    <Text style={styles.aiReportTitle}>Análisis Profesional (IA)</Text>
                    {/* React-PDF doesn't support Markdown directly, so we just render the text. 
                        Ideally, we would parse markdown to styled Text components. 
                        For now, we replace some common markdown syntax for cleaner output. */}
                    <Text style={styles.aiReportText}>
                        {aiReport.replace(/\*\*/g, '').replace(/\*/g, '• ')}
                    </Text>
                 </View>
            </View>
        )}

        {/* Inspection Summary (Simplified for PDF) */}
        <View style={styles.section}>
             <Text style={styles.sectionTitle}>Resumen de Inspección</Text>
             <Text style={{fontSize: 10, marginBottom: 5, color: '#6B7280'}}>
                 Detalles completos disponibles en la plataforma web.
             </Text>
             
             {/* We could iterate through categories here if needed, but keeping it simple for one page if possible */}
             <View style={styles.grid}>
                {inspectionResults && Object.entries(inspectionResults).map(([key, value]: [string, any]) => {
                    if (value === 'attention' || value === 'fail') {
                        return (
                             <View key={key} style={styles.gridItem}>
                                <Text style={styles.pointName}>{key}</Text>
                                <Text style={{ 
                                    ...styles.pointStatus, 
                                    color: value === 'fail' ? '#EF4444' : '#F59E0B' 
                                }}>
                                    {value === 'fail' ? 'MALO' : 'ATENCIÓN'}
                                </Text>
                             </View>
                        );
                    }
                    return null;
                })}
             </View>
             
             {/* If everything is OK */}
             {inspectionResults && !Object.values(inspectionResults).some(v => v === 'attention' || v === 'fail') && (
                 <Text style={{fontSize: 10, color: '#10B981'}}>
                     No se encontraron defectos mayores durante la inspección.
                 </Text>
             )}
        </View>

        <View style={styles.footer}>
          <Text>Este informe es generado automáticamente por CarCheck. Visite carcheckdr.com para más detalles.</Text>
        </View>
      </Page>
    </Document>
  );
};

export default InspectionPDF;
