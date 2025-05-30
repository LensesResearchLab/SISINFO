"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { File, User, Search } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getPostgraduateThesis } from "@/app/services/thesis.service";
import { Thesis } from "@/app/types/entities/thesis.type";

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
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useThesisListStore } from "./store";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/app/routes";
import AlphabeticSortButton from "@/components/shared/alphabetic-sort-button";
import { getPeriods } from "@/app/services/period.service";

/**
 * ThesisList Component
 *
 * Displays a list of undergraduate theses with filtering and sorting capabilities.
 *
 * Features:
 * - Filter by professor or area of interest
 * - Sort alphabetically (A-Z or Z-A)
 * - Select semester filter
 * - Loading states with skeletons
 * - Responsive accordion layout
 *
 * @returns {JSX.Element} The ThesisList component
 */
export default function ThesisList() {
  const searchCategory = useThesisListStore((state) => state.searchCategory);
  const searchTerm = useThesisListStore((state) => state.searchTerm);
  const sortDirection = useThesisListStore((state) => state.sortDirection);
  const setSortDirection = useThesisListStore(
    (state) => state.setSortDirection
  );
  const setOrder = useThesisListStore((state) => state.setOrder);

  const { data: thesisList, isFetching: isFetchingThesis } = useQuery({
    queryKey: ["postgraduate-thesis-projects", searchCategory, searchTerm],
    queryFn: () => getPostgraduateThesis(),
  });

  const { data: semesters, isLoading: isLoadingSemesters } = useQuery({
    queryKey: ["undergraduate-semesters"],
    queryFn: getPeriods,
  });

  // Filtrar la lista de tesis por semestre
  const filteredThesisList = useMemo(() => {
    return Array.isArray(thesisList)
      ? thesisList.filter(
          (thesis) =>
            !searchTerm ||
            `${thesis.period.year}${thesis.period.period}` === searchTerm
        )
      : [];
  }, [thesisList, searchTerm]);

  // Agrupar tesis por profesor
  const groupedByProfessor = useMemo(() => {
    return filteredThesisList.reduce(
      (acc, thesis) => {
        const profName =
          thesis.professor?.user?.name &&
          typeof thesis.professor.user.name === "string"
            ? thesis.professor.user.name
            : "Sin profesor";
        if (!acc[profName]) acc[profName] = [];
        acc[profName].push(thesis);
        return acc;
      },
      {} as { [professor: string]: Thesis[] }
    );
  }, [filteredThesisList]);

  // Agrupar tesis por área de investigación
  const groupedByArea = useMemo(() => {
    return filteredThesisList.reduce(
      (acc, thesis) => {
        const area = thesis.investigationSubarea;
        if (!acc[area]) acc[area] = [];
        acc[area].push(thesis);
        return acc;
      },
      {} as { [area: string]: Thesis[] }
    );
  }, [filteredThesisList]);

  // Calcular el orden usando useMemo
  const order = useMemo(() => {
    const keys =
      searchCategory === "investigation_subarea"
        ? Object.keys(groupedByArea)
        : Object.keys(groupedByProfessor);
    return keys.sort((a, b) => sortDirection * a.localeCompare(b));
  }, [groupedByArea, groupedByProfessor, searchCategory, sortDirection]);

  // Actualizar el estado global con el orden calculado
  useEffect(() => {
    setOrder(order);
  }, [order, setOrder]);

  if (isLoadingSemesters) return <SpinnerPage />;

  return (
    <div className="min-h-full mx-auto p-4 container max-w-3xl">
      <Accordion
        type="single"
        collapsible
        className="w-full bg-card shadow-lg rounded-xl p-5 h-full text-primary "
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
            <SelectSearchCategory className="w-full sm:w-auto" />
            <SelectSemester
              semesters={semesters ?? []}
              className="w-full sm:w-auto"
            />
          </div>
          <AlphabeticSortButton
            onclick={() => setSortDirection(sortDirection * -1)}
            sortDirection={sortDirection}
          />
        </div>
        {isFetchingThesis ? (
          <SkeletonAccordion />
        ) : searchCategory === "investigation_subarea" ? (
          <AreaOfInterestAccordionList thesisList={groupedByArea} />
        ) : (
          <ProfessorAccordionList thesisList={groupedByProfessor} />
        )}
      </Accordion>
    </div>
  );
}

/**
 * SelectSemester Component
 *
 * Renders a dropdown select component for choosing academic semesters.
 * Updates the global search term state when a semester is selected.
 *
 * @param {Object} props - Component properties
 * @param {string[]} props.semesters - Array of available semester options
 * @returns {JSX.Element} Semester selection dropdown
 */
function SelectSemester({
  semesters,
  className,
}: {
  readonly semesters: string[];
  readonly className?: string;
}) {
  const setSearchTerm = useThesisListStore((state) => state.setSearchTerm);
  const handleClick = (term: string) => {
    setSearchTerm(term);
  };

  const uniqueSemesters = Array.from(new Set(semesters));

  return (
    <Select onValueChange={handleClick}>
      <SelectTrigger className={cn("w-[180px]", className)}>
        <SelectValue placeholder="Semestre" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Semestre</SelectLabel>
          {uniqueSemesters.map((semester: string) => (
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
 * Renders a dropdown select component for choosing search filter category.
 * Allows filtering thesis list by professor or area of interest.
 *
 * @returns {JSX.Element} Search category selection dropdown
 */
function SelectSearchCategory({ className }: { readonly className?: string }) {
  const setSearchCategory = useThesisListStore(
    (state) => state.setSearchCategory
  );
  const handleClick = (category: string) => {
    setSearchCategory(category);
  };
  return (
    <Select onValueChange={handleClick}>
      <SelectTrigger className={cn("w-[180px]", className)}>
        <SelectValue placeholder="Buscar categoria" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Buscar categoria</SelectLabel>
          <SelectItem value="professor">Profesor</SelectItem>
          <SelectItem value="investigation_subarea">Area de interés</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

/**
 * AreaOfInterestAccordionList Component
 *
 * Renders an accordion list grouped by areas of interest.
 * Each section displays theses related to a specific field.
 *
 * @param {Object} props - Component properties
 * @param {Object} props.thesisList - Thesis data grouped by field
 * @param {string[]} props.order - Sorted order of fields
 * @returns {JSX.Element} Area of interest based accordion list
 */
function AreaOfInterestAccordionList({
  thesisList,
}: {
  readonly thesisList: { [field: string]: Thesis[] };
}) {
  const order = useThesisListStore((state) => state.order);
  return (
    <div className="py-10">
      {order.map((field) => (
        <ElementAccordion
          element={field}
          key={field}
          icon={<File className="mr-2 h-5 w-5 text-core-highlight" />}
        >
          {field in thesisList ? (
            <ElementThesisTable thesisList={thesisList[field]} />
          ) : (
            <SkeletonAccordion />
          )}
        </ElementAccordion>
      ))}
    </div>
  );
}

/**
 * ProfessorAccordionList Component
 *
 * Renders an accordion list grouped by professors.
 * Each section displays theses supervised by a specific professor.
 *
 * @param {Object} props - Component properties
 * @param {Object} props.thesisList - Thesis data grouped by professor
 * @param {string[]} props.order - Sorted order of professors
 * @returns {JSX.Element} Professor based accordion list
 */
function ProfessorAccordionList({
  thesisList,
}: {
  readonly thesisList: { [professor: string]: Thesis[] };
}) {
  const order = useThesisListStore((state) => state.order);
  return (
    <div className="py-10">
      {order.map((professor) => (
        <ElementAccordion
          element={professor}
          key={professor}
          icon={<User className="mr-2 h-5 w-5 text-core-highlight" />}
        >
          {professor in thesisList ? (
            <ElementThesisTable thesisList={thesisList[professor]} />
          ) : (
            <SkeletonAccordion />
          )}
        </ElementAccordion>
      ))}
    </div>
  );
}

/**
 * ElementAccordion Component
 *
 * Generic accordion item component with customizable trigger and content.
 *
 * @param {Object} props - Component properties
 * @param {string} props.element - Display text for accordion trigger
 * @param {React.ReactNode} props.children - Content to display when expanded
 * @param {React.ReactNode} props.icon - Icon to display in trigger
 * @returns {JSX.Element} Accordion item component
 */
function ElementAccordion({
  element,
  children,
  icon,
}: {
  readonly element: string;
  readonly children?: React.ReactNode;
  readonly icon?: React.ReactNode;
}) {
  return (
    <AccordionItem value={element}>
      <AccordionTrigger className="hover:bg-core-soft cursor-pointer dark:hover:bg-core-highlight">
        <div className="flex items-cente">
          {icon}
          <span>{element}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent>{children}</AccordionContent>
    </AccordionItem>
  );
}

/**
 * ElementThesisTable Component
 *
 * Displays thesis projects in a tabular format with details and actions.
 *
 * Features:
 * - Sortable columns
 * - Project details including title, category, student count
 * - View action button for each project
 * - Responsive table layout
 *
 * @param {Object} props - Component properties
 * @param {Thesis[]} props.thesisList - Array of thesis projects to display
 * @returns {JSX.Element} Thesis data table
 */
function ElementThesisTable({ thesisList }: { readonly thesisList: Thesis[] }) {
  const router = useRouter();
  const handleClick = (id: string) => {
    router.push(`${ROUTES.HOME}/${ROUTES.POSTGRADUATE_THESIS_LIST}/${id}`);
  };
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="bg-core-highlight text-white text-center">
            Nombre del proyecto
          </TableHead>
          <TableHead className="bg-core-highlight text-white text-center">
            Subarea de investigación
          </TableHead>
          <TableHead className="bg-core-highlight text-white text-center">
            Ver
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="text-center">
        {thesisList.map((thesis) => (
          <TableRow key={thesis.id}>
            <TableCell className="font-medium">{thesis.title}</TableCell>
            <TableCell className="font-medium">
              {thesis.investigationSubarea}
            </TableCell>
            <TableCell className="font-medium">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleClick(thesis.id)}
              >
                <Search className="w-4 h-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

/**
 * SkeletonAccordion Component
 *
 * Renders loading placeholder UI for accordion items.
 * Displays 8 skeleton items with animated loading effects.
 *
 * @returns {JSX.Element} Loading skeleton UI component
 */
function SkeletonAccordion() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, index) => (
        <AccordionItem key={index} value="loading">
          <AccordionTrigger>
            <div className="flex items-center w-full">
              <User className="mr-2 h-5 w-5 text-core-highlight" />
              <Skeleton className="w-40 h-4" />
            </div>
          </AccordionTrigger>
        </AccordionItem>
      ))}
    </>
  );
}
