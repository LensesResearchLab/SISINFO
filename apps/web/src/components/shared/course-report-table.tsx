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
import { Download, Mail } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { getPeriods } from "@/app/services/period.service";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";


 function buildMailto(to: string | string[], opts?: {
  subject?: string;
  body?: string;
  cc?: string | string[];
  bcc?: string | string[];
}) {
  const toPart = Array.isArray(to) ? to.join(",") : to;
  const params = new URLSearchParams();


  if (opts?.subject) params.set("subject", opts.subject);
  if (opts?.body) params.set("body", opts.body.replace(/\n/g, "\r\n"));
  if (opts?.cc) params.set("cc", Array.isArray(opts.cc) ? opts.cc.join(",") : opts.cc);
  if (opts?.bcc) params.set("bcc", Array.isArray(opts.bcc) ? opts.bcc.join(",") : opts.bcc);

  const qs = params.toString().replace(/\+/g, "%20");
  return qs ? `mailto:${toPart}?${qs}` : `mailto:${toPart}`;
}




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
  const [sortConfig, setSortConfig] = useState<{
    key: keyof CourseReports | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });

  const collator = useMemo(
    () => new Intl.Collator("es", { sensitivity: "base", numeric: true }),
    []
  );

  const sendEmailToProfessors = () => {
  // toma los correos visibles (sortedData) para respetar filtros/orden actual
  const emails = Array.from(
    new Set(
      (sortedData ?? [])
        .map(r => r.professorEmail?.trim())
        .filter((e): e is string => !!e)
    )
  );

  if (emails.length === 0) {
    alert("No hay correos para enviar.");
    return;
  }

  // Asunto y cuerpo opcionales (ajústalos a tu flujo)
  const subject = 'Recordatorio: Cargar el Programa de la Materia';

  const body = `Buenas tardes,\n\nSe envia este correo para recordar cargar el programa de la materia.\n\nSaludos cordiales.`;

  // Por privacidad: BCC con todos y TO vacío
  const href = buildMailto("", { subject, body, bcc: emails });

  // Si los quieres en TO en lugar de BCC, usa:
  // const href = buildMailto(emails, { subject, body });

  // Abrir el cliente de correo
  window.location.href = href;
};

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    const sorted = [...data].sort((a, b) => {
      const aValue = String(a[sortConfig.key!] ?? "");
      const bValue = String(b[sortConfig.key!] ?? "");
      const comparison = collator.compare(aValue, bValue);
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [collator, data, sortConfig]);

  const handleSort = (key: keyof CourseReports) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        if (prev.direction === "asc") {
          return { key, direction: "desc" };
        }
        return { key: null, direction: "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const getAriaSort = (key: keyof CourseReports) => {
    if (sortConfig.key !== key) return "none" as const;
    return sortConfig.direction === "asc" ? "ascending" : "descending";
  };

  const renderSortIcon = (key: keyof CourseReports) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="h-4 w-4 opacity-50" />;
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

  // Fetch periods if selector is enabled
  useEffect(() => {
    if (!showPeriodSelector) return;

    const fetchPeriods = async () => {
      try {
        const periodsData = await getPeriods();
        setPeriods(periodsData);
        if (periodsData && periodsData.length > 0) {
          const stored = typeof window !== "undefined" ? localStorage.getItem("current_period") : null;
          const lastPeriod = periodsData[periodsData.length - 1];
          if (stored && periodsData.includes(stored)) {
            setSelectedPeriod(stored);
          } else {
            setSelectedPeriod(lastPeriod);
          }
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
            )}
          </div>
          <div className="flex gap-2">
          <Button onClick={sendEmailToProfessors}>  
            <Mail className="mr-2 h-4 w-4" /> 
          </Button>
          <Button
            onClick={downloadExcel}
            className=""
          >
            <Download className="mr-2 h-4 w-4" />
            Descargar Excel
          </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-core hover:!bg-core-highlight">
                <TableHead
                  className="border-r text-center text-white cursor-pointer select-none"
                  onClick={() => handleSort("crn")}
                  aria-sort={getAriaSort("crn")}
                >
                  <span className="flex items-center justify-center gap-2">
                    CRN
                    {renderSortIcon("crn")}
                  </span>
                </TableHead>
                <TableHead
                  className="border-r text-center text-white cursor-pointer select-none"
                  onClick={() => handleSort("section")}
                  aria-sort={getAriaSort("section")}
                >
                  <span className="flex items-center justify-center gap-2">
                    No. Sección
                    {renderSortIcon("section")}
                  </span>
                </TableHead>
                <TableHead
                  className="border-r text-center text-white cursor-pointer select-none"
                  onClick={() => handleSort("courseCode")}
                  aria-sort={getAriaSort("courseCode")}
                >
                  <span className="flex items-center justify-center gap-2">
                    Código
                    {renderSortIcon("courseCode")}
                  </span>
                </TableHead>
                <TableHead
                  className="border-r text-center text-white cursor-pointer select-none"
                  onClick={() => handleSort("courseName")}
                  aria-sort={getAriaSort("courseName")}
                >
                  <span className="flex items-center justify-center gap-2">
                    Curso
                    {renderSortIcon("courseName")}
                  </span>
                </TableHead>
                <TableHead
                  className="border-r text-center text-white cursor-pointer select-none"
                  onClick={() => handleSort("professorName")}
                  aria-sort={getAriaSort("professorName")}
                >
                  <span className="flex items-center justify-center gap-2">
                    Nombre
                    {renderSortIcon("professorName")}
                  </span>
                </TableHead>
                <TableHead
                  className="border-r text-center text-white cursor-pointer select-none"
                  onClick={() => handleSort("professorEmail")}
                  aria-sort={getAriaSort("professorEmail")}
                >
                  <span className="flex items-center justify-center gap-2">
                    Correo
                    {renderSortIcon("professorEmail")}
                  </span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((course) => (
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
