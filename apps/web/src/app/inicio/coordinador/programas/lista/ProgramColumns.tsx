import { ColumnDef } from "@tanstack/react-table"
import { Course } from "@/app/types/entities/billboard.type"
import { Eye} from "lucide-react"
import { Button } from "@/components/ui/button"

/**
 * Defines the table columns for displaying courses with program status and main professor.
 *
 * @param {Function} handleDetail - Callback triggered when the action button is clicked
 * @returns {ColumnDef<Course>[]} Array of column definitions
 */
export const getProgramColumns = (handleDetail: (id: string) => void): ColumnDef<Course>[] => [
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
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleDetail(row.original.id)}
      >
        
        <Eye></Eye>
      </Button>
    ),
  },
]
