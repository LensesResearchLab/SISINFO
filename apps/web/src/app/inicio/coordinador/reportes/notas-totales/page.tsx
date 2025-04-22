"use client";
import { getFinalGradesReport } from "@/app/services/billboard.service"; // Adjust import as needed
import CourseReportTable from "@/components/shared/course-report-table";

export default function FinalGradesReport() {
  return (
    <div className="container mx-auto py-10 px-8">
      <CourseReportTable
        title="Reporte de Secciones sin archivos de Cierre"
        fetchData={getFinalGradesReport}
        excelFileName="reporte_secciones_sin_calificaciones_finales"
        excelSheetName="Reporte calificaciones finales"
      />
    </div>
  );
}
