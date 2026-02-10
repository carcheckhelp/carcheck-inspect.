'use client';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InspectionPDF from './InspectionPDF';
import React from 'react';

interface DownloadInspectionButtonProps {
    order: any;
    className?: string;
    label?: string;
    showIcon?: boolean;
}

const DownloadInspectionButton = ({ order, className, label, showIcon = true }: DownloadInspectionButtonProps) => {
    return (
        <PDFDownloadLink document={<InspectionPDF order={order} />} fileName={`reporte_carcheck_${order.id}.pdf`}>
            {({ blob, url, loading, error }) => (
                <button 
                    className={className || "bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition-colors flex items-center justify-center gap-2"}
                    disabled={loading}
                    title="Descargar Reporte PDF"
                >
                    {loading ? (
                        <span>Generando...</span>
                    ) : (
                        <>
                            {showIcon && (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>
                            )}
                            {label && <span>{label}</span>}
                        </>
                    )}
                </button>
            )}
        </PDFDownloadLink>
    );
};

export default DownloadInspectionButton;
