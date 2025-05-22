/**
 * @module UndergraduateProjects
 * @description
 * Displays a searchable and sortable list of undergraduate thesis projects associated with the logged-in professor.
 * Includes a table of thesis topics, categories, advisor names, periods, and a button to view student applications.
 *
 * @returns {JSX.Element} The rendered view of thesis projects using the DataTable component.
 *
 * @remarks
 * This component fetches undergraduate thesis projects from the professor ID using `getProjectsByProfessor`.
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
import { getProjectsByProfessor } from "@/app/services/project.service";
import { useProfessorThesisListStore } from "./store";
import { getUserInfo } from "@/app/auth/auth-service";
import { ColumnDef } from "@tanstack/react-table";
import { ROUTES } from "@/app/routes";
import { Project } from "@/app/types/entities/project.type";

export default function UndergraduateProjects() {
  const reset = useProfessorThesisListStore((state) => state.reset);
  const sortDirection = useProfessorThesisListStore((state) => state.sortDirection);
  const searchQuery = useProfessorThesisListStore((state) => state.searchQuery);
  const setSearchQuery = useProfessorThesisListStore((state) => state.setSearchQuery);
  const toggleSortDirection = useProfessorThesisListStore((state) => state.toggleSortDirection);
  const router = useRouter();

  useEffect(() => reset, [reset]);

  const {
    data: projectList,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["projects-professor-list"],
    queryFn: async () => {
      const userData = await getUserInfo();
      return getProjectsByProfessor(userData.user.id);
    },
  });

  if (isFetching) return <SpinnerPage />;
  if (error || !projectList) return <ProjectListNotFound />;

  const sortedList = projectList.sort((a, b) => a.title.localeCompare(b.title) * sortDirection);
  const filtered = searchQuery
    ? sortedList.filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : sortedList;

  const columns: ColumnDef<Project>[] = [
    {
      accessorKey: "title",
      header: "Tema del Proyecto",
      cell: ({ row }) => <span className="font-medium">{row.original.title}</span>,
    },
    {
      accessorKey: "description",
      header: "Categoría",
    },
    {
      accessorKey: "professor.user.name",
      header: "Asesor",
      cell: ({ row }) => row.original.professor?.user?.name ?? "-",
    },
    {
      accessorKey: "period",
      header: "Período",
      cell: ({ row }) => row.original.period ? `${row.original.period.year}-${row.original.period.period}` : "",
    },
    {
      id: "actions",
      header: "Detalle",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            router.push(`${ROUTES.HOME}/${ROUTES.PROFESSOR_UNDERGRADUATE_THESIS_LIST}/${row.original.id}`)
          }
        >
          <Eye className="w-4 h-4" />
        </Button>
      ),
    },
    {
      id: "aplicantes",
      header: "Estudiantes",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            router.push(`${ROUTES.HOME}/${ROUTES.PROFESSOR_UNDERGRADUATE_THESIS_LIST}/${row.original.id}/aplicantes`)
          }
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
            onClick={() => router.push(`${ROUTES.HOME}/${ROUTES.PROFESSOR_UNDERGRADUATE_THESIS_NEW}`)}
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

/**
 * @function ProjectListNotFound
 * @description UI component shown when no thesis projects are available for the professor.
 * @returns {JSX.Element} Informational message indicating no data.
 */
function ProjectListNotFound() {
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