"use client";

import { getFinalGradesReport } from "@/app/services/billboard.service"; // Service that fetches final grades report
import CourseReportTable from "@/components/shared/course-report-table"; // Reusable table component for displaying report data

/**
 * FinalGradesReport Component
 *
 * Displays a report of course sections that are missing final grade (closing) files.
 * Leverages the reusable `CourseReportTable` to handle data fetching, display, and export.
 *
 * Features:
 * - Fetches report data from `getFinalGradesReport`
 * - Displays a table with a custom title
 * - Allows exporting the data to an Excel file with predefined filename and sheet name
 *
 * @returns {JSX.Element} A report table embedded in a styled container
 */
export default function FinalGradesReport() {
  return (
    <div className="container mx-auto py-10 px-8">
      <CourseReportTable
        title="Reporte de Secciones sin archivos de Cierre"
        fetchData={getFinalGradesReport}
        excelFileName="reporte_secciones_sin_calificaciones_finales"
        excelSheetName="Reporte calificaciones finales"
        showPeriodSelector={true}
      />
    </div>
  );
}
