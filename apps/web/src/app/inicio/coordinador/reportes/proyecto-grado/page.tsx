"use client";

import { useEffect, useState } from "react";
import { getProjectApplicationsReport } from "@/app/services/project-application.service";
import { ProjectReport } from "@/app/types/project-report.type";
import SpinnerPage from "@/components/shared/spinner-page";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";
import { DataTable } from "@/components/data-table";
import { columns } from "./ProjectReportColumns";

/**
 * UndergraduateProjectsReport Component
 *
 * Fetches and displays a DataTable with undergraduate project records,
 * and includes functionality to export the report to Excel.
 *
 * @returns {JSX.Element}
 */
export default function UndergraduateProjectsReport() {
  const [data, setData] = useState<ProjectReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getProjectApplicationsReport();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Download report as Excel file
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [
        [
          "Código",
          "Nombres y apellidos",
          "Correo",
          "Nombres y apellidos (Asesor)",
          "Correo (Asesor)",
          "Tema Tesis",
          "Estado Tesis",
        ],
      ],
      { origin: "A1" }
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte Proyectos");
    XLSX.writeFile(workbook, "reporte_proyectos_grado.xlsx");
  };

  if (isLoading) return <SpinnerPage />;

  return (
    <div className="container mx-auto py-10 px-8">
      <div className="bg-card rounded-lg shadow-lg p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-core">
            Reporte de Proyectos de Grado
          </h2>
          <Button
            onClick={downloadExcel}
            className="bg-core-highlight hover:bg-core text-white"
          >
            <Download className="mr-2 h-4 w-4" />
            Descargar Excel
          </Button>
        </div>

        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}