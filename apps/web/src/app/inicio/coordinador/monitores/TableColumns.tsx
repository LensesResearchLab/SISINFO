import { TeachingAssistantshipRow } from "@/app/types/teachingAssistantshipRow.type";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<TeachingAssistantshipRow>[] = [
    {
      accessorKey: "studentCode",
      header: 'Código del Estudiante',
      enableSorting: true,
    },
    {
      accessorKey: "studentName",
      header: 'Nombre del Estudiante',
      enableSorting: true,
    },
    {
      accessorKey: "professorsName",
      header: 'Profesores',
      cell: ({ row }) => row.original.professorsName.join(", "),
      enableSorting: true,
    },
    {
      accessorKey: "courseCode",
      header: 'Código del Curso',
      enableSorting: true,
    },
    {
      accessorKey: "section",
      header: 'Sección',
      enableSorting: true,
    },
  ];
  