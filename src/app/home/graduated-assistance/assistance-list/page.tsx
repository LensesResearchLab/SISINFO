"use client";
import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getGraduatedAssistance } from "@/app/home/graduated-assistance/services/assistance.service";
import type { Assistance } from "@/app/home/graduated-assistance/types/assistance.type";
import Link from "next/link";

// Segun el rol hay o no checkbox y se redirige distinto al detalle.
const getColumns = (role: "student" | "professor"): ColumnDef<Assistance>[] => [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "clasification",
    header: "Clasificación",
  },
  {
    accessorKey: "professor",
    header: "Oferente",
  },
  {
    accessorKey: "publication_date",
    header: "Fecha publicación",
    cell: ({ getValue }) => {
      const date = getValue() as Date;
      return date ? date.toLocaleDateString() : "-";
    },
  },
  {
    accessorKey: "end_date",
    header: "Fecha fin",
    cell: ({ getValue }) => {
      const date = getValue() as Date;
      return date ? date.toLocaleDateString() : "-";
    },
  },
  {
    id: "ver",
    header: "Ver",
    cell: ({ row }) => {
      const basePath = "/home/graduated-assistance/assistance-list";
      const path =
        role === "professor"
          ? `${basePath}/manage/${row.original.id}`
          : `${basePath}/${row.original.id}`;

      return (
        <Link
          href={path}
          className="inline-flex items-center justify-center text-[#075985] hover:text-[#075985]"
        >
          <Search className="w-5 h-5" />
        </Link>
      );
    },
  },
];

interface AssistanceListProps {
  professorName?: string;
  role: "student" | "professor";
}

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
export default function AssistanceList({
  professorName,
  role = "student",
}: AssistanceListProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [data, setData] = React.useState<Assistance[]>([]);
  const [selectedSemester, setSelectedSemester] = React.useState<string>("");
  const [showOnlyMyAssistance, setShowOnlyMyAssistance] =
    React.useState<boolean>(false);
  const [isAscending, setIsAscending] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      const assistanceData = await getGraduatedAssistance();
      setData(assistanceData);
    };
    fetchData();
  }, []);

  const handleSort = () => {
    setIsAscending((prev) => !prev);
    setSorting([{ id: "name", desc: isAscending }]);
  };

  const filteredData = React.useMemo(() => {
    let filtered = selectedSemester
      ? data.filter((item) => item.start_semester === selectedSemester)
      : data;

    if (role === "professor" && showOnlyMyAssistance && professorName) {
      filtered = filtered.filter((item) => item.professor === professorName);
    }

    return filtered;
  }, [selectedSemester, data, role, showOnlyMyAssistance, professorName]);

  const columns = React.useMemo(() => getColumns(role), [role]);

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
    <div className="min-h-full min-w-full flex-items-center justify-center mx-auto p-20">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="relative w-full md:w-[250px]">
              <Select
                value={selectedSemester}
                onValueChange={setSelectedSemester}
              >
                <SelectTrigger className="w-full cursor-pointer">
                  <SelectValue placeholder="Elige un semestre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className="cursor-pointer" value="2025-01">
                    2025-01
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="2025-02">
                    2025-02
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="relative w-full md:w-[300px]">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar una asistencia"
                className="pl-9 w-full"
                value={
                  (table.getColumn("name")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn("name")?.setFilterValue(event.target.value)
                }
              />
            </div>

            {role === "professor" && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="showAll"
                    checked={!showOnlyMyAssistance}
                    onChange={(e) => setShowOnlyMyAssistance(!e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                  />
                  <label
                    htmlFor="showAll"
                    className="text-sm font-medium text-gray-700"
                  >
                    Mostrar todas
                  </label>
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSort}
                className="h-9 px-3 bg-[#075985] text-white hover:bg-[#075985] rounded-md flex items-center cursor-pointer"
              >
                <span className="mr-1">{isAscending ? "A - Z" : "Z - A"}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader className="bg-[#075985]">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        className="text-white font-bold py-3"
                        key={header.id}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
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
                      <TableCell key={cell.id} className="py-3">
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

        <div className="flex items-center justify-end space-x-2 py-4 mt-4">
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
    </div>
  );
}
