"use client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { BookOpen, ChevronDown, Tag, User, Users, Eye } from "lucide-react"
import { Separator } from "@radix-ui/react-separator"
import { CategoryTagStatic } from "@/components/shared/category-tag"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export type Application = {
    id: string
    fullName: string
    code: string
    motivation: string
    contacted: boolean
    status: "pending" | "approved" | "rejected"
}

export default function ProjectDetail() {
  const data: Application[] = [
    {
      id: "m5gr84i9",
      fullName: "Ken Sánchez",
      code: "A12345",
      motivation: "Interés en desarrollo de software y pruebas automatizadas",
      contacted: true,
      status: "pending",
    },
    {
      id: "3u1reuv4",
      fullName: "Ana García",
      code: "B67890",
      motivation: "Me gustaria poner en practica mis conocimientos en web",
      contacted: false,
      status: "pending",
    },
    {
      id: "7y2t5g3h",
      fullName: "Luis Pérez",
      code: "C54321",
      motivation: "Interés en arquitectura de software y desarrollo de software",
      contacted: true,
      status: "pending",
    },
    {
      id: "9j4k8l1m",
      fullName: "María López",
      code: "D98765",
      motivation: "Quiero aprender más sobre pruebas automatizadas",
      contacted: false,
      status: "pending",
    },
    {
        id: "2n6p9q8r",
        fullName: "Carlos Ramírez",
        code: "E13579",
        motivation: "Interés en desarrollo de software y pruebas automatizadas",
        contacted: true,
        status: "pending",
        },
        {
        id: "4s7t1u2v",
        fullName: "Laura Torres",
        code: "F24680",
        motivation: "Me gustaría aprender sobre arquitectura de software",
        contacted: false,
        status: "pending",
    },
        
  ]

  return (
    <div className="min-h-full w-full container max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="w-full bg-card shadow-lg rounded-xl p-4 sm:p-6 space-y-4">
        <ThesisCard />
        <DataTableDemo data={data}/>
      </div>
    </div>
  )
}

function ThesisCard() {
    const areasDeInteres = [
        "Pruebas automatizadas",
        "Desarrollo de software",
        "Arquitectura de software",
      ]
    
  return (
    <div className="space-y-3">
      <h2 className="text-lg md:text-xl font-semibold text-core">Titulo de la tesis</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-core shrink-0" />
          <span className="text-sm truncate">
            <span className="font-medium text-core">Profesor: </span>
            Camilo Escobar
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-core shrink-0" />
          <span className="text-sm truncate">
            <span className="font-medium text-core">Número de estudiantes máximos: </span>
            4
          </span>
        </div>

        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-core shrink-0" />
          <span className="text-sm truncate">
            <span className="font-medium text-core">Número de estudiantes aceptados: </span>
            4
          </span>
        </div>
      </div>

      <Separator className="my-3" />

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="text-sm font-medium text-primary">Áreas de interés:</span>
        </div>
        <div className="flex flex-wrap gap-2 mt-1">
          {areasDeInteres.map((area, index) => (
              <CategoryTagStatic key={index} tag={area} />
          ))}
        </div>
      </div>
    </div>
  )
}
  
function DataTableDemo({data}: {data: Application[]}) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [selectedApplication, setSelectedApplication] = React.useState<Application | null>(null)

  const columns = React.useMemo<ColumnDef<Application>[]>(
    () => [
      {
        accessorKey: "fullName",
        header: "Nombre Completo",
        cell: ({ row }) => <div className="font-medium truncate max-w-[150px]">{row.getValue("fullName")}</div>,
      },
      {
        accessorKey: "code",
        header: "Código",
        cell: ({ row }) => <div className="truncate">{row.getValue("code")}</div>,
      },
      {
        id: "details",
        header: "Detalles",
        enableHiding: false,
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedApplication(row.original)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        ),
      },
      {
        id: "actions",
        header: "Acciones",
        enableHiding: false,
        cell: ({ row }) => {
          const application = row.original

          return (
            <div className="flex flex-col lg:flex-row gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="w-full sm:w-auto"
                onClick={() => console.log("Aprobar:", application.id)}
              >
                Aprobar
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="w-full sm:w-auto"
                onClick={() => console.log("Rechazar:", application.id)}
              >
                Rechazar
              </Button>
            </div>
          )
        },
      },
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between py-4 space-y-2 sm:space-y-0">
        <Input
          placeholder="Filtrar por título..."
          value={(table.getColumn("fullName")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("fullName")?.setFilterValue(event.target.value)
          }
          className="w-full sm:max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-full sm:w-auto">
              Columnas <ChevronDown className="ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-core">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-core">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-white">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="text-primary"
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-2 sm:px-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No hay aplicaciones disponibles
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 py-4">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} filas seleccionadas
        </div>
        <div className="flex space-x-2 flex-col sm:flex-row">
          <Button
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="w-full sm:w-auto"
          >
            Anterior
          </Button>
          <Button
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="w-full sm:w-auto"
          >
            Siguiente
          </Button>
        </div>
      </div>

      <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalles de la aplicación</DialogTitle>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Motivación:</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedApplication.motivation}
                </p>
              </div>
              <div className="flex gap-4">
                <div>
                  <h3 className="font-medium mb-2">Contactado:</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedApplication.contacted ? "Sí" : "No"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}