"use client";

import { findByAcademicProcessAndPeriod } from "@/app/services/dates.service";
import { ImportantDate } from "@/app/types/entities/Important-date";
import SpinnerPage from "@/components/shared/spinner-page";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { TermCard } from "@/components/shared/period-card";


/**
 * ThesisDates Component
 *
 * A component that displays a list of important dates and deadlines related to undergraduate thesis.
 * Fetches date information from the thesis service and organizes it into categorized tables.
 *
 * Features:
 * - Fetches dates data using React Query
 * - Groups dates by categories
 * - Displays loading state while fetching
 * - Handles error states
 * - Responsive layout with consistent styling
 *
 * @returns {JSX.Element} A container with multiple date tables grouped by category
 */
export default function ImportantDates({name, academicProcess} : {readonly name: string, readonly academicProcess: string}) {
  const [selectedPeriod, setSelectedPeriod] = useState<string>(() => {
    try {
      if (typeof window !== "undefined") return localStorage.getItem("current_period") ?? "";
    } catch (e) {}
    return "";
  });

  const {
    data: sections,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["student-dates", academicProcess, selectedPeriod],
    queryFn: () => findByAcademicProcessAndPeriod(academicProcess, selectedPeriod),
  });

  if (isFetching) return <SpinnerPage />;
  if (error || !sections) return <div>No se pudieron encontrar las fechas </div>;
  return (
    <div className="min-h-full mx-auto p-4 container max-w-3xl">
      <div className="w-full bg-card shadow-lg rounded-xl p-5 h-full space-y-4">
        <div className="flex items-start justify-between">
          <h1 className="text-xl font-semibold text-core">Fechas de {name}</h1>
          <div className="ml-4">
            <TermCard compact selectedPeriod={selectedPeriod} handlePeriodChange={(period:string) => setSelectedPeriod(period)} footer="" />
          </div>
        </div>
        {
          !sections.length && <p className="text-foreground">No se han definido fechas para el periodo actual</p>
        }
        {sections.length > 0 && sections.map((section) => (
          <DateTable
            key={section.id}
            title={section.name}
            dates={section.importantDates}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * DateTable Component
 *
 * A reusable component that renders a table of dates for a specific thesis-related category.
 * Displays dates in a structured format with consistent styling and responsive layout.
 *
 * Features:
 * - Category title with distinct styling
 * - Two-column table layout (Description and Date)
 * - Themed header with contrasting colors
 * - Responsive table design
 *
 * @param {Object} props The component props
 * @param {string} props.title The category title for this group of dates
 * @param {ThesisDatesInterface[]} props.dates Array of date objects containing title and date information
 * @returns {JSX.Element} A formatted table showing dates for a specific category
 */
function DateTable({
  title,
  dates,
}: {
  readonly title: string;
  readonly dates: ImportantDate[];
}) {
  const [sortConfig, setSortConfig] = useState<{
    key: "name" | "date" | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });

  const collator = useMemo(
    () => new Intl.Collator("es", { sensitivity: "base" }),
    []
  );

  const sortedDates = useMemo(() => {
    if (!sortConfig.key) return dates;

    const sorted = [...dates].sort((a, b) => {
      if (sortConfig.key === "date") {
        const aDate = Date.parse(a.date);
        const bDate = Date.parse(b.date);
        const comparison = (aDate || 0) - (bDate || 0);
        return sortConfig.direction === "asc" ? comparison : -comparison;
      }

      const comparison = collator.compare(a.name, b.name);
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [collator, dates, sortConfig]);

  const handleSort = (key: "name" | "date") => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        if (prev.direction === "asc") return { key, direction: "desc" };
        return { key: null, direction: "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const getAriaSort = (key: "name" | "date") => {
    if (sortConfig.key !== key) return "none" as const;
    return sortConfig.direction === "asc" ? "ascending" : "descending";
  };

  const renderSortIcon = (key: "name" | "date") => {
    if (sortConfig.key !== key) return <ArrowUpDown className="h-4 w-4 opacity-50" />;
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-core">{title}</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="bg-core-highlight text-white text-center cursor-pointer select-none"
              onClick={() => handleSort("name")}
              aria-sort={getAriaSort("name")}
            >
              <span className="flex items-center justify-center gap-2">
                Descripción
                {renderSortIcon("name")}
              </span>
            </TableHead>
            <TableHead
              className="bg-core-highlight text-white text-center cursor-pointer select-none"
              onClick={() => handleSort("date")}
              aria-sort={getAriaSort("date")}
            >
              <span className="flex items-center justify-center gap-2">
                Fecha
                {renderSortIcon("date")}
              </span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedDates.map((date) => (
            <TableRow key={date.id}>
              <TableCell className="text-primary">{date.name}</TableCell>
              <TableCell className="text-primary">{date.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}


