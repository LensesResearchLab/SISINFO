"use client";

import {
  TriangleAlert,
  Search,
  ChevronDown,
  ChevronUp,
  Upload,
  Download,
  Calendar,
  Circle,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { getThesisByProfessor } from "@/app/services/thesis.service";
import { useProfessorThesisListStore } from "./store";
import { Thesis } from "@/app/types/thesis.type";
import SpinnerPage from "@/components/shared/spinner-page";
import { useEffect } from "react";
import AlphabeticSortButton from "@/components/shared/alphabetic-sort-button";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/app/routes";

export default function ThesisProjects() {
  const reset = useProfessorThesisListStore((state) => state.reset);
  const sortDirection = useProfessorThesisListStore(
    (state) => state.sortDirection
  );
  useEffect(() => {
    return reset;
  }, [reset]);
  const searchQuery = useProfessorThesisListStore((state) => state.searchQuery);

  const {
    data: thesisList,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["professor-thesis-projects"],
    queryFn: () => getThesisByProfessor(),
  });

  if (isFetching) return <SpinnerPage />;
  if (error || !thesisList) return <ThesisListNotFound />;

  const sortedThesisList: Thesis[] = thesisList.sort(
    (a, b) => a.title.localeCompare(b.title) * sortDirection
  );

  const filteredProjects = searchQuery
    ? sortedThesisList.filter((thesis) =>
      thesis.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : sortedThesisList;

  return (
    <div className="min-h-full mx-auto p-4 space-y-8 container max-w-3xl">
      <div className="w-full bg-card shadow-lg rounded-xl p-5 h-full space-y-4">
        <TableActionButtons />
        <ThesisTable filteredProjects={filteredProjects} />
      </div>
    </div>
  );
}

function TableActionButtons() {
  const searchQuery = useProfessorThesisListStore((state) => state.searchQuery);
  const setSearchQuery = useProfessorThesisListStore(
    (state) => state.setSearchQuery
  );
  const sortDirection = useProfessorThesisListStore(
    (state) => state.sortDirection
  );
  const toggleSortDirection = useProfessorThesisListStore(
    (state) => state.toggleSortDirection
  );
  const router = useRouter();
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
      <Button
        className="bg-core hover:bg-core-highlight text-white"
        onClick={() =>
          router.push(
            `${ROUTES.HOME}/${ROUTES.PROFESSOR_UNDERGRADUATE_THESIS_NEW}`
          )
        }
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
      <AlphabeticSortButton
        onclick={toggleSortDirection}
        sortDirection={sortDirection}
      />
    </div>
  );
}

function ThesisTable({ filteredProjects }: { readonly filteredProjects: Thesis[] }) {
  return (
    <div className="border-x border-t rounded-md overflow-hidden">
      <TableHeaders />
      {filteredProjects.map((thesis) => (
        <TableRow key={thesis.id} thesis={thesis} />
      ))}
    </div>
  );
}

function TableHeaders() {
  return (
    <div className="bg-core text-white grid grid-cols-12 p-3">
      <div className="col-span-4 font-medium">Tema del proyecto</div>
      <div className="col-span-2 font-medium">Categoria</div>
      <div className="col-span-3 font-medium">Ver detalle</div>
      <div className="col-span-2 font-medium">Estado</div>
    </div>
  );
}

function TableRow({ thesis }: { readonly thesis: Thesis }) {
  const router = useRouter();
  const expandedProject = useProfessorThesisListStore(
    (state) => state.expandedProject
  );
  const toggleExpandedProject = useProfessorThesisListStore(
    (state) => state.toggleExpandedProject
  );
  const handleClickDetail = () => {
    router.push(
      `${ROUTES.HOME}/${ROUTES.PROFESSOR_UNDERGRADUATE_THESIS_LIST}/${thesis.id}`
    );
  }
  const handleClickApplicants = () => {
    router.push(
      `${ROUTES.HOME}/${ROUTES.PROFESSOR_UNDERGRADUATE_THESIS_LIST}/${thesis.id}/${ROUTES.APPLICANTS}`
    );
  }
  return (
    <div key={thesis.id}>
      <div className="grid grid-cols-12 p-1 items-center text-primary border-b ">
        <div className="col-span-4">{thesis.title}</div>
        <div className="col-span-2">{thesis.description}</div>
        <div className="col-span-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleClickDetail()}
          >
            <Search className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleClickApplicants()}
          >
            <Users className="w-5 h-5" />
          </Button>
        </div>
        <div className="col-span-2">
          <TriangleAlert />
        </div>
        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleExpandedProject(thesis.id)}
          >
            {expandedProject === thesis.id ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
      {expandedProject === thesis.id && <TableRowDetail thesis={thesis} />}
    </div>
  );
}

function TableRowDetail({ thesis }: { readonly thesis: Thesis }) {
  return (
    <div>
      <div className="grid grid-cols-12 border-b px-3 text-primary">
        <div className="col-span-4 font-medium">Nombre del estudiante</div>
        <div className="col-span-4 font-medium">Estado</div>
        <div className="col-span-4 font-medium">Fecha de la solicitud</div>
      </div>
      {thesis.students?.map((student) => (
        <div key={student.user.id} className="bg-subtable  text-primary border-b">
          <div className="grid grid-cols-12 py-2 px-3">
            <div className="col-span-4">{student.user.name}</div>
            <div className="col-span-4">{student.user.name}</div>
            <div className="col-span-4">{student.user.name}</div>
          </div>
          <div className="px-3 border-t border-gray-100">
            <StudentActionButtons />
          </div>
        </div>
      ))}
    </div>
  );
}

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

function StudentActionButtons() {
  return (
    <div className="flex flex-wrap gap-2 py-2 mx-auto justify-center">
      <Button
        variant="outline"
        size="sm"
        className="text-xs flex items-center gap-1.5 h-8 px-3"
      >
        <span className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-[11px] font-medium">
          30
        </span> {' '}
        30%
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="text-xs flex items-center gap-1.5 h-8 px-3"
      >
        <Download className="h-4 w-4" />
        Afiche
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="text-xs flex items-center gap-1.5 h-8 px-3"
      >
        <Calendar className="h-4 w-4" />
        Pendiente
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="text-xs flex items-center gap-1.5 h-8 px-3"
      >
        <Calendar className="h-4 w-4" />
        Especial pendiente
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="text-xs flex items-center gap-1.5 h-8 px-3"
      >
        <Upload className="h-4 w-4" />
        Subir notas
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="text-xs flex items-center gap-1.5 h-8 px-3"
      >
        <Circle className="h-4 w-4 text-red-500 fill-current" />
        ABET
      </Button>
    </div>
  );
}



