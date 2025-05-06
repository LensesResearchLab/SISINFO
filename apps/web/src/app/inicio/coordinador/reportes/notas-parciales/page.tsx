"use client";
import { getPartialGradesReport } from "@/app/services/billboard.service"; // Adjust import as needed
import CourseReportTable from "@/components/shared/course-report-table";

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
