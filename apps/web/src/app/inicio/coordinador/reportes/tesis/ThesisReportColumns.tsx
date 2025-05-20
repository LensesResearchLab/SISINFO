import { ColumnDef } from "@tanstack/react-table";
import { ThesisReport } from "@/app/types/thesis-report.type";

/**
 * Column definitions for the Thesis 1 report DataTable
 */
export const columns: ColumnDef<ThesisReport>[] = [
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
    accessorKey: "thesis_investigation_subarea",
    header: "Subárea",
  },
  {
    accessorKey: "thesis_title",
    header: "Tema Tesis",
  },
  {
    accessorKey: "status",
    header: "Estado",
  },
  {
    accessorKey: "thesis_grade",
    header: "Calificación",
  },
];