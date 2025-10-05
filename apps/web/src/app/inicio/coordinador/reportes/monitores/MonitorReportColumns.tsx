import { ColumnDef } from "@tanstack/react-table";
import { MonitorReport } from "@/app/types/monitor-report.type";

/**
 * Column definitions for the Monitors report DataTable
 */
export const columns: ColumnDef<MonitorReport>[] = [
  {
    accessorKey: "studentCode",
    header: "Código Estudiante",
  },
  {
    accessorKey: "studentName",
    header: "Nombre Estudiante",
  },
  {
    accessorKey: "courseCode",
    header: "Código Curso",
  },
  {
    accessorKey: "courseName",
    header: "Nombre Curso",
  },
  {
    accessorKey: "section",
    header: "Sección",
  },
  {
    accessorKey: "nrc",
    header: "NRC",
  },
  {
    accessorKey: "professorName",
    header: "Nombre Profesor",
  },
  {
    accessorKey: "professorEmail",
    header: "Correo Profesor",
  },
  {
    accessorKey: "grade",
    header: "Calificación",
  },
  {
    accessorKey: "gradeDescription",
    header: "Descripción Calificación",
  },
];
