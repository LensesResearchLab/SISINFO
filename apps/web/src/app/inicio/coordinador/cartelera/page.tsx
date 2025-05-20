"use client";

import React, { useState, useMemo, useEffect } from "react";
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

export default function UploadBillboard() {
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

  const dialogText = {
    title: "Publicar cartelera",
    description: "¿Estás seguro de que deseas publicar esta cartelera?",
    buttonText: "Publicar cartelera",
    successTitle: "Cartelera Publicado",
    successText: "Tu cartelera ha sido publicada exitosamente",
    url: `${ROUTES.HOME}/${ROUTES.BULLETIN_BOARD}`,
  };

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

  const handleUploadCsv = (data: Billboard[]) => {
    setCsvData(data);
    createBillboard(data);
  };

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
        <UploadedBillboard classesData={coursesData} loadError={loadError} />
      </UploadFilePage>

      <AlertDialogError open={loadError} onOpenChange={setLoadError} />
    </>
  );
}

function UploadedBillboard({
  classesData,
  loadError,
}: {
  readonly classesData: Course[];
  readonly loadError: boolean;
}) {
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
            {professors.length > 0 ? professors.join(", ") : "No asignados"}
          </span>
        );
      },
    },
  ];

  if (loadError) return <BillboardNotFound />;

  return (
    <div className="min-h-full min-w-full">
      <div className="bg-card rounded-lg shadow-lg p-6 space-y-6">
        <h2 className="text-2xl font-bold text-primary text-center">
          Cartelera cargada
        </h2>
        <DataTable
          columns={columns}
          data={classesData}
        />
      </div>
    </div>
  );
}

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
