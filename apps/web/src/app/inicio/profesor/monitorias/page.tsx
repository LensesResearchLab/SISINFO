"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getUndergraduateThesis,
} from "@/app/services/thesis.service";
import { Thesis } from "@/app/types/thesis.type";

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
import { useTeachingAssistantListStore } from "./store";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/app/routes";
import AlphabeticSortButton from "@/components/shared/alphabetic-sort-button";
import { getPeriods } from "@/app/services/period.service";

/**
 * TeachingAssistantList Component
 *
 * Displays a list of undergraduate teaching assistants with filtering and sorting capabilities.
 *
 * Features:
 * - Sort alphabetically (A-Z or Z-A)
 * - Select semester filter
 * - Loading states with skeletons
 * - Responsive accordion layout
 *
 * @returns {JSX.Element} The TeachingAssistantList component
 */
export default function TeachingAssistantList() {
  const searchTerm = useTeachingAssistantListStore((state) => state.searchTerm);
  const sortDirection = useTeachingAssistantListStore((state) => state.sortDirection);
  const setSortDirection = useTeachingAssistantListStore(
    (state) => state.setSortDirection
  );
  const setOrder = useTeachingAssistantListStore((state) => state.setOrder);

  const { data: teachingAssistantList, isFetching: isFetchingTeachingAssistants } = useQuery({
    queryKey: ["teaching-assistants", searchTerm],
    queryFn: () =>
      getUndergraduateThesis({
        semester: searchTerm,
      }),
  });


  const { data: semesters, isLoading: isLoadingSemesters } = useQuery({
    queryKey: ["undergraduate-semesters"],
    queryFn: getPeriods,
  });

  useEffect(() => {
    if (teachingAssistantList) {
      const sortedOrder = Object.keys(teachingAssistantList).sort((a, b) => {
        return sortDirection * a.localeCompare(b);
      });
      setOrder(sortedOrder);
    }
  }, [teachingAssistantList, sortDirection]);

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
        {isFetchingTeachingAssistants ? (
          <SkeletonAccordion />
        ) : (
          <CourseAccordionList teachingAssistantList={teachingAssistantList ?? {}} />
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
  semesters: string[];
  className?: string;
}) {
  const setSearchTerm = useTeachingAssistantListStore((state) => state.setSearchTerm);
  const handleClick = (category: string) => {
    setSearchTerm(category);
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
 * CourseAccordionList Component
 *
 * Renders an accordion list grouped by courses.
 * Each section displays teaching assistants.
 *
 * @param {Object} props - Component properties
 * @param {Object} props.thesisList - Thesis data grouped by professor
 * @param {string[]} props.order - Sorted order of professors
 * @returns {JSX.Element} Professor based accordion list
 */
function CourseAccordionList({
    teachingAssistantList,
}: {
    teachingAssistantList: { [professor: string]: Thesis[] };
}) {
  const order = useTeachingAssistantListStore((state) => state.order);
  return (
    <>
      {order.map((professor) => (
        <CourseAccordion
          element={professor}
          key={professor}
          icon={<User className="mr-2 h-5 w-5 text-core-highlight" />}
        >
          {professor in teachingAssistantList ? (
            <TeachingAssistantTable teachingAssistantList={teachingAssistantList[professor]} />
          ) : (
            <SkeletonAccordion />
          )}
        </CourseAccordion>
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
function CourseAccordion({
  element,
  children,
  icon,
}: {
  element: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
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
function TeachingAssistantTable({ teachingAssistantList }: { teachingAssistantList: Thesis[] }) {
  const router = useRouter();
  const handleClick = (id: number) => {
    router.push(`${ROUTES.HOME}/${ROUTES.UNDERGRADUATE_THESIS_LIST}/${id}`);
  };
  console.log(teachingAssistantList)
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="bg-core-highlight text-white text-center">
            Nombre del monitor
          </TableHead>
          <TableHead className="bg-core-highlight text-white text-center">
            Codigo
          </TableHead>
          <TableHead className="bg-core-highlight text-white text-center">
            Calificación
          </TableHead>
          <TableHead className="bg-core-highlight text-white text-center">
            Acciones
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="text-center">
        {teachingAssistantList.map((project, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{project.title}</TableCell>
            <TableCell className="font-medium">{project.category}</TableCell>
            <TableCell className="font-medium">
              {project.students.length}
            </TableCell>
            <TableCell className="font-medium">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleClick(project.id)}
                className="cursor-pointer"
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
