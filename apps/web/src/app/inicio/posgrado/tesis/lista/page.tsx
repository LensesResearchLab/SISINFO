"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { File, Search } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPostgraduateThesis } from "@/app/services/thesis.service";

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
import { useQuery } from "@tanstack/react-query";
import { useThesisListStore } from "./store";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/app/routes";
import AlphabeticSortButton from "@/components/shared/alphabetic-sort-button";
import { getPeriods } from "@/app/services/period.service";
import { DataTable } from "@/components/data-table";
import { ThesesStudentTable } from "@/app/types/theses-by-professor.type";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Thesis } from "@/app/types/entities/thesis.type";
import SkeletonAccordion from "@/components/shared/skeleton-accordion";


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
    queryFn: () => getPostgraduateThesis({ category: searchCategory, period: searchTerm }),
  });

  const { data: semesters, isLoading: isLoadingSemesters } = useQuery({
    queryKey: ["undergraduate-semesters"],
    queryFn: getPeriods,
  });

  useEffect(() => {
    if (thesisList) {
      const sortedOrder = Object.keys(thesisList).sort(
        (a, b) => sortDirection * a.localeCompare(b)
      );
      setOrder(sortedOrder);
    }
  }, [thesisList, sortDirection, setOrder]);

  if (isLoadingSemesters) return <SpinnerPage />;

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
        {isFetchingThesis ?
          <SkeletonAccordion />
          : <AccordionList thesisList={thesisList ?? {}} />
        }
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
          <SelectItem value="investigation_subarea">Subarea de investigación</SelectItem>
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
  readonly thesisList: ThesesStudentTable;
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
function ThesisTable({ data }: { readonly data: Thesis[] }) {
  const router = useRouter();

  const rowToName = ({ row }: { row: Row<Thesis> }) => <ThesisSpan text={row.original.title} />
  const rowToSubarea = ({ row }: { row: Row<Thesis> }) => <ThesisSpan text={row.original.investigationSubarea} />
  const rowToButton = ({ row }: { row: Row<Thesis> }) => (
    <Button
      variant="ghost"
      size="icon"
      onClick={() =>
        router.push(
          `${ROUTES.HOME}/${ROUTES.POSTGRADUATE_THESIS_LIST}/${row.original.id}`
        )
      }
    >
      <Search className="w-4 h-4" />
    </Button>
  )

  const columns: ColumnDef<Thesis>[] = [
    {
      accessorKey: "title",
      header: "Nombre del proyecto",
      cell: rowToName,
    },
    {
      accessorKey: "investigationSubarea",
      header: "Subarea de investigación",
      cell: rowToSubarea,
    },
    {
      id: "actions",
      header: "Ver",
      cell: rowToButton
    },
  ];

  return <DataTable columns={columns} data={data} />;
}

function ThesisSpan({ text }: { readonly text: string }) {
  return <span className="text-primary font-medium">{text}</span>;
}