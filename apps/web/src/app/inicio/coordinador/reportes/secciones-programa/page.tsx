"use client";

import { getProgramUploadedReport } from "@/app/services/billboard.service";
import CourseReportTable from "@/components/shared/course-report-table";

/**
 * ProgramsReport Component
 *
 * Displays a report of course sections that have not uploaded their academic program files.
 * Uses the reusable `CourseReportTable` to fetch and display the data.
 *
 * Features:
 * - Fetches report data from the backend
 * - Displays title and allows exporting to Excel
 * - Uses standard layout with padding and max width container
 *
 * @returns {JSX.Element} The rendered report table
 */
export default function ProgramsReport() {
  return (
    <div className="container mx-auto py-10 px-8">
      <CourseReportTable
        title="Reporte de Secciones sin archivos de Programa"
        fetchData={getProgramUploadedReport}
        excelFileName="reporte_secciones_sin_programa"
        excelSheetName="Reporte secciones sin programa"
      />
    </div>
  );
}
