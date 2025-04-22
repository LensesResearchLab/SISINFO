"use client";
import { getThesisApplicationsReport } from "@/app/services/thesis.service";
import { ThesisReport } from "@/app/types/thesis.type";
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

export default function ThesisReports() {
  return (
    <div className="container mx-auto py-10 px-8">
      <ThesisReportList />
    </div>
  );
}

function ThesisReportList() {
  const [data, setData] = useState<ThesisReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getThesisApplicationsReport();
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
          "Subarea",
          "Tema Tesis",
          "Estado",
          "Calificación",
        ],
      ],
      { origin: "A1" }
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte Tesis");
    XLSX.writeFile(workbook, "reporte_tesis1.xlsx");
  };

  return (
    <div className="min-h-full min-w-full p-10">
      <div className="bg-card rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-core">Reporte de Tesis 1</h2>
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
                  colSpan={4}
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
                  Subárea
                </TableHead>
                <TableHead className="border-r text-center text-white">
                  Tema Tesis
                </TableHead>
                <TableHead className="border-r text-center text-white">
                  Estado
                </TableHead>
                <TableHead className="border-r text-center text-white">
                  Calificación
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((thesis) => (
                <TableRow key={thesis.student_code} className="bg-white">
                  <TableCell className="border-r font-medium">
                    {thesis.student_code}
                  </TableCell>
                  <TableCell className="border-r">
                    {thesis.student_name}
                  </TableCell>
                  <TableCell className="border-r">
                    {thesis.student_email}
                  </TableCell>
                  <TableCell className="border-r">
                    {thesis.professor_name}
                  </TableCell>
                  <TableCell className="border-r">
                    {thesis.professor_email}
                  </TableCell>
                  <TableCell className="border-r">
                    {thesis.thesis_investigation_subarea}
                  </TableCell>
                  <TableCell className="border-r">
                    {thesis.thesis_title}
                  </TableCell>
                  <TableCell className="border-r">{thesis.status}</TableCell>
                  <TableCell className="border-r">
                    {thesis.thesis_grade}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
