"use client";
import { getAllIncidences } from "@/app/services/incidences.service";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from '@/components/data-table';
import { Incidence } from "@/app/types/entities/incidence.type";
import { ColumnDef } from "@tanstack/react-table";
import SpinnerPage from "@/components/shared/spinner-page";
import ErrorPage from "@/components/shared/error-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"; 

export const columns: ColumnDef<Incidence>[] = [
  {
    accessorKey: "description",
    header: "Descripción",
  },
  {
    accessorKey: "type",
    header: "Razón",
  },
  {
    accessorKey: "isCompleted",
    header: "Estado",
    cell: ({ row }) => {
      const completed = row.original.isCompleted;
      return (
        <Badge
          className={`px-3 py-1 rounded-full text-white text-sm font-semibold
            ${completed ? "bg-blue-700" : "bg-red-700"}`}
        >
          {completed ? "Completado" : "En revisión"}
        </Badge>
      );
    },
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
    cell: ({ row }) => {
      const completed = row.original.isCompleted;
      return (
        <Button
          className={`text-white px-3 py-1 rounded-full text-sm font-medium 
            ${completed ? "bg-gray-400 cursor-not-allowed" : "bg-core hover:bg-core-highlight"}`}
          disabled={completed}
        >
          Completar
        </Button>
      );
    },
  },
];


export default function IncidenceList() {
  const { data, isFetching, isError } = useQuery({
    queryKey: ['incidences'],
    queryFn: () => getAllIncidences(),
  });
  if (isFetching) return <SpinnerPage />
  if (isError) return <ErrorPage />
  return (
    <div className="min-h-full mx-auto p-4 space-y-8 container">
      <div className="w-full bg-white shadow-lg rounded-xl p-5 h-full space-y-4">
        <h2 className="text-xl font-bold text-core">
          Listado de incidencias
        </h2>
        <DataTable columns={columns} data={data ?? []} />
      </div>
    </div>
  ) 
}

