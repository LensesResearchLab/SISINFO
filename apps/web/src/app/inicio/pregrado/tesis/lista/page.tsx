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
import { useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { getUndergraduateThesis } from "@/app/services/project.service";
import { ProjectsStudentTable, ProjectsStudentTableRow } from "@/app/types/projects-by-professor.type";


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
    queryKey: ["student-thesis-projects", searchCategory, searchTerm],
    queryFn: () =>
      getUndergraduateThesis({
        category: searchCategory,
        period: searchTerm,
      }),
  });
  const { data: semesters, isLoading: isLoadingSemesters } = useQuery({
    queryKey: ["undergraduate-semesters"],
    queryFn: getPeriods,
  });

  useEffect(() => {
    if (thesisList) {
      const sortedOrder = Object.keys(thesisList).sort((a, b) => {
        return sortDirection * a.localeCompare(b);
      });
      setOrder(sortedOrder);
    }
  }, [thesisList, sortDirection, setOrder]);

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
  return (
    <Select onValueChange={handleClick}>
      <SelectTrigger className={cn("w-[180px]", className)}>
        <SelectValue placeholder="Semestre" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Semestre</SelectLabel>
          {semesters.map((semester: string) => (
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
          <SelectItem value="areas_of_interest">Area de interés</SelectItem>
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
function AccordionList({
  thesisList,
}: {
  readonly thesisList: ProjectsStudentTable;
}) {
  const order = useThesisListStore((state) => state.order);
  return (
    <>
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
    </>
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
 * @param {ProjectsStudentTableRow[]} props.thesisList - Array of thesis projects to display
 * @returns {JSX.Element} Thesis data table
 */
function ElementThesisTable({ thesisList }: { readonly thesisList: ProjectsStudentTableRow[] }) {
  const router = useRouter();
  const handleClick = (id: string) => {
    router.push(`${ROUTES.HOME}/${ROUTES.UNDERGRADUATE_THESIS_LIST}/${id}`);
  };
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="bg-core-highlight text-white text-center">
            Nombre del proyecto
          </TableHead>
          <TableHead className="bg-core-highlight text-white text-center">
            Categoria
          </TableHead>
          <TableHead className="bg-core-highlight text-white text-center">
            Número de estudiantes
          </TableHead>
          <TableHead className="bg-core-highlight text-white text-center">
            Ver
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="text-center">
        {thesisList.map((project, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{project.title}</TableCell>
            <TableCell className="font-medium">{project.category}</TableCell>
            <TableCell className="font-medium">
              {project.maxStudents}
            </TableCell>
            <TableCell className="font-medium">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleClick(project.id)}
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
