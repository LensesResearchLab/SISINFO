"use client";

import { closeIncidence, getAllIncidences } from "@/app/services/incidences.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTable } from '@/components/data-table';
import { Incidence } from "@/app/types/entities/incidence.type";
import { ColumnDef } from "@tanstack/react-table";
import SpinnerPage from "@/components/shared/spinner-page";
import ErrorPage from "@/components/shared/error-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

/**
 * Column definitions for the Incidences DataTable
 *
 * Defines how each column of the table should display data:
 * - "description": Shows the text describing the incidence
 * - "type": Indicates the type or reason for the incidence
 * - "isCompleted": Uses a colored badge to show whether the incidence is completed or under review
 * - "userId": Displays the user ID associated with the incidence
 * - "date": Shows the date the incidence was created
 * - "actions": Contains a "Completar" button that is only active when the incidence is not completed
 */
const columns: ColumnDef<Incidence>[] = [
  {
    accessorKey: "description",
    header: "Descripción",
  },
  {
    accessorKey: "type",
    header: "Razón",
  },
  {
    accessorKey: "isClosed",
    header: ({ column }) => (
      <div
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="cursor-pointer select-none"
      >
        Estado {column.getIsSorted() === "asc" ? "↑" : column.getIsSorted() === "desc" ? "↓" : ""}
      </div>
    ),
    cell: ({ getValue }) => {
      const completed = getValue<boolean>();
      return (
        <Badge
          className={`px-3 py-1 rounded-full text-white text-sm font-semibold
          ${completed ? "bg-core" : "bg-destructive"}`}
        >
          {completed ? "Completado" : "En revisión"}
        </Badge>
      );
    },
    sortingFn: (rowA, rowB, columnId) => {
      const a = rowA.getValue<boolean>(columnId);
      const b = rowB.getValue<boolean>(columnId);
      return a === b ? 0 : a ? 1 : -1;
    }
  },
  {
    accessorKey: "userId",
    header: "ID usuario",
  },
  {
    accessorKey: "date",
    header: "Fecha",
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => <ActionCell incidence={row.original} />,
  }
];

/**
 * IncidenceList Component
 *
 * Fetches and displays a list of incidences using a data table. Handles loading and error states.
 * Each incidence includes descriptive information and a completion action (if not already completed).
 *
 * Features:
 * - Retrieves data using React Query from the `getAllIncidences` service
 * - Displays a spinner while loading and an error page if there's a failure
 * - Renders a responsive data table with defined columns and row actions
 *
 * @returns {JSX.Element} The rendered component with a table of incidences.
 */
export default function IncidenceList() {
  const { data, isFetching, isError } = useQuery({
    queryKey: ['incidences'],
    queryFn: () => getAllIncidences(),
  });

  if (isFetching) return <SpinnerPage />;
  if (isError) return <ErrorPage />;
  return (
    <div className="min-h-full mx-auto p-4 space-y-8 container">
      <div className="w-full bg-card text-foreground shadow-lg rounded-xl p-5 h-full space-y-4">
        <h2 className="text-xl font-bold text-core">
          Listado de incidencias
        </h2>
        <DataTable columns={columns} data={data ?? []} />
      </div>
    </div>
  );
}


function ActionCell({ incidence }: { readonly incidence: Incidence }) {
  const [isClosing, setIsClosing] = useState(false);
  const queryClient = useQueryClient();

  const completed = incidence.isClosed || isClosing;

  const handleClose = async () => {
    setIsClosing(true);
    try {
      await closeIncidence(incidence.id!);
      await queryClient.invalidateQueries({ queryKey: ['incidences'] });
    } catch (error) {
      console.error("Error al cerrar la incidencia:", error);
      setIsClosing(false);
    }
  };

  return (
    <Button
      onClick={handleClose}
      className={`text-white px-3 py-1 rounded-full text-sm font-medium 
        ${completed ? "bg-gray-400 cursor-not-allowed" : "bg-core hover:bg-core-highlight"}`}
      disabled={completed}
    >
      Completar
    </Button>
  );
}