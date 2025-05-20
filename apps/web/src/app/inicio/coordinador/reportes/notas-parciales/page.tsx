"use client";

import { getPartialGradesReport } from "@/app/services/billboard.service"; // Service that fetches partial grade report data
import CourseReportTable from "@/components/shared/course-report-table"; // Reusable table component for displaying report data

/**
 * PartialGradesReport Component
 *
 * Displays a report of course sections that do not have partial grade files (30%).
 * Uses a reusable `CourseReportTable` component to fetch, render, and optionally export the data.
 *
 * Features:
 * - Fetches data via `getPartialGradesReport`
 * - Displays table with customizable title
 * - Allows exporting report to Excel with provided filename and sheet name
 *
 * @returns {JSX.Element} A container with the report table
 */
export default function PartialGradesReport() {
  return (
    <div className="container mx-auto py-10 px-8">
      <CourseReportTable
        title="Reporte de Secciones sin archivos de 30%"
        fetchData={getPartialGradesReport}
        excelFileName="reporte_secciones_sin_notas_parciales"
        excelSheetName="Reporte notas parciales"
      />
    </div>
  );
}
