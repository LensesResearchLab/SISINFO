"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Billboard, Course } from "@/app/types/entities/billboard.type";
import {
  createBillboard,
  getBillboard,
} from "@/app/services/billboard.service";
import { ROUTES } from "@/app/routes";
import { UploadFilePage } from "@/components/shared/upload-files-page";
import { AlertDialogError } from "@/components/shared/alert-dialog-error";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";

/**
 * UploadBillboard Component
 *
 * This component handles the upload, display, and publishing of billboard/course schedules via CSV files.
 * It provides a UI for downloading a template, uploading files, previewing uploaded data, and publishing the final list.
 *
 * Features:
 * - CSV download with sample structure
 * - CSV file upload and billboard creation
 * - Period selection to view saved billboard data
 * - Error handling for failed loads
 * - Integration with the reusable DataTable component
 *
 * @returns {JSX.Element} Main upload and preview UI
 */
export default function UploadBillboard() {
  // CSV headers expected for billboard upload
  const headers = React.useMemo<(keyof Billboard)[]>(
    () => [
      "NRC",
      "code",
      "name",
      "departament",
      "credits",
      "section",
      "period",
      "professors",
    ],
    []
  );

  const [csvData, setCsvData] = useState<Billboard[]>([]);
  const [coursesData, setCoursesData] = useState<Course[]>([]);
  const [loadError, setLoadError] = useState(false);

  // Dialog text configuration for confirmation modal
  const dialogText = {
    title: "Publicar cartelera",
    description: "¿Estás seguro de que deseas publicar esta cartelera?",
    buttonText: "Publicar cartelera",
    successTitle: "Cartelera Publicado",
    successText: "Tu cartelera ha sido publicada exitosamente",
    url: `${ROUTES.HOME}/${ROUTES.BULLETIN_BOARD}`,
  };

  /**
   * Converts CSV data to string format with headers and example rows.
   * Used to download a template file for the user.
   */
  const convertToCSV = (
    headers: (keyof Billboard)[],
    data: Billboard[]
  ): string => {
    const csv = [headers.join(",")];
    data.slice(0, 3).forEach((row) => {
      const rowData = headers.map((header) => row[header] ?? "");
      csv.push(rowData.join(","));
    });
    return csv.join("\n");
  };

  const csvContent = React.useMemo(
    () => convertToCSV(headers, csvData),
    [csvData, headers]
  );

  /**
   * Triggers the browser to download a CSV file with the current template
   */
  const handleDownload = () => {
    const encodedUri = encodeURI(`data:text/csv;charset=utf-8,${csvContent}`);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "plantilla.csv");
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /**
   * Handles CSV file upload and triggers creation of billboard records
   */
  const handleUploadCsv = (data: Billboard[]) => {
    setCsvData(data);
    createBillboard(data);
  };

  /**
   * Handles academic period change and loads billboard data from the server
   */
  const handlePeriodChange = (value: string) => {
    getBillboard(value)
      .then((data) => {
        setCoursesData(data.courses);
        setLoadError(false);
      })
      .catch(() => {
        setCoursesData([]);
        setLoadError(true);
      });
  };

  return (
    <>
      <UploadFilePage
        title="Cargar cartelera"
        handlePeriodChange={handlePeriodChange}
        handleDownload={handleDownload}
        handleUploadCsv={(data) => {
          const billboardData = data as unknown as Billboard[];
          handleUploadCsv(billboardData);
        }}
        dialogText={dialogText}
      >
        <UploadedBillboard
          classesData={coursesData}
          loadError={loadError}
        />
      </UploadFilePage>

      {/* Error dialog modal if loading billboard fails */}
      <AlertDialogError open={loadError} onOpenChange={setLoadError} />
    </>
  );
}

/**
 * UploadedBillboard Component
 *
 * Displays a preview of the loaded billboard courses with sorting and filtering.
 * Uses the reusable DataTable component to render course information in a paginated and sortable table.
 *
 * @param {Course[]} classesData - Loaded billboard courses
 * @param {boolean} loadError - Whether an error occurred while loading data
 * @returns {JSX.Element} Data table with course information or fallback message
 */
function UploadedBillboard({
  classesData,
  loadError,
}: {
  readonly classesData: Course[];
  readonly loadError: boolean;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDesc, setSortDesc] = useState(false);

  // Column definitions for the DataTable
  const columns: ColumnDef<Course>[] = [
    {
      accessorKey: "name",
      header: "Clase",
    },
    {
      accessorKey: "code",
      header: "Código",
    },
    {
      accessorFn: (row) => row.sections.length,
      header: "Secciones",
    },
    {
      accessorKey: "credits",
      header: "Créditos",
    },
    {
      id: "professors",
      header: "Profesores",
      cell: ({ row }) => {
        const professors = row.original.sections.flatMap((section) =>
          section.professors.map((p) => p.user.name)
        );
        return (
          <span>
            {professors.length > 0
              ? professors.join(", ")
              : "No asignados"}
          </span>
        );
      },
    },
  ];

  // Fallback if billboard failed to load
  if (loadError) {
    return <BillboardNotFound />;
  }

  /**
   * Filters courses based on user search input
   */
  const filteredData = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return classesData.filter(
      (course) =>
        course.name.toLowerCase().includes(lowerSearch) ||
        course.code.toLowerCase().includes(lowerSearch)
    );
  }, [searchTerm, classesData]);

  return (
    <div className="min-h-full min-w-full">
      <div className="bg-card rounded-lg shadow-lg p-6 space-y-6">
        <h2 className="text-2xl font-bold text-primary text-center">
          Cartelera cargada
        </h2>

        {/* Search bar and sorting toggle */}
        <div className="flex items-center gap-2 justify-center">
          <div className="relative w-[300px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-primary" />
            <input
              type="text"
              className="pl-9 pr-4 py-2 border rounded focus:outline-none text-primary w-full text-center"
              placeholder="Busca una clase o profesor"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            onClick={() => setSortDesc(!sortDesc)}
            className="bg-core text-card hover:bg-core"
          >
            {sortDesc ? "Z - A" : "A - Z"}
          </Button>
        </div>

        {/* Render DataTable with filtered course data */}
        <DataTable columns={columns} data={filteredData} />
      </div>
    </div>
  );
}

/**
 * BillboardNotFound Component
 *
 * Fallback view shown when the billboard data fails to load.
 *
 * @returns {JSX.Element} Error message card
 */
function BillboardNotFound() {
  return (
    <div className="min-h-full min-w-full">
      <div className="bg-card rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-primary text-center">
          Error al cargar la cartelera
        </h2>
        <p className="text-primary text-center">
          No se pudo cargar la cartelera. Por favor, intenta nuevamente.
        </p>
      </div>
    </div>
  );
}