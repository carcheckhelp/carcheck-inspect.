import React from 'react';

interface EmailProps {
  orderNumber: string;
  personalInfo: { name: string; email: string; phone: string };
  vehicleInfo: { make: string; model: string; year: string; vin: string; appointmentDate: string; appointmentTime: string };
  sellerInfo: { sellerName: string; sellerPhone: string; sellerLocation?: string }; // Added sellerLocation
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

  // Brand Colors
  const carColor = '#B8860B'; // Dark Goldenrod
  const checkColor = '#FFD700'; // Gold
  const bgColor = '#000000';
  const cardColor = '#1a1a1a';
  const textColor = '#e0e0e0';
  const headingColor = '#ffffff';
  const borderColor = '#333333';
  const highlightBg = '#2a2a2a';

  return (
    <div style={{ backgroundColor: bgColor, padding: '40px 0', fontFamily: 'Arial, sans-serif', color: textColor }}>
      <table align="center" border={0} cellPadding="0" cellSpacing="0" width="100%" style={{ maxWidth: '600px', backgroundColor: cardColor, borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(255, 215, 0, 0.1)', border: `1px solid ${borderColor}` }}>
        
        {/* Header / Logo Section */}
        <tr>
          <td style={{ backgroundColor: '#000000', padding: '25px', textAlign: 'center', borderBottom: `2px solid ${carColor}` }}>
            <h1 style={{ margin: 0, fontSize: '32px', letterSpacing: '1px' }}>
              <span style={{ color: carColor }}>Car</span>
              <span style={{ color: checkColor }}>Check</span>
            </h1>
          </td>
        </tr>

        {/* Main Content */}
        <tr>
          <td style={{ padding: '40px 30px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: headingColor, marginTop: 0, marginBottom: '20px', textAlign: 'center' }}>
              {forInspector ? "🚨 Nueva Cita de Inspección" : "✅ Confirmación de Cita"}
            </h1>

            <p style={{ fontSize: '16px', lineHeight: '1.6', color: textColor, margin: '0 0 15px' }}>
              Hola <strong style={{ color: checkColor }}>{safePersonalInfo.name}</strong>,
            </p>

            <p style={{ fontSize: '16px', lineHeight: '1.6', color: textColor, margin: '0 0 20px' }}>
              {forInspector 
                ? `Se ha agendado una nueva cita con el número de orden:` 
                : `Gracias por confiar en CarCheck. Hemos recibido tu solicitud correctamente. Tu número de orden es:`}
            </p>

            <div style={{ backgroundColor: highlightBg, border: `1px dashed ${carColor}`, padding: '15px', textAlign: 'center', borderRadius: '5px', marginBottom: '30px' }}>
               <span style={{ fontSize: '24px', fontWeight: 'bold', color: checkColor, letterSpacing: '2px' }}>#{orderNumber}</span>
            </div>

            {/* Service Details */}
            <h3 style={{ fontSize: '18px', color: headingColor, borderBottom: `1px solid ${borderColor}`, paddingBottom: '10px', marginTop: '30px', marginBottom: '15px' }}>
              Detalles del Servicio
            </h3>
            <p style={{ margin: '8px 0', color: textColor }}>
                <strong style={{ color: '#aaa' }}>Paquete:</strong> <span style={{ color: '#fff' }}>{safePackage.name}</span>
            </p>
            <p style={{ margin: '8px 0', color: textColor }}>
                <strong style={{ color: '#aaa' }}>Precio:</strong> <span style={{ color: checkColor, fontWeight: 'bold' }}>${safePackage.price?.toLocaleString()}</span>
            </p>

            {/* Appointment Details */}
            <h3 style={{ fontSize: '18px', color: headingColor, borderBottom: `1px solid ${borderColor}`, paddingBottom: '10px', marginTop: '30px', marginBottom: '15px' }}>
              Información de la Cita
            </h3>
            <p style={{ margin: '8px 0', color: textColor }}>
                <strong style={{ color: '#aaa' }}>Fecha:</strong> {safeVehicleInfo.appointmentDate}
            </p>
            <p style={{ margin: '8px 0', color: textColor }}>
                <strong style={{ color: '#aaa' }}>Hora:</strong> {safeVehicleInfo.appointmentTime}
            </p>

            {/* Vehicle Details */}
            <h3 style={{ fontSize: '18px', color: headingColor, borderBottom: `1px solid ${borderColor}`, paddingBottom: '10px', marginTop: '30px', marginBottom: '15px' }}>
              Datos del Vehículo
            </h3>
            <p style={{ margin: '8px 0', color: textColor }}>
                <strong style={{ color: '#aaa' }}>Vehículo:</strong> {safeVehicleInfo.year} {safeVehicleInfo.make} {safeVehicleInfo.model}
            </p>
            <p style={{ margin: '8px 0', color: textColor }}>
                <strong style={{ color: '#aaa' }}>VIN:</strong> {safeVehicleInfo.vin || 'No proporcionado'}
            </p>
            {/* Added location to general section as well, useful for customer record */}
            <p style={{ margin: '8px 0', color: textColor }}>
                <strong style={{ color: '#aaa' }}>Ubicación:</strong> 
                {safeSellerInfo.sellerLocation ? (
                    <a href={safeSellerInfo.sellerLocation} target="_blank" rel="noopener noreferrer" style={{color: checkColor, marginLeft: '5px', textDecoration: 'none'}}>Ver en Google Maps</a>
                ) : (
                    <span style={{color: '#fff', marginLeft: '5px'}}>No especificada</span>
                )}
            </p>

            {/* Inspector Only Section */}
            {forInspector && (
              <div style={{ backgroundColor: '#2d2d20', border: `1px solid ${carColor}`, padding: '20px', borderRadius: '5px', marginTop: '30px' }}>
                <h3 style={{ marginTop: 0, color: checkColor, fontSize: '18px' }}>📞 Contacto (Privado)</h3>
                
                <p style={{ margin: '10px 0 5px', fontWeight: 'bold', color: '#ccc' }}>Cliente:</p>
                <ul style={{ margin: '0 0 15px', paddingLeft: '20px', color: textColor }}>
                    <li>Email: <a href={`mailto:${safePersonalInfo.email}`} style={{ color: checkColor, textDecoration: 'none' }}>{safePersonalInfo.email}</a></li>
                    <li>Tel: <a href={`tel:${safePersonalInfo.phone}`} style={{ color: checkColor, textDecoration: 'none' }}>{safePersonalInfo.phone}</a></li>
                </ul>

                <p style={{ margin: '10px 0 5px', fontWeight: 'bold', color: '#ccc' }}>Vendedor:</p>
                <ul style={{ margin: '0', paddingLeft: '20px', color: textColor }}>
                    <li>Nombre: {safeSellerInfo.sellerName}</li>
                    <li>Tel: <a href={`tel:${safeSellerInfo.sellerPhone}`} style={{ color: checkColor, textDecoration: 'none' }}>{safeSellerInfo.sellerPhone}</a></li>
                    {safeSellerInfo.sellerLocation && (
                        <li style={{ marginTop: '5px' }}>
                            <strong>Ubicación:</strong> <a href={safeSellerInfo.sellerLocation} target="_blank" rel="noopener noreferrer" style={{ color: checkColor }}>Abrir Mapa</a>
                        </li>
                    )}
                </ul>
              </div>
            )}

            {!forInspector && (
              <div style={{ marginTop: '30px', borderTop: `1px solid ${borderColor}`, paddingTop: '20px', textAlign: 'center' }}>
                 <p style={{ fontSize: '16px', color: '#ffffff', marginBottom: '10px' }}>
                    Un inspector se comunicará con usted en el transcurso de <strong>2 horas</strong>.
                 </p>
                 <a href="https://carcheckdr.com" target="_blank" rel="noopener noreferrer" style={{ color: checkColor, textDecoration: 'none', fontSize: '16px', fontWeight: 'bold' }}>
                    carcheckdr.com
                 </a>
              </div>
            )}

            {!forInspector && (
               <p style={{ fontSize: '14px', color: '#666666', marginTop: '20px', textAlign: 'center' }}>
                 Si tienes alguna pregunta, por favor responde a este correo o contáctanos a soporte.
               </p>
            )}
          </td>
        </tr>
      </table>
    </div>
  );
};

export default UnifiedEmailTemplate;
