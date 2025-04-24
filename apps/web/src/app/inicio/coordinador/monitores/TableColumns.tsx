import { TeachingAssistantshipRow } from "@/app/types/teachingAssistantshipRow.type";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<TeachingAssistantshipRow>[] = [
    {
      accessorKey: "studentCode",
      header: ({ column }) => (
        <button onClick={() => column.toggleSorting()}>
          Código del Estudiante
        </button>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "contratNumber",
      header: ({ column }) => (
        <button onClick={() => column.toggleSorting()}>
          Número de Contrato
        </button>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "studentName",
      header: ({ column }) => (
        <button onClick={() => column.toggleSorting()}>
          Nombre del Estudiante
        </button>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "professorsName",
      header: ({ column }) => (
        <button onClick={() => column.toggleSorting()}>
          Profesores
        </button>
      ),
      cell: ({ row }) => row.original.professorsName.join(", "),
      enableSorting: true,
    },
    {
      accessorKey: "courseCode",
      header: ({ column }) => (
        <button onClick={() => column.toggleSorting()}>
          Código del Curso
        </button>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "section",
      header: ({ column }) => (
        <button onClick={() => column.toggleSorting()}>
          Sección
        </button>
      ),
      enableSorting: true,
    },
  ];
  