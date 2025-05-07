"use client";
import { getProjectApplicationsReport } from "@/app/services/project-application.service";
import { ProjectReport } from "@/app/types/project-report.type";
import SpinnerPage from "@/components/shared/spinner-page";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

export default function UndergraduateProjectsReport() {
  return (
    <div className="container mx-auto py-10 px-8">
      <ProjectsReportList />
    </div>
  );
}

function ProjectsReportList() {
  const [data, setData] = useState<ProjectReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProjectApplicationsReport();
        setData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <SpinnerPage />;
  }

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

  return (
    <div className="min-h-full min-w-full p-10">
      <div className="bg-card rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
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

        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-core-highlight">
                <TableCell
                  className="border-r text-center font-medium text-white"
                  colSpan={3}
                >
                  Estudiante
                </TableCell>
                <TableCell
                  className="border-r text-center font-medium text-white"
                  colSpan={2}
                >
                  Asesor
                </TableCell>
                <TableCell
                  className="border-r text-center font-medium text-white"
                  colSpan={2}
                >
                  Información Académica
                </TableCell>
              </TableRow>
              <TableRow className="bg-core">
                <TableHead className="border-r text-center text-white">
                  Código
                </TableHead>
                <TableHead className="border-r text-center text-white">
                  Nombres y apellidos
                </TableHead>
                <TableHead className="border-r text-center text-white">
                  Correo
                </TableHead>
                <TableHead className="border-r text-center text-white">
                  Nombres y apellidos
                </TableHead>
                <TableHead className="border-r text-center text-white">
                  Correo
                </TableHead>
                <TableHead className="border-r text-center text-white">
                  Tema Tesis
                </TableHead>
                <TableHead className="border-r text-center text-white">
                  Estado Tesis
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((project) => (
                <TableRow key={project.student_code} className="bg-white">
                  <TableCell className="border-r font-medium">
                    {project.student_code}
                  </TableCell>
                  <TableCell className="border-r">
                    {project.student_name}
                  </TableCell>
                  <TableCell className="border-r">
                    {project.student_email}
                  </TableCell>
                  <TableCell className="border-r">
                    {project.professor_name}
                  </TableCell>
                  <TableCell className="border-r">
                    {project.professor_email}
                  </TableCell>
                  <TableCell className="border-r">
                    {project.project_title}
                  </TableCell>
                  <TableCell className="border-r">{project.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
