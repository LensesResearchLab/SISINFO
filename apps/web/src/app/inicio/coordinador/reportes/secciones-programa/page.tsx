"use client";
import { getProgramUploadedReport } from "@/app/services/billboard.service";
import CourseReportTable from "@/components/shared/course-report-table";

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
