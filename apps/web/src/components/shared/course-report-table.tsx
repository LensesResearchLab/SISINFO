"use client";
import { CourseReports } from "@/app/types/billboard.type";
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

interface CourseReportTableProps {
  readonly title: string;
  readonly fetchData: () => Promise<CourseReports[]>;
  readonly excelFileName: string;
  readonly excelSheetName: string;
}

export default function CourseReportTable({
  title,
  fetchData,
  excelFileName,
  excelSheetName,
}: CourseReportTableProps) {
  const [data, setData] = useState<CourseReports[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchData();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [fetchData]);

  if (isLoading) {
    return <SpinnerPage />;
  }

  const downloadExcel = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const exportData = data.map(({ id, ...rest }) => rest);
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [["CRN", "No. Sección", "Código", "Curso", "Nombre", "Correo"]],
      { origin: "A1" }
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, excelSheetName);
    XLSX.writeFile(workbook, `${excelFileName}.xlsx`);
  };

  return (
    <div className="min-h-full min-w-full p-10">
      <div className="bg-card rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-core">{title}</h2>
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
              <TableRow className="bg-core">
                <TableHead className="border-r text-center text-white">
                  CRN
                </TableHead>
                <TableHead className="border-r text-center text-white">
                  No. Sección
                </TableHead>
                <TableHead className="border-r text-center text-white">
                  Código
                </TableHead>
                <TableHead className="border-r text-center text-white">
                  Curso
                </TableHead>
                <TableHead className="border-r text-center text-white">
                  Nombre
                </TableHead>
                <TableHead className="border-r text-center text-white">
                  Correo
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((course) => (
                <TableRow key={course.id} className="bg-white">
                  <TableCell className="border-r font-medium">
                    {course.crn}
                  </TableCell>
                  <TableCell className="border-r font-medium">
                    {course.section}
                  </TableCell>
                  <TableCell className="border-r">
                    {course.courseCode}
                  </TableCell>
                  <TableCell className="border-r">
                    {course.courseName}
                  </TableCell>
                  <TableCell className="border-r">
                    {course.professorName}
                  </TableCell>
                  <TableCell className="border-r">
                    {course.professorEmail}
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
