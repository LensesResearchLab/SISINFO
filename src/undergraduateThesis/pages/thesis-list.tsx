import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "components/ui/accordion"
import { Button } from "components/ui/button";
import { ArrowUpDown, File, User } from 'lucide-react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "components/ui/table"
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUndergraduateThesis, getUndegraduadeThesisSemesters } from "../services/thesisService";
import { Thesis } from "undergraduateThesis/types/Thesis";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "components/ui/select"
import SpinnerPage from "components/custom/spinner-page";
import { Skeleton } from "components/ui/skeleton";

/**
 * ThesisList Component
 * 
 * This component displays a list of undergraduate theses. It allows users to filter the list by professor or area of interest, and sort the list alphabetically.
 * 
 * @returns {JSX.Element} The ThesisList component
 */
export default function ThesisList() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [thesisList, setThesisList] = useState<{[professor: string]: Thesis[]}>({});
  const [searchCategory, setSearchCategory] = useState<string>("professor");
  const [order, setOrder] = useState<string[]>([]);
  const [semesters, setSemesters] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<number>(1);

  const toggleSort = () => setSortDirection(sortDirection * -1);

  useEffect(() => {

    Promise.all([
      getUndergraduateThesis().then((data) => {
        setThesisList(data);
        const sortedKeys = Object.keys(data).sort((a, b) => sortDirection * a.localeCompare(b));
        setOrder(sortedKeys);
      }),
      getUndegraduadeThesisSemesters().then((data) => setSemesters(data)),
    ]).finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    setIsSearching(true);
    getUndergraduateThesis(searchTerm, searchCategory).then((data) => {
      setThesisList(data);
      const sortedKeys = Object.keys(data).sort((a, b) => sortDirection * a.localeCompare(b));
      setOrder(sortedKeys);
    }).finally(() => setIsSearching(false));
  }, [searchTerm, searchCategory]);

  useEffect(() => {
    const sortedKeys = Object.keys(thesisList).sort((a, b) => sortDirection * a.localeCompare(b));
    setOrder(sortedKeys);

    const sortedThesisList: { [professor: string]: Thesis[] } = {};
    sortedKeys.forEach((key) => {
      sortedThesisList[key] = thesisList[key];
    });
  }, [sortDirection, thesisList]);

  if (isLoading) return <SpinnerPage />;

  return (
    <div className="min-h-full max-w-[900px] container mx-auto p-4 space-y-8">
        <Accordion type="single" collapsible className="w-full bg-white shadow-lg rounded-xl p-5 h-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <SelectSearchCategory setSearchCategory={setSearchCategory} />
              <SelectSemester setSearchTerm={setSearchTerm} semesters={semesters} />
            </div>

            <Button variant="default" className="bg-sky-800 hover:bg-sky-900" onClick={toggleSort}>
              <ArrowUpDown className="w-4 h-4 mr-2" />
              {sortDirection === 1 ? "A-Z" : "Z-A"}
            </Button>
          </div>
          { isSearching ? <SkeletonAccordion /> : <AccordionListSimpleFactory category={searchCategory} thesisList={thesisList} order={order}/>}
        </Accordion>
    </div>
  );
}

/**
 * SelectSemester Function
 * 
 * This function renders a select component for semester selection.
 * It updates the searchTerm state with the selected semester.
 * 
 * @param {Object} props - Component props
 * @param {Function} props.setSearchTerm - Function to update the searchTerm state
 * @param {Array} props.semesters - Array of available semesters
 * 
 * @returns {JSX.Element} A select component for semester selection
 */
function SelectSemester({setSearchTerm, semesters}: {setSearchTerm: (category: string) => void, semesters: string[]}) {
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
 * SelectSearchCategory Function
 * 
 * This function renders a select component for search category selection.
 * It updates the searchCategory state with the selected category.
 * 
 * @param {Object} props - Component props
 * @param {Function} props.setSearchCategory - Function to update the searchCategory state
 * 
 * @returns {JSX.Element} A select component for search category selection
 */
function SelectSearchCategory({setSearchCategory}: {setSearchCategory: (category: string) => void}) {
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
 * AccordionListSimpleFactory Function
 * 
 * This function dynamically renders an accordion list based on the search category.
 * It returns either ProfessorAccordionList or AreaOfInterestAccordionList.
 * 
 * @param {Object} props - Component props
 * @param {String} props.category - The current search category
 * @param {[professor: string]: Thesis[]} props.thesisList - The list of theses organized by professor or area of interest
 * @param {Array} props.order - The sorted order of professors or areas of interest
 * 
 * @returns {JSX.Element} An accordion list based on the search category
 */
function AccordionListSimpleFactory({category, thesisList, order}: {category: string, thesisList: {[professor: string]: Thesis[]}, order: string[]}) {
  if (category === "areas_of_interest") return <AreaOfInterestAccordionList thesisList={thesisList} order={order} />
  return <ProfessorAccordionList thesisList={thesisList} order={order} />
}

/**
 * AreaOfInterestAccordionList Function
 * 
 * This function dynamically renders an accordion list based on the area of interest.
 * It returns an ElementAccordion for each area of interest, with an icon and a table of theses.
 * 
 * @param {Object} props - Component props
 * @param {[field: string]: Thesis[]} props.thesisList - The list of theses organized by area of interest
 * @param {Array} props.order - The sorted order of areas of interest
 * 
 * @returns {JSX.Element} An accordion list based on the area of interest
 */
function AreaOfInterestAccordionList({thesisList, order}: {thesisList: {[field: string]: Thesis[]}, order: string[]}) {
  return (
    <>
      {order.map((field) => (
        <ElementAccordion element={field} key={field} icon={<File className="mr-2 h-5 w-5 text-sky-900" />}>
          <ElementThesisTable thesisList={thesisList[field]} />
        </ElementAccordion>
      ))}
    </>
  )
}

/**
 * ProfessorAccordionList Function
 * 
 * This function dynamically renders an accordion list based on the professor.
 * It returns an ElementAccordion for each professor, with an icon and a table of theses.
 * 
 * @param {Object} props - Component props
 * @param {[professor: string]: Thesis[]} props.thesisList - The list of theses organized by professor
 * @param {Array} props.order - The sorted order of professors
 * 
 * @returns {JSX.Element} An accordion list based on the professor
 */
function ProfessorAccordionList({thesisList, order}: {thesisList: {[professor: string]: Thesis[]}, order: string[]}) {
  return (
    <>
      {order.map((professor) => (
        <ElementAccordion element={professor} key={professor} icon={<User className="mr-2 h-5 w-5 text-sky-900" />}>
          <ElementThesisTable thesisList={thesisList[professor]} />
        </ElementAccordion>
      ))}
    </>
  )
}

/**
 * ElementAccordion Function
 * 
 * This function renders an accordion item with a trigger and content.
 * It displays an icon and the element's name in the trigger, and the children components in the content.
 * 
 * @param {Object} props - Component props
 * @param {string} props.element - The name of the element to display in the trigger
 * @param {[React.ReactNode]} props.children - Optional children components to render in the content
 * @param {[React.ReactNode]} props.icon - Optional icon to display in the trigger
 * 
 * @returns {JSX.Element} An accordion item with a trigger and content
 */
function ElementAccordion({element, children, icon}: {element: string, children?: React.ReactNode, icon?: React.ReactNode}) {
  return (
    <AccordionItem value={element}>
      <AccordionTrigger className="hover:bg-sky-100">  
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
 * ProfessorThesisTable Component
 * 
 * This component renders a table displaying a professor's thesis projects.
 * It shows project details and provides navigation to individual thesis pages.
 * 
 * @param {Object} props - Component props
 * @param {Thesis[]} props.thesisList - Array of thesis projects to display
 * 
 * Features:
 * - Displays thesis projects in a table format
 * - Shows project title, category and number of students
 * - Includes a view button that navigates to detailed thesis page
 * - Table headers with sky blue background
 * - Responsive table layout
 * 
 * Layout:
 * - Table with 4 columns: project name, category, students count, view button
 * - Each row represents one thesis project
 * - View button with search icon for navigation
 * 
 * @returns {JSX.Element} A table displaying thesis project information
 */
function ElementThesisTable({thesisList}: {thesisList: Thesis[]}) {
  const navigate = useNavigate();
  const handleClick = (id: number) => {navigate(id.toString());};
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
              <Button variant="ghost" size="icon" onClick={() => handleClick(project.id)}>
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
 * This component displays a loading skeleton for an accordion item.
 * It generates 8 accordion items with a user icon and a skeleton for the content.
 * 
 * @returns {JSX.Element} A JSX element representing the accordion items with loading skeletons
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
