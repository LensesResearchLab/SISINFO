"use client";
import * as React from "react";
import {
  type ColumnDef,
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
} from "@/components/ui/table"
import { getGraduatedAssistance } from "@/app/inicio/estudiante/asistencia/services/assistance.service";
import { Assistance } from "@/app/inicio/estudiante/asistencia/types/assistance.type";
import Link from "next/link"
import { ROUTES } from "@/app/routes";
import SpinnerPage from "@/components/shared/spinner-page";

const semesters = [
  { value: "all", label: "Todos los semestres" },
  { value: "2025-01", label: "2025-01" },
  { value: "2025-02", label: "2025-02" },
] as const;

interface AssistanceListProps {
  professorName?: string;
  role: "student" | "professor";
}

interface FilterBarProps {
  selectedSemester: string;
  setSelectedSemester: (value: string) => void;
  nameFilter: string;
  setNameFilter: (value: string) => void;
  showOnlyMyAssistance: boolean;
  setShowOnlyMyAssistance: (value: boolean) => void;
  role: "student" | "professor";
  sorting: { id: string; desc: boolean }[];
  setSorting: React.Dispatch<React.SetStateAction<{ id: string; desc: boolean }[]>>;
}

const formatDate = (date: Date) => date ? date.toLocaleDateString() : "-";

/**
 * FilterBar Component
 * 
 * Renders the filtering controls for the assistance list.
 * Includes semester selection, name search, and professor filter.
 */
function FilterBar({
  selectedSemester,
  setSelectedSemester,
  nameFilter,
  setNameFilter,
  showOnlyMyAssistance,
  setShowOnlyMyAssistance,
  role,
  sorting,
  setSorting,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-4 mb-6 items-center justify-between">
      <div className="flex flex-wrap gap-4 items-center">
        <Select
          value={selectedSemester}
          onValueChange={setSelectedSemester}
        >
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Elige un semestre" />
          </SelectTrigger>
          <SelectContent>
            {semesters.map(({ value, label }) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="relative w-[300px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar una asistencia"
            className="pl-9"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
        </div>

        {role === "professor" && (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={!showOnlyMyAssistance}
              onChange={(e) => setShowOnlyMyAssistance(!e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
            />
            <span className="text-sm font-medium text-gray-700">Mostrar todas</span>
          </label>
        )}
      </div>

      <Button
        onClick={() => setSorting(prev => [{ id: "name", desc: !prev[0].desc }])}
        className="bg-[#075985] text-white hover:bg-[#075985]"
      >
        <span className="mr-1">{sorting[0].desc ? "Z - A" : "A - Z"}</span>
        <ChevronDown className="h-4 w-4" />
      </Button>
    </div>
  );
}

/**
 * AssistanceList Component
 *
 * This component displays a list of graduated assistance programs in a table format.
 * It fetches the assistance data and allows users to filter, sort, and search through the list.
 *
 * @returns {JSX.Element} A table displaying graduated assistance programs with filtering, sorting, and pagination.
 */
export default function AssistanceList({
  professorName,
  role = "student",
}: AssistanceListProps) {
  const [data, setData] = React.useState<Assistance[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedSemester, setSelectedSemester] = React.useState("all");
  const [showOnlyMyAssistance, setShowOnlyMyAssistance] = React.useState(false);
  const [nameFilter, setNameFilter] = React.useState("");
  const [sorting, setSorting] = React.useState([{ id: "name", desc: false }]);

  const columns = React.useMemo<ColumnDef<Assistance>[]>(() => [
    { accessorKey: "name", header: "Nombre" },
    { accessorKey: "clasification", header: "Clasificación" },
    { accessorKey: "professor", header: "Oferente" },
    {
      accessorKey: "publication_date",
      header: "Fecha publicación",
      cell: ({ getValue }) => formatDate(getValue() as Date),
    },
    {
      accessorKey: "end_date",
      header: "Fecha fin",
      cell: ({ getValue }) => formatDate(getValue() as Date),
    },
    {
      id: "ver",
      header: "Ver",
      cell: ({ row }) => (
        <Link
          href={`/home/graduated-assistance/assistance-list${role === "professor" ? "/manage/" : "/"}${row.original.id}`}
          className="inline-flex items-center justify-center text-[#075985] hover:text-[#075985]"
        >
          <Search className="w-5 h-5" />
        </Link>
      ),
    },
  ], [role]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const assistanceData = await getGraduatedAssistance();
        setData(assistanceData);
      } catch (error) {
        console.error("Error fetching assistance data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredData = React.useMemo(() => {
    return data.filter(item => {
      if (selectedSemester !== "all" && item.start_semester !== selectedSemester) {
        return false;
      }
      if (role === "professor" && showOnlyMyAssistance && professorName && item.professor !== professorName) {
        return false;
      }
      if (nameFilter) {
        const searchTerm = nameFilter.toLowerCase();
        return item.name.toLowerCase().includes(searchTerm);
      }
      return true;
    });
  }, [data, selectedSemester, showOnlyMyAssistance, professorName, nameFilter, role]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting },
    onSortingChange: setSorting,
    initialState: {
      pagination: {
        pageSize: 10,
        pageIndex: 0,
      },
    },
  });

  if (isLoading) {
    return <SpinnerPage />;
  }

  return (
    <div className="min-h-full min-w-full p-20">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <FilterBar
          selectedSemester={selectedSemester}
          setSelectedSemester={setSelectedSemester}
          nameFilter={nameFilter}
          setNameFilter={setNameFilter}
          showOnlyMyAssistance={showOnlyMyAssistance}
          setShowOnlyMyAssistance={setShowOnlyMyAssistance}
          role={role}
          sorting={sorting}
          setSorting={setSorting}
        />

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader className="bg-[#075985]">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="text-white font-bold py-3">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No se encontraron resultados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            className="bg-card text-primary"
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            className="bg-card text-primary"
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
