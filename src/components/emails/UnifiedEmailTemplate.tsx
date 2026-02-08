import React from 'react';

interface EmailProps {
  orderNumber: string;
  personalInfo: { name: string; email: string; phone: string };
  vehicleInfo: { make: string; model: string; year: string; vin: string; appointmentDate: string; appointmentTime: string };
  sellerInfo: { sellerName: string; sellerPhone: string };
  selectedPackage: { name: string; price: number };
  forInspector: boolean; // Flag to show inspector-only details
}

const UnifiedEmailTemplate: React.FC<Readonly<EmailProps>> = ({ 
  orderNumber,
  personalInfo,
  vehicleInfo,
  sellerInfo,
  selectedPackage,
  forInspector
}) => {
  
  // Safely access nested properties with default fallbacks
  const safePersonalInfo = personalInfo || {};
  const safeVehicleInfo = vehicleInfo || {};
  const safeSellerInfo = sellerInfo || {};
  const safePackage = selectedPackage || {};

  const containerStyle = {
    fontFamily: 'sans-serif',
    padding: '20px',
    backgroundColor: '#f4f4f4',
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    border: '1px solid #dddddd',
    borderRadius: '8px',
    padding: '20px',
    margin: '0 auto',
    maxWidth: '600px',
  };

  const headerStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    borderBottom: '2px solid #eee',
    paddingBottom: '15px',
    marginBottom: '15px',
  };

  const sectionTitleStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#555',
    marginTop: '20px',
    marginBottom: '10px',
  };

  const paragraphStyle = {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#444',
    margin: '5px 0',
  };
  
  const strongStyle = { color: '#000' };

  const inspectorSectionStyle = {
    backgroundColor: '#fff9e6',
    border: '1px solid #ffecb3',
    borderRadius: '5px',
    padding: '15px',
    marginTop: '20px',
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={headerStyle}>{forInspector ? "🚨 Nueva Cita de Inspección" : "✅ Confirmación de Cita"}</h1>
        <p style={paragraphStyle}>
          Hola <strong style={strongStyle}>{safePersonalInfo.name}</strong>,
        </p>
        <p style={paragraphStyle}>
          {forInspector 
            ? `Se ha agendado una nueva cita con el número de orden:` 
            : `Gracias por agendar con CarCheck. Tu número de orden es:`}
        </p>
        <p style={{...paragraphStyle, fontSize: '20px', textAlign: 'center', margin: '20px 0'}}>
            <strong style={strongStyle}>#{orderNumber}</strong>
        </p>

        {/* --- Detalles del Paquete --- */}
        <h2 style={sectionTitleStyle}>Detalles del Servicio</h2>
        <p style={paragraphStyle}>Paquete: <strong style={strongStyle}>{safePackage.name}</strong></p>
        <p style={paragraphStyle}>Precio: <strong style={strongStyle}>${safePackage.price?.toLocaleString()}</strong></p>

        {/* --- Detalles de la Cita --- */}
        <h2 style={sectionTitleStyle}>Información de la Cita</h2>
        <p style={paragraphStyle}>Fecha: <strong style={strongStyle}>{safeVehicleInfo.appointmentDate}</strong></p>
        <p style={paragraphStyle}>Hora: <strong style={strongStyle}>{safeVehicleInfo.appointmentTime}</strong></p>

        {/* --- Detalles del Vehículo --- */}
        <h2 style={sectionTitleStyle}>Datos del Vehículo</h2>
        <p style={paragraphStyle}>Vehículo: <strong style={strongStyle}>{safeVehicleInfo.year} {safeVehicleInfo.make} {safeVehicleInfo.model}</strong></p>
        <p style={paragraphStyle}>VIN: <strong style={strongStyle}>{safeVehicleInfo.vin || 'No proporcionado'}</strong></p>

        {/* --- SECCIÓN SOLO PARA EL INSPECTOR --- */}
        {forInspector && (
          <div style={inspectorSectionStyle}>
            <h2 style={{...sectionTitleStyle, marginTop: 0}}>Información de Contacto (Clientes)</h2>
            <p style={paragraphStyle}>Nombre Cliente: <strong style={strongStyle}>{safePersonalInfo.name}</strong></p>
            <p style={paragraphStyle}>Email Cliente: <strong style={strongStyle}>{safePersonalInfo.email}</strong></p>
            <p style={paragraphStyle}>Teléfono Cliente: <strong style={strongStyle}>{safePersonalInfo.phone}</strong></p>
            <hr style={{border: 'none', borderTop: '1px solid #eee', margin: '15px 0'}} />
            <p style={paragraphStyle}>Nombre Vendedor: <strong style={strongStyle}>{safeSellerInfo.sellerName}</strong></p>
            <p style={paragraphStyle}>Teléfono Vendedor: <strong style={strongStyle}>{safeSellerInfo.sellerPhone}</strong></p>
          </div>
        )}

        {!forInspector && (
            <p style={{...paragraphStyle, marginTop: '25px'}}>
                Un inspector se pondrá en contacto contigo y con el vendedor para confirmar los detalles finales.
            </p>
        )}
      </div>
    </div>
  );
};

export default UnifiedEmailTemplate;
