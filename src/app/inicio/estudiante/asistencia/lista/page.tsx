"use client";
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
import {ChevronDown, Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { getGraduatedAssistance } from "@/app/inicio/estudiante/asistencia/services/assistance.service";
import { Assistance } from "@/app/inicio/estudiante/asistencia/types/assistance.type";
import Link from "next/link"
import { ROUTES } from "@/app/routes";


// Columns declarations, headers and keys
export const columns: ColumnDef<Assistance>[] = [
    {
      accessorKey: "name",
      header: "Nombre",
    },
    {
      accessorKey: "clasification",
      header: "Clasificacion",
    },
    {
      accessorKey: "professor",
      header: "Oferente",
    },
    {
      accessorKey: "publication_date",
      header: "Fecha de publicacion",
      cell: ({ getValue }) => {
        const date = getValue() as Date; 
        return date ? date.toLocaleDateString() : "-"; 
      }
    },
    {
      accessorKey: "end_date",
      header: "Fecha fin",
      cell: ({ getValue }) => {
        const date = getValue() as Date; 
        return date ? date.toLocaleDateString() : "-"; 
      }
    },
    {
      id: "ver",
      header: "Ver",
      cell: ({ row }) => {
        return (
          <Link
            href={`${ROUTES.HOME}/${ROUTES.ASSISTANCE_LIST}/${row.original.id}`}
            className="inline-flex items-center justify-cente hover:underline">
            <Search className="w-5 h-5 text-core" />
          </Link>
        );
      },
    }
  ];




/**
 * AssistanceList Component
 * 
 * This component displays a list of graduated assistance programs in a table format.
 * It fetches the assistance data and allows users to filter, sort, and search through the list.
 * 
 * States:
 * - sorting: Controls column sorting state
 * - columnFilters: Stores active filters for table columns
 * - columnVisibility: Tracks visibility of table columns
 * - rowSelection: Manages selected rows in the table
 * - data: Stores the fetched assistance data
 * - selectedSemester: Filters the table by selected semester
 * 
 * Features:
 * - Fetches assistance data 
 * - Filters assistance programs based on the selected semester
 * - Provides search functionality for filtering by assistance name
 * - Allows sorting and visibility toggling of columns
 * - Pagination controls for navigating through assistance records
 * 
 * Layout:
 * - Full-width container with spacing and padding
 * - Dropdown to filter by semester
 * - Search bar for quick filtering by name
 * - Column visibility dropdown for customizing displayed columns
 * - Paginated table with headers, body, and navigation controls
 * 
 * @returns {JSX.Element} A table displaying graduated assistance programs with filtering, sorting, and pagination.
 */
export default function AssistanceList() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [data, setData] = React.useState<Assistance[]>([]);
  const [selectedSemester, setSelectedSemester] = React.useState<string>("")

  React.useEffect(() => {
    const fetchData = async () => {
      const assistanceData = await getGraduatedAssistance();
      setData(assistanceData);
    };
    fetchData();
  }, []);

  const filteredData = React.useMemo(() => {
    return selectedSemester
      ? data.filter((item) => item.start_semester === selectedSemester)
      : data;
  }, [selectedSemester, data]);
  
  
  

  const table = useReactTable({
    data: filteredData,  
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
  });

  return (
    <div className="min-h-full min-w-full mx-auto p-4 space-y-8">
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-4">
        <Select value={selectedSemester} onValueChange={setSelectedSemester}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Elige un semestre" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="2025-01">2025-01</SelectItem>
          <SelectItem value="2025-02">2025-02</SelectItem>
        </SelectContent>
      </Select>

        </div>
        <div className="flex items-left gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar una asistencia"
              className="pl-8 w-[300px]"
              value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
            />
          </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columnas <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((columns) => columns.getCanHide())
              .map((columns) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={columns.id}
                    className="capitalize"
                    checked={columns.getIsVisible()}
                    onCheckedChange={(value) =>
                      columns.toggleVisibility(!!value)
                    }
                  >
                  {typeof columns.columnDef.header === "string" ? columns.columnDef.header: "Unnamed Column"}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      </div>
      
        
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-core">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead className="text-white font-bold" key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
}
