/**
 * @module ThesisProjects
 * @description
 * Displays a searchable and sortable list of postgraduate thesis projects associated with the logged-in professor.
 * Includes interactive rows that expand to reveal student application information for each thesis.
 *
 * @returns {JSX.Element} The rendered view of thesis projects, organized in a DataTable-like layout.
 *
 * @remarks
 * This component fetches theses via the professor's ID and enables filtering via search bar and alphabetic sorting.
 * Each thesis project includes subarea, advisor, period, and student application data (loaded on expand).
 *
 * @see {@link getThesesByProfessor} to fetch thesis list
 * @see {@link getApplicationsByThesisId} for student applications
 */

"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Search, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/data-table";
import SpinnerPage from "@/components/shared/spinner-page";
import AlphabeticSortButton from "@/components/shared/alphabetic-sort-button";
import { getThesesByProfessor, getApplicationsByThesisId } from "@/app/services/thesis.service";
import { useProfessorThesisListStore } from "./store";
import { getUserInfo } from "@/app/auth/auth-service";
import { ColumnDef } from "@tanstack/react-table";
import { ROUTES } from "@/app/routes";
import { Thesis } from "@/app/types/entities/thesis.type";

export default function ThesisProjects() {
  const reset = useProfessorThesisListStore((state) => state.reset);
  const sortDirection = useProfessorThesisListStore((state) => state.sortDirection);
  const searchQuery = useProfessorThesisListStore((state) => state.searchQuery);
  const setSearchQuery = useProfessorThesisListStore((state) => state.setSearchQuery);
  const toggleSortDirection = useProfessorThesisListStore((state) => state.toggleSortDirection);
  const router = useRouter();

  useEffect(() => reset, [reset]);

  const {
    data: thesisList,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["theses-professor-list"],
    queryFn: async () => {
      const userData = await getUserInfo();
      return getThesesByProfessor(userData.user.id);
    },
  });

  if (isFetching) return <SpinnerPage />;
  if (error || !thesisList) return <ThesisListNotFound />;

  const sortedList = thesisList.sort((a, b) => a.title.localeCompare(b.title) * sortDirection);
  const filtered = searchQuery
    ? sortedList.filter((t) => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : sortedList;

  const columns: ColumnDef<Thesis>[] = [
    {
      accessorKey: "title",
      header: "Tema del Proyecto",
      cell: ({ row }) => <ThesisSpan text={row.original.title} />,
    },
    {
      accessorKey: "investigationSubarea",
      header: "Subárea de Investigación",
    },
    {
      accessorKey: "professor.user.name",
      header: "Asesor",
      cell: ({ row }) => row.original.professor.user.name,
    },
    {
      accessorKey: "period",
      header: "Período",
      cell: ({ row }) => row.original.period ? `${row.original.period.year}-${row.original.period.period}` : "",
    },
    {
      id: "actions",
      header: "Estudiantes",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`${ROUTES.HOME}/${ROUTES.PROFESSOR_POSTGRADUATE_THESIS_STUDENT}/${row.original.id}`)}
        >
          <Eye className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-full mx-auto p-4 space-y-8 container max-w-[1100px]">
      <div className="w-full bg-card shadow-lg rounded-xl p-5 h-full space-y-4">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
          <Button
            className="bg-core hover:bg-core-highlight text-white"
            onClick={() => router.push(`${ROUTES.HOME}/${ROUTES.PROFESSOR_POSTGRADUATE_THESIS_NEW}`)}
          >
            Crear tema
          </Button>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar una tesis"
              className="pl-10 border-gray-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <AlphabeticSortButton onclick={toggleSortDirection} sortDirection={sortDirection} />
        </div>
        <DataTable columns={columns} data={filtered} />
      </div>
    </div>
  );
}

function ThesisSpan({ text }: { readonly text: string }) {
  return (
    <span className="text-primary font-medium">
      {text}
    </span>
  );
}

/**
 * @function ThesisListNotFound
 * @description UI component shown when no thesis projects are available for the professor.
 * @returns {JSX.Element} Informational message indicating no data.
 */
function ThesisListNotFound() {
  return (
    <div className="min-h-full mx-auto p-4 space-y-8 container max-w-[900px]">
      <div className="w-full bg-white shadow-lg rounded-xl p-5 h-full space-y-4">
        <h2 className="text-xl font-bold text-gray-800">
          No se encontraron proyectos de tesis
        </h2>
        <p className="text-gray-600">
          No se pudieron encontrar proyectos de tesis para el profesor
        </p>
      </div>
    </div>
  );
}
