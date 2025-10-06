"use client";
import { CourseReports } from "@/app/types/entities/billboard.type";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { getPeriods } from "@/app/services/period.service";

/**
 * TruncatedCell Component
 * 
 * Displays a truncated text with tooltip showing full content on hover
 */
function TruncatedCell({ content, maxItems = 3 }: { readonly content: string; readonly maxItems?: number }) {
  const items = content.split(",").map((item) => item.trim());
  const shouldTruncate = items.length > maxItems;
  const displayedItems = shouldTruncate ? items.slice(0, maxItems) : items;
  const displayText = shouldTruncate
    ? `${displayedItems.join(", ")} (...)`
    : content;

  if (!shouldTruncate) {
    return <span>{content}</span>;
  }

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-help">{displayText}</span>
        </TooltipTrigger>
        <TooltipContent className="max-w-md">
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface CourseReportTableProps {
  readonly title: string;
  readonly fetchData: (period?: string) => Promise<CourseReports[]>;
  readonly excelFileName: string;
  readonly excelSheetName: string;
  readonly showPeriodSelector?: boolean;
}

export default function CourseReportTable({
  title,
  fetchData,
  excelFileName,
  excelSheetName,
  showPeriodSelector = false,
}: CourseReportTableProps) {
  const [data, setData] = useState<CourseReports[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [periods, setPeriods] = useState<string[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");

  // Fetch periods if selector is enabled
  useEffect(() => {
    if (!showPeriodSelector) return;

    const fetchPeriods = async () => {
      try {
        const periodsData = await getPeriods();
        setPeriods(periodsData);
        if (periodsData && periodsData.length > 0) {
          const lastPeriod = periodsData[periodsData.length - 1];
          setSelectedPeriod(lastPeriod);
        }
      } catch (error) {
        console.error("Error fetching periods:", error);
      }
    };
    fetchPeriods();
  }, [showPeriodSelector]);

  // Fetch data when period changes or on mount
  useEffect(() => {
    // Only fetch if period selector is disabled, or if a period is selected
    if (showPeriodSelector && !selectedPeriod) return;

    const loadData = async () => {
      setIsLoading(true);
      try {
        const result = await fetchData(showPeriodSelector ? selectedPeriod : undefined);
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [fetchData, showPeriodSelector, selectedPeriod]);

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
    const fileName = showPeriodSelector && selectedPeriod 
      ? `${excelFileName}_${selectedPeriod}.xlsx`
      : `${excelFileName}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="min-h-full min-w-full p-10">
      <div className="bg-card rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-core">{title}</h2>
            {showPeriodSelector && (
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-[200px]">
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
            )}
          </div>
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
                    <TruncatedCell content={course.crn} maxItems={3} />
                  </TableCell>
                  <TableCell className="border-r font-medium">
                    <TruncatedCell content={course.section} maxItems={3} />
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
