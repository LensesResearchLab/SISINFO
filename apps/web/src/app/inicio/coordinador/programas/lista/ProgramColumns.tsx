import { ColumnDef } from "@tanstack/react-table"
import { Course } from "@/app/types/entities/billboard.type"
import { Eye, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

/**
 * Defines the table columns for displaying courses with program status and main professor.
 *
 * @param {Function} handleDetail - Callback triggered when the action button is clicked
 * @returns {ColumnDef<Course>[]} Array of column definitions
 */
export const getProgramColumns = (handleDetail: (id: string) => void, handleDownload: (course: Course) => void): ColumnDef<Course>[] => [
  {
    accessorKey: "name",
    header: "Clase",
    cell: ({ row }) => <span className="font-semibold text-primary">{row.original.name}</span>,
    enableSorting: true,
  },
  {
    accessorKey: "code",
    header: "Código",
    cell: ({ row }) => <span className="text-primary">{row.original.code}</span>,
    enableSorting: true,
  },
  {
    id: "status",
    accessorFn: (course) => (course.program ? "Cargado" : "Pendiente"),
    header: "Estado",
    cell: ({ row }) => (
      <span className="text-primary">
        {String(row.getValue("status"))}
      </span>
    ),
    enableSorting: true,
  },
  {
    id: "professor",
    accessorFn: (course) => course.mainProfessor?.user?.name || "Profesor no asignado",
    header: "Profesor",
    cell: ({ row }) => (
      <span className="text-primary">
        {String(row.getValue("professor"))}
      </span>
    ),
    enableSorting: true,
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => (
      <div className="flex gap-1">
        <Button variant="ghost" size="icon" title="Ver programa" onClick={() => handleDetail(row.original.id)}><Eye /></Button>
        {row.original.program && <Button variant="ghost" size="icon" title="Descargar programa" onClick={() => handleDownload(row.original)}><Download /></Button>}
      </div>
    ),
  },
]
