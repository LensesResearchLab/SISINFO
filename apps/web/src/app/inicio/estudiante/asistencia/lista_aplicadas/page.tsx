"use client";
import * as React from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Search } from "lucide-react";
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
import { StatusInformation } from "@/app/types/entities/graduated-assistance.type";
import Link from "next/link";
import { ROUTES } from "@/app/routes";
import SpinnerPage from "@/components/shared/spinner-page";
import { getAssistanceApplications } from "@/app/services/assistance.service";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

/**
 * Column definitions for the AssistanceAppliedList table
 *
 * Defines the structure and behavior of each column in the table,
 * including custom cell rendering for dates and the "Ver" (View) column.
 *
 * @type {ColumnDef<StatusInformation>[]}
 */
const columns: ColumnDef<StatusInformation>[] = [
  {
    id: "title",
    accessorKey: "graduatedAssistance.title",
    header: "Nombre",
  },
  {
    accessorKey: "graduatedAssistance.category",
    header: "Clasificacion",
  },
  {
    accessorKey: "graduatedAssistance.professor.user.name",
    header: "Oferente",
  },
  {
    accessorKey: "graduatedAssistance.startDate",
    header: "Fecha de Inscripcion",
    cell: ({ getValue }) => {
      const dateStr = getValue() as string;
      const date = new Date(dateStr);
      return !isNaN(date.getTime()) ? date.toLocaleDateString() : "-";
    },
  },
  {
    accessorKey: "status",
    header: "Estado",
  },
  {
    id: "ver",
    header: "Ver",
    cell: ({ row }) => {
      console.log(row.original.id); // Application id
      return (
        <Link
          href={`${ROUTES.HOME}/${ROUTES.ASSISTANCE_APPLIED_LIST}/${row.original.id}`}
          className="inline-flex items-center justify-cente hover:underline"
        >
          <Search className="w-5 h-5 text-core" />
        </Link>
      );
    },
  },
];

/**
 * AssistanceAppliedList Component
 *
 * Displays a table of applied graduate assistances with filtering, sorting, and pagination capabilities.
 *
 * Features:
 * - Fetches and displays assistance application data
 * - Allows filtering by semester
 * - Provides search functionality by assistance name
 * - Supports column visibility toggling
 * - Implements table sorting and pagination
 *
 * @returns {JSX.Element} A div containing the assistance applied list table and its controls
 */
export default function AssistanceAppliedList() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [data, setData] = React.useState<StatusInformation[]>([]);
  const [selectedSemester, setSelectedSemester] = React.useState<string>("");

  const { user, isLoading: isAuthLoading } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.id) return;
        const userId = user?.id;
        const assistanceData = await getAssistanceApplications(userId);
        setData(assistanceData);
      } catch (error) {
        console.error("Error fetching assistance data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!isAuthLoading) {
      fetchData();
    }
  }, [isAuthLoading, user]);

  const filteredData = React.useMemo(() => {
    if (!selectedSemester) return data;

    return data.filter((item) => {
      const date = new Date(item.graduatedAssistance.startDate);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const semester = month <= 6 ? "01" : "02";
      const formattedSemester = `${year}-${semester}`;

      return formattedSemester === selectedSemester;
    });
  }, [selectedSemester, data]);

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
    },
  });

  if (isLoading) {
    return <SpinnerPage />;
  }

  return (
    <div className="min-h-full min-w-full p-20">
      <div className="bg-card rounded-lg shadow-lg p-6">
        <div className="min-h-full min-w-full mx-auto p-4 space-y-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <Select
                value={selectedSemester}
                onValueChange={setSelectedSemester}
              >
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
                  value={
                    (table.getColumn("title")?.getFilterValue() as string) ?? ""
                  }
                  onChange={(event) =>
                    table.getColumn("title")?.setFilterValue(event.target.value)
                  }
                />
              </div>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader className="bg-core">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          className="text-card font-bold"
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
                      className="bg-card text-primary"
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
                      className="h-24 text-center bg-card text-primary"
                    >
                      Sin resultados.
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
                className="bg-card  text-primary"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-card text-primary"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
