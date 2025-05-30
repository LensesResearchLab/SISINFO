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
} from "@/components/ui/table";
import { ROUTES } from "@/app/routes";
import SpinnerPage from "@/components/shared/spinner-page";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getGraduatedAssistance } from "@/app/services/assistance.service";
import { GraduatedAssistance } from "@/app/types/entities/graduated-assistance.type";
import { useQuery } from "@tanstack/react-query";
import { getPeriods } from "@/app/services/period.service";

interface AssistanceListProps {
  readonly professorName?: string;
  readonly role: "estudiante" | "profesor";
}

interface FilterBarProps {
  readonly selectedSemester: string;
  readonly setSelectedSemester: (value: string) => void;
  readonly nameFilter: string;
  readonly setNameFilter: (value: string) => void;
  readonly showOnlyMyAssistance: boolean;
  readonly setShowOnlyMyAssistance: (value: boolean) => void;
  readonly role: "estudiante" | "profesor";
  readonly sorting: { id: string; desc: boolean }[];
  readonly setSorting: React.Dispatch<
    React.SetStateAction<{ id: string; desc: boolean }[]>
  >;
}

const formatDate = (date: Date) => (date ? date.toLocaleDateString() : "-");

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
  const { data: semesters } = useQuery({
    queryKey: ["undergraduate-semesters"],
    queryFn: getPeriods,
  });

  return (
    <div className="flex flex-wrap gap-4 mb-6 items-center justify-between ">
      <div className="flex flex-wrap gap-4 items-center">
        <Select value={selectedSemester} onValueChange={setSelectedSemester}>
          <SelectTrigger className="w-[250px] text-primary">
            <SelectValue placeholder="Elige un semestre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los semestres</SelectItem>
            {Array.isArray(semesters) &&
              semesters.map((semester: string) => (
                <SelectItem value={semester} key={semester}>
                  {semester}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        <div className="relative w-[300px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-primary" />
          <Input
            placeholder="Buscar una asistencia"
            className="pl-9 text-primary"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
        </div>

        {role === "profesor" && (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={!showOnlyMyAssistance}
              onChange={(e) => setShowOnlyMyAssistance(!e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
            />
            <span className="text-sm font-medium text-gray-700">
              Mostrar todas
            </span>
          </label>
        )}
      </div>
      <Button
        onClick={() =>
          setSorting((prev) => [{ id: "title", desc: !prev[0].desc }])
        }
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

export function AssistanceList({
  professorName,
  role = "estudiante",
}: AssistanceListProps) {
  const [data, setData] = React.useState<GraduatedAssistance[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedSemester, setSelectedSemester] = React.useState("all");
  const [showOnlyMyAssistance, setShowOnlyMyAssistance] = React.useState(false);
  const [nameFilter, setNameFilter] = React.useState("");
  const [sorting, setSorting] = React.useState([{ id: "title", desc: false }]);
  const router = useRouter();

  const handleClick = React.useCallback(
    (id: string) => {
      const path =
        role === "profesor"
          ? `${ROUTES.HOME}/${ROUTES.PROFESSOR_ASSISTANCE_LIST_EDIT}/${id}`
          : `${ROUTES.HOME}/${ROUTES.ASSISTANCE_LIST}/${id}`;
      router.push(path);
    },
    [role, router]
  );

  const columns = React.useMemo<ColumnDef<GraduatedAssistance>[]>(
    () => [
      { accessorKey: "title", header: "Nombre" },
      { accessorKey: "category", header: "Clasificación" },
      { accessorKey: "professor.user.name", header: "Oferente" },
      {
        accessorKey: "startDate",
        header: "Fecha publicación",
        cell: ({ getValue }) => formatDate(new Date(getValue() as string)),
      },
      {
        accessorKey: "endDate",
        header: "Fecha fin",
        cell: ({ getValue }) => formatDate(new Date(getValue() as string)),
      },
      {
        id: "ver",
        header: "Ver",

        cell: ({ row }) => {
          // For student role, always show the button
          // For professor role, only show if it's their own assistance
          const isOwnAssistance =
            role === "estudiante" ||
            (professorName &&
              row.original.professor.user.name === professorName);

          return isOwnAssistance ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleClick(row.original.id)}
              className="cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </Button>
          ) : (
            <span className="text-gray-400">-</span>
          );
        },
      },
    ],
    [role, professorName, handleClick]
  );

  useEffect(() => {
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
    // First filter by semester
    let result =
      selectedSemester === "all"
        ? data
        : data.filter((item) => {
            const date = new Date(item.startDate);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const semester = month <= 6 ? "10" : "20";
            const formattedSemester = `${year}${semester}`;
            return formattedSemester === selectedSemester;
          });

    if (nameFilter) {
      result = result.filter((item) =>
        item.title.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }
    return result;
  }, [selectedSemester, data, nameFilter]);

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
      <div className="bg-card rounded-lg shadow-lg p-6">
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
            <TableHeader className="bg-core">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="text-card font-bold py-3"
                    >
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
                  <TableRow key={row.id} className="text-primary">
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
                    className="h-24 text-center text-primary"
                  >
                    No se encontraron resultados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
