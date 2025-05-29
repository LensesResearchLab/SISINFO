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
import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { submitTeachingAssistantGrade } from "@/app/services/teaching-assistantship.service";

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
import AlphabeticSortButton from "@/components/shared/alphabetic-sort-button";
import { getPeriods } from "@/app/services/period.service";
import { getTeachingAssistants } from "@/app/services/professor.service";
import { mapSectionsToProfessorTable } from "@/app/mappers/section.mapper";
import { ProfessorTA, TeachingAssistantshipProfessorSection } from "@/app/types/teachingAssistantshipProfessorSection";
import { toast } from "sonner";



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

  const { data: semesters, isFetching: isLoadingSemesters } = useQuery({
    queryKey: ["undergraduate-semesters"],
    queryFn: getPeriods,
  });



  const { data: sectionsList, isFetching: isFetchingTeachingAssistants } = useQuery({
    queryKey: ["teaching-assistants-professor", searchTerm],
    queryFn: () =>
      getTeachingAssistants(searchTerm),
  });

  const mappedTASList = mapSectionsToProfessorTable(sectionsList ?? []);

  useEffect(() => {
    if (mappedTASList) {
      const sortedOrder = Object.keys(mappedTASList).sort((a, b) => {
        return sortDirection * a.localeCompare(b);
      });
      setOrder(sortedOrder);
    }
  }, [mappedTASList, setOrder, sortDirection]);

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
        ) : Object.keys(mappedTASList).length === 0 ? (
          <div className="text-center text-muted-foreground py-10">
            <p className="text-lg font-medium">No se encontraron monitores asignados.</p>
            <p className="text-sm mt-2">Verifica si estás en el periodo correcto o ajusta tu búsqueda.</p>
          </div>
        ) : (
          <SectionAccordionList sectionsList={mappedTASList} />
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
function SectionAccordionList({
  sectionsList,
}: {
  readonly sectionsList: TeachingAssistantshipProfessorSection;
}) {
  const order = useTeachingAssistantListStore((state) => state.order);

  return (
    <>
      {order.map((sectionName) => (
        <SectionAccordion
          element={sectionName}
          key={sectionName}
          icon={<User className="mr-2 h-5 w-5 text-core-highlight" />}
        >
          {sectionsList[sectionName] ? (
            <TeachingAssistantTable teachingAssistantList={sectionsList[sectionName]} />
          ) : (
            <SkeletonAccordion />
          )}
        </SectionAccordion>
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
function SectionAccordion({
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
function TeachingAssistantTable({ teachingAssistantList }: { readonly teachingAssistantList: ProfessorTA[] }) {
  const [gradingId, setGradingId] = useState<string | null>(null);
  const [grade, setGrade] = useState('');
  const [description, setDescription] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<{ value: number; description: string } | null>(null);
  const [localList, setLocalList] = useState(teachingAssistantList);

  const handleSubmit = async () => {
    if (gradingId) {
      try {
        await submitTeachingAssistantGrade(gradingId, grade, description);
        setLocalList((prevList) =>
          prevList.map((ta) =>
            ta.id === gradingId
              ? { ...ta, grade: parseFloat(grade), gradeDescription: description }
              : ta
          )
        );
        setGradingId(null);
        setGrade('');
        setDescription('');
      } catch (error) {
        console.error("Error al enviar la calificación:", error);
        toast("Ha ocurrido un error", {
          description: `El monitor ya tiene una calificación asociada`,
        })
      }
    }
  };

  const handleGradeClick = (grade: number, description: string) => {
    setSelectedGrade({ value: grade, description });
  };

  const isValidGrade = (value: string) => {
    const number = parseFloat(value);
    return !isNaN(number) && number >= 0 && number <= 5;
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="bg-core-highlight text-white text-center">Nombre del monitor</TableHead>
            <TableHead className="bg-core-highlight text-white text-center">Código</TableHead>
            <TableHead className="bg-core-highlight text-white text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-center">
          {localList.map((student) => (
            <TableRow key={student.id}>
              <TableCell className="font-medium">{student.name}</TableCell>
              <TableCell className="font-medium">{student.code}</TableCell>
              <TableCell className="font-medium">
                {student.grade != null ? (
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="link"
                      onClick={() => handleGradeClick(student.grade ?? 0, student.gradeDescription ?? '')}
                      className="text-muted-foreground cursor-pointer"
                    >
                      Ver Calificación
                    </Button>
                  </div>
                ) : (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button onClick={() => setGradingId(student.id)}>Calificar</Button>
                    </DialogTrigger>
                    {gradingId === student.id && (
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Calificar Monitor {student.name}</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col gap-4">
                          <Input
                            type="number"
                            min="0"
                            max="5"
                            step="0.01"
                            placeholder="Calificación (0.00 - 5.00)"
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                          />
                          <Textarea
                            placeholder="Descripción"
                            className="max-h-80 h-40 overflow-auto"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                          />
                        </div>
                        <DialogFooter className="mt-4 flex justify-end gap-2">
                          <Button
                            onClick={handleSubmit}
                            disabled={!isValidGrade(grade)}
                          >
                            Guardar
                          </Button>
                          <Button variant="outline" onClick={() => setGradingId(null)}>Cancelar</Button>
                        </DialogFooter>
                      </DialogContent>
                    )}
                  </Dialog>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedGrade && (
        <Dialog open={true} onOpenChange={() => setSelectedGrade(null)}>
          <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Calificación del Monitor</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p><strong>Calificación:</strong> {selectedGrade.value}</p>
              <div className="max-h-60 overflow-y-auto p-2 bg-muted">
                {selectedGrade.description.trim() ? (
                  <p className="whitespace-pre-wrap">{selectedGrade.description}</p>
                ) : (
                  <p className="italic text-muted-foreground">No se proporcionó una descripción para esta calificación.</p>
                )}
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button onClick={() => setSelectedGrade(null)}>Cerrar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
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
