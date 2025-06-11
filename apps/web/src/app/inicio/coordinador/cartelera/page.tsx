"use client";

import { useState } from "react";
import { Course } from "@/app/types/entities/billboard.type";
import {
  getBillboard,
} from "@/app/services/billboard.service";
import { ROUTES } from "@/app/routes";
import { UploadFilePage } from "@/components/shared/upload-files-page";
import { AlertDialogError } from "@/components/shared/alert-dialog-error";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import * as XLSX from "xlsx";

export default function UploadBillboard() {
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


  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/plantilla.xlsm";
    link.download = "plantilla.xlsm";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUploadXlsm = async (file: File) => {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });

    const sheetName = "plantillaSisinfo";
    const worksheet = workbook.Sheets[sheetName];

    if (!worksheet) {
      setLoadError(true);
    }
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
        handleUploadCsv={(file) => {
          if (file instanceof File) {
            handleUploadXlsm(file);
          }
        }}
        dialogText={dialogText}
      >
        <UploadedBillboard classesData={coursesData} loadError={loadError} />
      </UploadFilePage >

      <AlertDialogError open={loadError} onOpenChange={setLoadError} />
    </>
  );
}

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

function UploadedBillboard({
  classesData,
  loadError,
}: {
  readonly classesData: Course[];
  readonly loadError: boolean;
}) {
  if (loadError) return <BillboardNotFound />;
  return (
    <div className="min-h-full min-w-full">
      <div className="bg-card rounded-lg shadow-lg p-6 space-y-6">
        <h2 className="text-2xl font-bold text-core text-center">
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
        <h2 className="text-2xl font-bold mb-4 text-core text-center">
          Error al cargar la cartelera
        </h2>
        <p className="text-core text-center">
          No se pudo cargar la cartelera. Por favor, intenta nuevamente.
        </p>
      </div>
    </div>
  );
}
