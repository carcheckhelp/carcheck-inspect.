
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

interface CustomerConfirmationEmailProps {
  orderNumber?: string;
  packageName?: string;
  price?: number;
  clientName?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: number;
  appointmentDate?: string;
  appointmentTime?: string;
}

const baseUrl = 'https://carcheckdr.com';

export const CustomerConfirmationEmail = ({
  orderNumber = 'CC-K5J2-9G8B',
  packageName = 'Pro',
  price = 149.99,
  clientName = 'Juan Pérez',
  vehicleMake = 'Ford',
  vehicleModel = 'Mustang',
  vehicleYear = 2023,
  appointmentDate = '2023-10-28',
  appointmentTime = '02:00 PM',
}: CustomerConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Confirmación de tu cita en CarCheck - Orden #{orderNumber}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
            <Heading style={h1}>
                <span style={{ color: '#B8860B' }}>Car</span>
                <span style={{ color: '#FFD700' }}>Check</span>
            </Heading>
        </Section>
        <Heading style={heading}>
          ¡Gracias por agendar con nosotros, {clientName}!
        </Heading>
        <Text style={text}>
          Tu cita para la inspección de vehículo ha sido confirmada. Estamos emocionados de ayudarte a tomar una decisión informada.
        </Text>
        <Section style={summaryContainer}>
          <Heading as="h2" style={summaryHeading}>
            Resumen de tu Orden
          </Heading>
          <Row style={row}>
            <Column style={label}>Orden #:</Column>
            <Column style={value}>{orderNumber}</Column>
          </Row>
          <Row style={row}>
            <Column style={label}>Paquete:</Column>
            <Column style={value}>{packageName}</Column>
          </Row>
           <Row style={row}>
            <Column style={label}>Vehículo:</Column>
            <Column style={value}>{vehicleYear} {vehicleMake} {vehicleModel}</Column>
          </Row>
          <Row style={row}>
            <Column style={{ ...label, ...lastLabel }}>Total:</Column>
            <Column style={{ ...value, ...lastValue }}>${price.toLocaleString()}</Column>
          </Row>
        </Section>
        
        <Section style={appointmentContainer}>
           <Heading as="h2" style={summaryHeading}>
            Detalles de la Cita
          </Heading>
           <Row style={row}>
            <Column style={label}>Fecha:</Column>
            <Column style={value}>{appointmentDate}</Column>
          </Row>
           <Row style={row}>
            <Column style={{ ...label, ...lastLabel }}>Hora:</Column>
            <Column style={{ ...value, ...lastValue }}>{appointmentTime}</Column>
          </Row>
        </Section>
        
        <Text style={text}>
          <strong>Próximos Pasos:</strong> Nos pondremos en contacto contigo y con el vendedor en las próximas 2 horas para coordinar el lugar exacto de la inspección.
        </Text>
        <Text style={text}>
          Si tienes alguna pregunta, no dudes en contactarnos respondiendo a este correo o visitando nuestro <Link href={baseUrl}>sitio web</Link>.
        </Text>
        <Section style={footer}>
          <Text style={footerText}>
            © {new Date().getFullYear()} CarCheck. Todos los derechos reservados.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default CustomerConfirmationEmail;

const main = {
  backgroundColor: '#000000',
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
  fontSize: '50px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '0',
  padding: '0',
};

const heading = {
  fontSize: '28px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  color: '#FFD700',
};

const text = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#cccccc',
};

const summaryContainer = {
  backgroundColor: '#1a1a1a',
  borderRadius: '12px',
  padding: '24px',
  margin: '24px 0',
  border: '1px solid #333333',
};

const appointmentContainer = {
  ...summaryContainer,
  backgroundColor: '#111111'
}

const summaryHeading = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#FFD700',
  margin: '0 0 15px 0',
  textAlign: 'center' as const,
};

const row = {
  width: '100%',
  display: 'flex',
  paddingBottom: '8px',
};

const label = {
  fontSize: '16px',
  color: '#999999',
  fontWeight: 'bold',
  width: '120px',
};

const lastLabel = {
  borderBottom: 'none',
}

const value = {
  fontSize: '16px',
  color: '#ffffff',
  fontWeight: '500',
  textAlign: 'right' as const,
  flex: 1,
};

const lastValue = {
    borderBottom: 'none',
}

const footer = {
  marginTop: '32px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#666666',
  fontSize: '12px',
};
