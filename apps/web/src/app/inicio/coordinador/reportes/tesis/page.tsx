"use client";

import { useEffect, useState } from "react";
import { getThesisApplicationsReport } from "@/app/services/thesis.service";
import { getPeriods } from "@/app/services/period.service";
import { ThesisReport } from "@/app/types/thesis-report.type";
import SpinnerPage from "@/components/shared/spinner-page";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";
import { DataTable } from "@/components/data-table";
import { columns } from "./ThesisReportColumns";

/**
 * ThesisReports Component
 *
 * Displays a DataTable of thesis applications (Thesis 1) for undergraduate students.
 * Allows exporting the data to an Excel file.
 *
 * @returns {JSX.Element}
 */
export default function ThesisReports() {
  const [data, setData] = useState<ThesisReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [periods, setPeriods] = useState<string[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>(() => {
    try {
      if (typeof window !== "undefined") return localStorage.getItem("current_period") ?? "";
    } catch (e) {}
    return "";
  });

  /**
   * Fetch available periods on mount
   */
  useEffect(() => {
    const fetchPeriods = async () => {
      try {
        const periodsData = await getPeriods();
        setPeriods(periodsData);
        // Select the most recent period by default, preferring stored current_period
        if (periodsData && periodsData.length > 0) {
          const stored = typeof window !== "undefined" ? localStorage.getItem("current_period") : null;
          const lastPeriod = periodsData[periodsData.length - 1];
          if (stored && periodsData.includes(stored)) setSelectedPeriod(stored);
          else setSelectedPeriod(lastPeriod);
        }
      } catch (error) {
        console.error("Error fetching periods:", error);
      }
    };
    fetchPeriods();
  }, []);

  /**
   * Fetch report data when period changes
   */
  useEffect(() => {
    if (!selectedPeriod) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await getThesisApplicationsReport(selectedPeriod);
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [selectedPeriod]);

  /**
   * Downloads the current data as an Excel file with formatted headers
   */
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
          "Subárea",
          "Tema Tesis",
          "Estado",
          "Calificación",
        ],
      ],
      { origin: "A1" }
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte Tesis");
    XLSX.writeFile(workbook, `reporte_tesis1_${selectedPeriod}.xlsx`);
  };

  if (isLoading) return <SpinnerPage />;

  return (
    <div className="container mx-auto py-10 px-8">
      <div className="bg-card rounded-lg shadow-lg p-6 space-y-6">
        {/* Header with title, period selector and Excel download */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-core">Reporte de Tesis 1</h2>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[200px] text-foreground">
                <SelectValue placeholder="Seleccionar período" />
              </SelectTrigger>
              <SelectContent>
                {periods.map((period) => (
                  <SelectItem key={period} value={period}>
                    {period}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={downloadExcel}
            className="bg-core-highlight hover:bg-core text-white"
          >
            <Download className="mr-2 h-4 w-4" />
            Descargar Excel
          </Button>
        </div>

        {/* DataTable for dynamic filtering, sorting, pagination */}
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}