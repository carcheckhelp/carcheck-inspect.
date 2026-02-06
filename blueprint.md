# CarCheck Application Blueprint

## Overview

CarCheck is a web application built with Next.js, Firebase, and Gemini, designed for individuals who want a pre-purchase inspection for vehicles. The application provides a seamless workflow for scheduling appointments, tracking orders, and generating detailed inspection reports.

## Design and Styling

*   **Color Palette:**
    *   Background: `#000000` (black)
    *   "Car" word: `#B8860B` (dark gold)
    *   "Check" word: `#FFD700` (bright yellow)
    *   Main Text: `#FFFFFF` (white)
    *   Button Hover: `#FFD700` (bright yellow) with black text
*   **Logo:** "CarCheck" with "Car" in dark gold and "Check" in bright yellow on a black background.
*   **Visual Style:** Modern, minimalist, with clear sans-serif typography.
*   **UI Elements:** Buttons and dropdowns with rounded borders and hover effects in yellow/gold.

## Application Structure

### 1. Main Page (`/`)

*   **Header:** Logo and navigation.
*   **Sections:**
    *   **Agendar Cita (Schedule Appointment):** Button to start the appointment scheduling process.
    *   **Seguir Orden (Track Order):** Form to track an existing order.
    *   **Inspector:** Login for inspectors.

### 2. Agendar Cita (Schedule Appointment) Flow

*   **Package Selection (`/schedule/package`):**
    *   **Core ($4000):** ABS, SRS, TPMS, engine, body, and lights inspection.
    *   **CarCheck Plus:** Core + Carfax report.
    *   **Pro:** CarCheck Plus for vehicles 2020 and newer.
*   **Personal Information (`/schedule/personal-info`):**
    *   Form with fields: Name, Phone, Email.
*   **Vehicle Information (`/schedule/vehicle-info`):**
    *   Form with fields:
        *   Make (dropdown with a comprehensive list of brands).
        *   Model.
        *   VIN (Chassis).
        *   Year.
        *   Location (Google Maps API integration).
*   **Payment (`/schedule/payment`):**
    *   Options: PayPal, Bank Transfer, Cash.
*   **Confirmation (`/schedule/confirmation`):**
    *   Displays the automatically generated order number.

### 3. Seguir Orden (Track Order) Flow

*   **Tracking Form (`/track`):**
    *   Input fields: Email or Phone + Order Number.
*   **Order Status (`/track/orders`):**
    *   Displays a list of the client's orders with status: "En proceso" (In Process) or "Completado" (Completed).
    *   Each order includes a downloadable report.

### 4. Inspector Flow

*   **Login (`/inspector/login`):**
    *   Email and password authentication.
*   **Dashboard (`/inspector/dashboard`):**
    *   Lists all assigned orders.
    *   Each order displays: Order ID, Client Name, Vehicle.
    *   **Actions per order:**
        *   **Status Selector:** A dropdown to manually set the order status ("Pendiente", "En Proceso", "Completada").
        *   **Iniciar Inspección:** A button that navigates to the detailed inspection form (`/inspector/inspection/[orderId]`).
        *   **Descargar Reporte:** A button (enabled only when status is "Completada") to download the final PDF report.
*   **Inspection Form (`/inspector/inspection/[orderId]`):**
    *   **Modern, Multi-Step Questionnaire (200+ points):**
        *   **Sections:** Carrocería, Interior, Motor, Transmisión, Luces, Gomas, Sistemas Electrónicos, y Niveles de fluidos.
        *   **Scoring System:** Each inspection point is rated on a scale of 1 to 5 (1=Malo, 5=Perfecto).
        *   **Observations:** Each section includes a dedicated text area for the inspector's detailed notes and observations.
    *   **Completion and Report Generation:**
        *   A "Finalizar Inspección" button at the end of the form.
        *   On click, all data (scores and observations) is collected.
        *   **Gemini AI Integration:** The collected data is sent to the Gemini API to generate:
            *   A concise summary of the vehicle's overall condition.
            *   A list of future recommendations for maintenance or repair.
        *   The generated summary and recommendations are saved with the inspection data.
        *   The order status is automatically updated to "Completada".
        *   The inspector is redirected back to the dashboard.

## Integrations

*   **Firebase:**
    *   Authentication: For inspectors.
    *   Firestore: To store order details, customer information, and inspection data.
    *   Storage: To store the generated PDF reports.
*   **Gemini API:** To automatically generate inspection reports.
*   **Google Maps API:** For vehicle location selection.
*   **PayPal API:** For online payments.

## UX Considerations

*   **Guided Workflow:** A step-by-step process for scheduling appointments.
*   **Form Validation:**
    *   Valid email format.
    *   Numeric phone number.
    *   Correct VIN format.
*   **Visual Feedback:** Spinners during loading and confirmations for actions.
*   **Inspector Interface:** Clear and structured checklist for inspections.
*   **Downloadable Reports:** Reports available in PDF format.
