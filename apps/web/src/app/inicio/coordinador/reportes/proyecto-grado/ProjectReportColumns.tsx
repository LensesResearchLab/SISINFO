import { ColumnDef } from "@tanstack/react-table";
import { ProjectReport } from "@/app/types/project-report.type";

/**
 * Column definitions for the undergraduate project report.
 */
export const columns: ColumnDef<ProjectReport>[] = [
  {
    accessorKey: "student_code",
    header: "Código",
  },
  {
    accessorKey: "student_name",
    header: "Nombres y apellidos",
  },
  {
    accessorKey: "student_email",
    header: "Correo",
  },
  {
    accessorKey: "professor_name",
    header: "Nombres y apellidos (Asesor)",
  },
  {
    accessorKey: "professor_email",
    header: "Correo (Asesor)",
  },
  {
    accessorKey: "project_title",
    header: "Tema Tesis",
  },
  {
    accessorKey: "status",
    header: "Estado Tesis",
  },
];
