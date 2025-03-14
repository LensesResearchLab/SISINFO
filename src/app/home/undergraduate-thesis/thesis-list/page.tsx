"use client";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  import { Button } from "@/components/ui/button";
  import { ArrowUpDown, File, User } from 'lucide-react'
  
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import { Search } from "lucide-react";
  import { useEffect } from "react";
  import { useRouter } from 'next/navigation';
  import { getUndergraduateThesis, getUndegraduadeThesisSemesters } from "@/app/home/undergraduate-thesis/services/thesis.service";
  import { Thesis } from "@/app/home/undergraduate-thesis/types/thesis.type";
  
  import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  import SpinnerPage from "@/components/shared/spinner-page";
  import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useThesisListStore } from "./store";
  
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
  const searchCategory = useThesisListStore(state => state.searchCategory);
  const searchTerm = useThesisListStore(state => state.searchTerm);
  const sortDirection = useThesisListStore(state => state.sortDirection);
  const setSortDirection = useThesisListStore(state => state.setSortDirection);
  const setOrder = useThesisListStore(state => state.setOrder);

  const { data: thesisList, isFetching: isFetchingThesis} = useQuery({
    queryKey: ['student-thesis-projects', searchCategory, searchTerm],
    queryFn: () => getUndergraduateThesis({category: searchCategory, semester: searchTerm}),
  });
  const { data: semesters, isLoading: isLoadingSemesters } = useQuery({
    queryKey: ['student-thesis-semesters'],
    queryFn: getUndegraduadeThesisSemesters,
  });

  useEffect(() => {
    if (thesisList) {
      const sortedOrder = Object.keys(thesisList).sort((a, b) => {
        return sortDirection * a.localeCompare(b);
      });
      setOrder(sortedOrder);
    }
  }, [thesisList, sortDirection]);


  if (isLoadingSemesters) return <SpinnerPage />;

  return (
    <div className="min-h-full max-w-[900px] container mx-auto p-4 space-y-8">
        <Accordion type="single" collapsible className="w-full bg-white shadow-lg rounded-xl p-5 h-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <SelectSearchCategory/>
              <SelectSemester semesters={semesters ?? []} />
            </div>
            <Button variant="default" className="bg-sky-800 hover:bg-sky-900" onClick={() => setSortDirection(sortDirection * -1)}>
              <ArrowUpDown className="w-4 h-4 mr-2" />
              {sortDirection === 1 ? "A-Z" : "Z-A"}
            </Button>
          </div>
          { isFetchingThesis ? <SkeletonAccordion /> : <AccordionListSimpleFactory thesisList={thesisList ?? {}}/>}
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
function SelectSemester({semesters}: {semesters: string[]}) {
  const setSearchTerm = useThesisListStore(state => state.setSearchTerm);
  const handleClick = (category: string) => {setSearchTerm(category);};
  return (
    <Select onValueChange={handleClick}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Semester" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Semester</SelectLabel>
          {
            semesters.map((semester: string) => (
              <SelectItem value={semester} key={semester}>{semester}</SelectItem>
            ))
          }
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
  
/**
 * SelectSearchCategory Component
 * 
 * Renders a dropdown select component for choosing search filter category.
 * Allows filtering thesis list by professor or area of interest.
 * 
 * @returns {JSX.Element} Search category selection dropdown
 */
function SelectSearchCategory() {
  const setSearchCategory = useThesisListStore(state => state.setSearchCategory);
  const handleClick = (category: string) => {setSearchCategory(category);};
  return (
    <Select onValueChange={handleClick}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Search Category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Search Category</SelectLabel>
          <SelectItem value="professor">Professor</SelectItem>
          <SelectItem value="areas_of_interest">Area of Interest</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
  
/**
 * AccordionListSimpleFactory Component
 * 
 * Factory component that renders appropriate accordion list based on selected category.
 * Switches between professor-based and area-of-interest-based views.
 * 
 * @param {Object} props - Component properties
 * @param {Object} props.thesisList - Grouped thesis data by professor or area
 * @returns {JSX.Element} Appropriate accordion list component
 */
function AccordionListSimpleFactory({thesisList}: {thesisList: {[professor: string]: Thesis[]}}) {
  const category = useThesisListStore(state => state.searchCategory);
  const order = useThesisListStore(state => state.order);
  if (category === "areas_of_interest") return <AreaOfInterestAccordionList thesisList={thesisList} order={order} />
  return <ProfessorAccordionList thesisList={thesisList} order={order} />
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
function AreaOfInterestAccordionList({thesisList, order}: {thesisList: {[field: string]: Thesis[]}, order: string[]}) {
  return (
    <>
      {order.map((field) => (
        <ElementAccordion element={field} key={field} icon={<File className="mr-2 h-5 w-5 text-sky-900" />}>
          {
            field in thesisList ? <ElementThesisTable thesisList={thesisList[field]} /> : <SkeletonAccordion />
          }
        </ElementAccordion>
      ))}
    </>
  )
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
function ProfessorAccordionList({thesisList, order}: {thesisList: {[professor: string]: Thesis[]}, order: string[]}) {
  console.log(thesisList);
  console.log(order);
  return (
    <>
      {order.map((professor) => (
        <ElementAccordion element={professor} key={professor} icon={<User className="mr-2 h-5 w-5 text-sky-900" />}>
          {
            professor in thesisList ? <ElementThesisTable thesisList={thesisList[professor]} /> : <SkeletonAccordion />
          }
        </ElementAccordion>
      ))}
    </>
  )
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
function ElementAccordion({element, children, icon}: {element: string, children?: React.ReactNode, icon?: React.ReactNode}) {
  return (
    <AccordionItem value={element}>
      <AccordionTrigger className="hover:bg-sky-100 cursor-pointer">  
        <div className="flex items-center">
          {icon}
          <span>{element}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent>  
        {children}
      </AccordionContent>
    </AccordionItem>
  )
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
function ElementThesisTable({thesisList}: {thesisList: Thesis[]}) {
  const router = useRouter();
  const handleClick = (id: number) => {router.push(`/home/undergraduate-thesis/thesis-list/${id}`)};
  return (
    <Table>
      <TableHeader >
        <TableRow>
          <TableHead className="bg-sky-900 text-white text-center">Nombre del proyecto</TableHead>
          <TableHead className="bg-sky-900 text-white text-center">Categoria</TableHead>
          <TableHead className="bg-sky-900 text-white text-center">Número de estudiantes</TableHead>
          <TableHead className="bg-sky-900 text-white text-center">Ver</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="text-center">
        {thesisList.map((project, index) => (
            <TableRow key={index}>
            <TableCell className="font-medium">{project.title}</TableCell>
            <TableCell className="font-medium">{project.category}</TableCell>
            <TableCell className="font-medium">{project.students}</TableCell>
            <TableCell className="font-medium">
              <Button variant="ghost" size="icon" onClick={() => handleClick(project.id)} className="cursor-pointer">
                <Search className="w-4 h-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
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
      {Array.from({length: 8}).map((_, index) => (
        <AccordionItem key={index} value="loading">
          <AccordionTrigger>  
            <div className="flex items-center w-full">
              <User className="mr-2 h-5 w-5 text-sky-900" />
              <Skeleton className="w-40 h-4" />
            </div>
          </AccordionTrigger>
        </AccordionItem>
      ))} 
    </>
  )
}