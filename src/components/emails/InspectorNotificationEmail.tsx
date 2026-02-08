
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from '@react-email/components';
import * as React from 'react';

interface InspectorNotificationEmailProps {
  orderNumber?: string;
  packageName?: string;
  price?: number;
  clientName?: string;
  clientPhone?: string;
  clientEmail?: string;
  sellerName?: string;
  sellerPhone?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: number;
  vehicleVin?: string;
  appointmentDate?: string;
  appointmentTime?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const InspectorNotificationEmail = ({
  orderNumber = 'CC-K5J2-9G8B',
  packageName = 'Pro',
  price = 149.99,
  clientName = 'Juan Pérez',
  clientPhone = '829-555-0101',
  clientEmail = 'juan.perez@example.com',
  sellerName = 'Ana Gómez',
  sellerPhone = '809-555-0202',
  vehicleMake = 'Ford',
  vehicleModel = 'Mustang',
  vehicleYear = 2023,
  vehicleVin = '1ZVBP8AM4F5123456',
  appointmentDate = '2023-10-28',
  appointmentTime = '02:00 PM',
}: InspectorNotificationEmailProps) => (
  <Html>
    <Head />
    <Preview>Nueva Cita de Inspección - Orden #{orderNumber}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
            <Heading style={h1}>
                <span style={{ color: '#B8860B' }}>Car</span>
                <span style={{ color: '#FFD700' }}>Check</span>
            </Heading>
        </Section>
        <Heading style={heading}>
          Nueva Cita Agendada
        </Heading>
        <Text style={text}>
          Se ha agendado una nueva cita de inspección. Aquí están los detalles:
        </Text>

        {/* Client Info */}
        <Section style={detailsContainer}>
            <Heading as="h2" style={sectionHeading}>Información del Cliente</Heading>
            <Row style={row}><Column style={label}>Nombre:</Column><Column style={value}>{clientName}</Column></Row>
            <Row style={row}><Column style={label}>Teléfono:</Column><Column style={value}>{clientPhone}</Column></Row>
            <Row style={row}><Column style={{...label, ...lastLabel}}>Email:</Column><Column style={{...value, ...lastValue}}>{clientEmail}</Column></Row>
        </Section>

        {/* Seller Info */}
        <Section style={detailsContainer}>
            <Heading as="h2" style={sectionHeading}>Información del Vendedor</Heading>
            <Row style={row}><Column style={label}>Nombre:</Column><Column style={value}>{sellerName}</Column></Row>
            <Row style={row}><Column style={{...label, ...lastLabel}}>Teléfono:</Column><Column style={{...value, ...lastValue}}>{sellerPhone}</Column></Row>
        </Section>

        {/* Vehicle Info */}
        <Section style={detailsContainer}>
            <Heading as="h2" style={sectionHeading}>Información del Vehículo</Heading>
            <Row style={row}><Column style={label}>Vehículo:</Column><Column style={value}>{vehicleYear} {vehicleMake} {vehicleModel}</Column></Row>
            <Row style={row}><Column style={{...label, ...lastLabel}}>VIN/Chasis:</Column><Column style={{...value, ...lastValue}}>{vehicleVin}</Column></Row>
        </Section>

        {/* Appointment Info */}
        <Section style={detailsContainer}>
            <Heading as="h2" style={sectionHeading}>Detalles de la Cita</Heading>
            <Row style={row}><Column style={label}>Fecha:</Column><Column style={value}>{appointmentDate}</Column></Row>
            <Row style={row}><Column style={label}>Hora:</Column><Column style={value}>{appointmentTime}</Column></Row>
            <Row style={row}><Column style={label}>Paquete:</Column><Column style={value}>{packageName}</Column></Row>
            <Row style={row}><Column style={{...label, ...lastLabel}}>Precio:</Column><Column style={{...value, ...lastValue}}>${price ? price.toFixed(2) : 'N/A'}</Column></Row>
        </Section>

        <Text style={text}>
          <strong>Acción Requerida:</strong> Por favor, ponte en contacto con el cliente y el vendedor en las próximas 2 horas para coordinar el lugar exacto de la inspección.
        </Text>
        <Section style={footer}>
          <Text style={footerText}>
            Este es un correo de notificación automático.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default InspectorNotificationEmail;

// Styles
const main = {
  backgroundColor: '#0a0a0a',
  color: '#ffffff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '580px',
};

const logoContainer = {
  textAlign: 'center' as const,
  padding: '20px 0',
};

const h1 = {
  fontFamily: '"Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
  fontSize: '42px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '0',
  padding: '0',
  color: '#FFD700',
};

const heading = {
  fontSize: '28px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  color: '#FFD700',
  marginBottom: '24px',
};

const text = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#cccccc',
  textAlign: 'center' as const,
  marginBottom: '16px',
};

const detailsContainer = {
  backgroundColor: '#1e1e1e',
  borderRadius: '12px',
  padding: '20px',
  margin: '16px 0',
  border: '1px solid #333333',
};

const sectionHeading = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#FFD700',
  margin: '0 0 15px 0',
  textAlign: 'left' as const,
};

const row = {
  width: '100%',
  display: 'flex',
  paddingBottom: '10px',
  marginBottom: '10px',
  borderBottom: '1px solid #333333',
};

const label = {
  fontSize: '16px',
  color: '#aaaaaa',
  fontWeight: 'bold',
  width: '150px',
};

const value = {
  fontSize: '16px',
  color: '#ffffff',
  fontWeight: '500',
  textAlign: 'right' as const,
  flex: 1,
};

const lastLabel = {
  borderBottom: 'none',
};
const lastValue = {
  borderBottom: 'none',
};

const footer = {
  marginTop: '32px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#666666',
  fontSize: '12px',
};
