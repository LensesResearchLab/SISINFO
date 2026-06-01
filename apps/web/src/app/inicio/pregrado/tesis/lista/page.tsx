"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SpinnerPage from "@/components/shared/spinner-page";
import AlphabeticSortButton from "@/components/shared/alphabetic-sort-button";
import { getPeriods } from "@/app/services/period.service";
import { getUndergraduateThesis } from "@/app/services/project.service";
import { useThesisListStore } from "./store";
import {
  ProjectsStudentTable,
  ProjectsStudentTableRow,
} from "@/app/types/projects-by-professor.type";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/app/routes";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { File, Search } from "lucide-react";
import SkeletonAccordion from "@/components/shared/skeleton-accordion";

/**
 * ThesisList Component
 *
 * This component displays a categorized list of undergraduate thesis projects.
 * Users can filter by category (professor/interest area), select academic periods,
 * and toggle alphabetical sorting. Each section contains a paginated, sortable table.
 */
export default function ThesisList() {
  const searchCategory = useThesisListStore((state) => state.searchCategory);
  const searchTerm = useThesisListStore((state) => state.searchTerm);
  const setSearchTerm = useThesisListStore((state) => state.setSearchTerm);
  const sortDirection = useThesisListStore((state) => state.sortDirection);
  const setSortDirection = useThesisListStore(
    (state) => state.setSortDirection
  );
  const setOrder = useThesisListStore((state) => state.setOrder);

  // Fetch undergraduate thesis list
  const { data: thesisList, isFetching: isFetchingThesis } = useQuery({
    queryKey: ["student-thesis-projects", searchCategory, searchTerm],
    queryFn: () =>
      getUndergraduateThesis({ category: searchCategory, period: searchTerm }),
  });

  // Fetch available academic periods
  const { data: semesters, isLoading: isLoadingSemesters } = useQuery({
    queryKey: ["undergraduate-semesters"],
    queryFn: getPeriods,
  });

  // Seleccionar automáticamente el último período disponible (el más reciente)
  useEffect(() => {
    if (semesters && semesters.length > 0 && !searchTerm) {
      const lastSemester = semesters[semesters.length - 1];
      const stored = typeof window !== "undefined" ? localStorage.getItem("current_period") : null;
      if (stored && semesters.includes(stored)) setSearchTerm(stored);
      else setSearchTerm(lastSemester);
    }
  }, [semesters, searchTerm, setSearchTerm]);

  // Sort field names alphabetically whenever thesis list or direction changes
  useEffect(() => {
    if (thesisList) {
      const sortedOrder = Object.keys(thesisList).sort(
        (a, b) => sortDirection * a.localeCompare(b)
      );
      setOrder(sortedOrder);
    }
  }, [thesisList, sortDirection, setOrder]);

  if (isLoadingSemesters) return <SpinnerPage />;

  return (
    <div className="min-h-full mx-auto p-4 container max-w-3xl">
      <Accordion
        type="single"
        collapsible
        className="w-full bg-card shadow-lg rounded-xl p-5 h-full text-primary"
      >
        {/* Filters and sorting header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
            <SelectSearchCategory className="w-full sm:w-auto" />
            <SelectSemester
              semesters={semesters ?? []}
              selectedSemester={searchTerm}
              className="w-full sm:w-auto"
            />
          </div>
          <AlphabeticSortButton
            onclick={() => setSortDirection(sortDirection * -1)}
            sortDirection={sortDirection}
          />
        </div>

        {/* Content */}
        {isFetchingThesis ? (
          <SkeletonAccordion />
        ) : (
          <AccordionList thesisList={thesisList ?? {}} />
        )}
      </Accordion>
    </div>
  );
}

/**
 * SelectSemester Component
 *
 * Renders dropdown to select academic period.
 * Updates the search term in global store.
 */
function SelectSemester({
  semesters,
  selectedSemester,
  className,
}: {
  readonly semesters: string[];
  readonly selectedSemester: string;
  readonly className?: string;
}) {
  const setSearchTerm = useThesisListStore((state) => state.setSearchTerm);
  return (
    <Select onValueChange={setSearchTerm} value={selectedSemester}>
      <SelectTrigger className={cn("w-[180px]", className)}>
        <SelectValue placeholder="Semestre" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Semestre</SelectLabel>
          {semesters.map((semester) => (
            <SelectItem value={semester} key={semester}>
              {semester}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

/**
 * SelectSearchCategory Component
 *
 * Allows users to filter thesis data by category.
 * Options include: professor and area of interest.
 */
function SelectSearchCategory({ className }: { readonly className?: string }) {
  const setSearchCategory = useThesisListStore(
    (state) => state.setSearchCategory
  );
  return (
    <Select onValueChange={setSearchCategory}>
      <SelectTrigger className={cn("w-[180px]", className)}>
        <SelectValue placeholder="Buscar categoria" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Buscar categoria</SelectLabel>
          <SelectItem value="professor">Profesor</SelectItem>
          <SelectItem value="areas_of_interest">Área de interés</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

/**
 * AccordionList Component
 *
 * Renders an accordion item for each category group (e.g., professor name or interest area).
 */
function AccordionList({
  thesisList,
}: {
  readonly thesisList: ProjectsStudentTable;
}) {
  const order = useThesisListStore((state) => state.order);
  const hasNoResults =
    order.length === 0 ||
    order.every((field) => !thesisList[field] || thesisList[field].length === 0);

  if (hasNoResults) {
    return (
      <div className="text-center py-6 text-foreground text-sm">
        No se encontraron resultados.
      </div>
    );
  }
  return (
    <>
      {order.map((field) => (
        <AccordionItem value={field} key={field}>
          <AccordionTrigger className="hover:bg-core-soft cursor-pointer dark:hover:bg-core-highlight">
            <div className="flex items-center">
              <File className="mr-2 h-5 w-5 text-core-highlight" />
              <span>{field}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {thesisList[field]?.length ? (
              <ThesisTable data={thesisList[field]} />
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No hay proyectos disponibles
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </>
  );
}

/**
 * ThesisTable Component
 *
 * Displays thesis data using reusable DataTable component.
 * Enables column sorting, pagination and custom cell rendering.
 */
function ThesisTable({ data }: { readonly data: ProjectsStudentTableRow[] }) {
  const router = useRouter();

  const columns: ColumnDef<ProjectsStudentTableRow>[] = [
    {
      accessorKey: "title",
      header: "Nombre del proyecto",
      cell: ({ row }) => <ThesisSpan text={row.original.title} />,
    },
    {
      accessorKey: "category",
      header: "Categoría",
      cell: ({ row }) => <ThesisSpan text={row.original.category} />,
    },
    {
      accessorKey: "maxStudents",
      header: "Número de estudiantes",
      cell: ({ row }) => <ThesisSpan text={String(row.original.maxStudents)} />,
    },
    {
      id: "actions",
      header: "Ver",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            router.push(
              `${ROUTES.HOME}/${ROUTES.UNDERGRADUATE_THESIS_LIST}/${row.original.id}`
            )
          }
        >
          <Search className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  return <DataTable columns={columns} data={data} />;
}

function ThesisSpan({ text }: { readonly text: string }) {
  return <span className="text-primary font-medium">{text}</span>;
}