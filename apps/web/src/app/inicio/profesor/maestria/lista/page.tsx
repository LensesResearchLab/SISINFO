"use client";

import {
  Search,
  ChevronDown,
  ChevronUp,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
    staleTime: 1000 * 60 * 5,
  });

  if (isFetching) return <SpinnerPage />;
  if (error || !thesisList) return <ThesisListNotFound />;

  const sortedThesisList = thesisList.sort(
    (a, b) => a.title.localeCompare(b.title) * sortDirection
  );

  const filteredProjects = searchQuery
    ? sortedThesisList.filter((thesis) =>
        thesis.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : sortedThesisList;

  return (
    <div className="min-h-full mx-auto p-4 space-y-8 container max-w-[1100px]">
      <div className="w-full bg-card shadow-lg rounded-xl p-5 h-full space-y-4">
        <ProfessorActionButtons />
        <ThesisTable filteredProjects={filteredProjects} />
      </div>
    </div>
  );
}

function ProfessorActionButtons() {
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
            `${ROUTES.HOME}/${ROUTES.PROFESSOR_POSTGRADUATE_THESIS_NEW}`
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

function ThesisTable({ filteredProjects }: { filteredProjects: Thesis[] }) {
  return (
    <div className="border rounded-md overflow-hidden">
      <TableHeaders />
      {filteredProjects.map((thesis) => (
        <TableRow key={thesis.id} thesis={thesis} />
      ))}
    </div>
  );
}

function TableHeaders() {
  return (
    <div className="bg-core text-white grid grid-cols-12 p-3 items-center">
      <div className="col-span-1">
        <Checkbox className="border-white data-[state=checked]:bg-white data-[state=checked]:text-core" />
      </div>
      <div className="col-span-3 font-medium">Tema del proyecto</div>
      <div className="col-span-3 font-medium">Subarea de investigación</div>
      <div className="col-span-2 font-medium">Asesor</div>
      <div className="col-span-2 font-medium">Periodo</div>
      <div className="col-span-1 font-medium">Ver estudiantes</div>
    </div>
  );
}

function TableRow({ thesis }: { thesis: Thesis }) {
  const expandedProject = useProfessorThesisListStore(
    (state) => state.expandedProject
  );
  const toggleExpandedProject = useProfessorThesisListStore(
    (state) => state.toggleExpandedProject
  );
  return (
    <div key={thesis.id}>
      <div className="grid grid-cols-12 p-3 items-center text-primary border-b ">
        <div className="col-span-1">
          <Checkbox />
        </div>
        <div className="col-span-3">{thesis.title}</div>
        <div className="col-span-3">{thesis.title}</div>
        <div className="col-span-2">{thesis.professor.user.name}</div>
        <div className="col-span-2">{2025 - 10}</div>
        <div className="col-span-1 flex justify-center">
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

function TableRowDetail({ thesis }: { thesis: Thesis }) {
  const router = useRouter();
  const handleClickEye = (id: string) => {
    router.push(
      `${ROUTES.HOME}/${ROUTES.PROFESSOR_POSTGRADUATE_THESIS_STUDENT}/${id}`
    );
  };
  return (
    <div>
      <div className="grid grid-cols-12 border-b py-2 px-3 text-primary">
        <div className="col-span-3 font-medium">Nombre del estudiante</div>
        <div className="col-span-3 font-medium">Estado</div>
        <div className="col-span-3 font-medium">Fecha de la solicitud</div>
        <div className="col-span-3 font-medium">Ver</div>
      </div>
      {thesis.students?.map((student) => (
        <div key={student.user.id} className="bg-subtable  text-primary border-b">
          <div className="grid grid-cols-12 py-2 px-3 ">
            <div className="col-span-3">{student.user.name}</div>
            <div className="col-span-3">{student.user.name}</div>
            <div className="col-span-3">{student.user.name}</div>
            <Eye
              className="col-span-3 cursor-pointer"
              onClick={() => handleClickEye(student.user.id)}
            ></Eye>
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
