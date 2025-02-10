
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "components/ui/accordion"
import { Button } from "components/ui/button";
import { User } from 'lucide-react'

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
import { getUndergraduateThesis } from "../services/thesisService";
import { Skeleton } from "components/ui/skeleton";
import { Thesis } from "undergraduateThesis/types/Thesis";

/**
 * ThesisList Component
 * 
 * This component displays a list of undergraduate thesis projects organized by professor.
 * It fetches the thesis data and displays it in an accordion format.
 * 
 * States:
 * - isLoading: Boolean indicating if data is being fetched
 * - thesisList: Object containing thesis projects grouped by professor
 * 
 * Features:
 * - Shows loading skeleton while data is being fetched
 * - Displays thesis projects in collapsible accordion sections by professor
 * - Each professor section contains a table of their thesis projects
 * 
 * Layout:
 * - Full width/height container with padding and spacing
 * - White background accordion with shadow and rounded corners
 * - Professor sections can be expanded/collapsed individually
 * 
 * @returns {JSX.Element} A div containing either a loading skeleton or the thesis list accordion
 */
export default function ThesisList() {
  const [isLoading, setIsLoading] = useState(true);
  const [thesisList, setThesisList] = useState<{[professor: string]: Thesis[]}>({});
  
  useEffect(() => {
    getUndergraduateThesis().then((data) => {setThesisList(data);} ).finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-full min-w-full mx-auto p-4 space-y-8">
      { isLoading ? <SkeletonAccordion /> :
        (<Accordion type="single" collapsible className="w-full bg-white shadow-lg rounded-xl p-5 h-full">
          {Object.keys(thesisList).map((professor) => (
            <ProfessorAccordion professor={professor} key={professor}> 
              <ProfessorThesisTable thesisList={thesisList[professor]} />
            </ProfessorAccordion>
          ))}
        </Accordion>)
      }
    </div>
  );
}

/**
 * SkeletonAccordion Component
 * 
 * This component renders a loading skeleton for the thesis list accordion.
 * It displays placeholder items while the actual thesis data is being fetched.
 * 
 * Features:
 * - Creates 8 skeleton accordion items to simulate loading state
 * - Each item has a user icon and a loading skeleton bar
 * - Matches the styling of the actual accordion for visual consistency
 * 
 * Layout:
 * - Full width accordion with white background and shadow
 * - Each item has a user icon and skeleton placeholder
 * - Maintains same spacing and padding as actual content
 * 
 * @returns {JSX.Element} An accordion containing skeleton loading items
 */
function SkeletonAccordion() {
  return (
    <Accordion type="single" collapsible className="w-full bg-white shadow-lg rounded-xl p-5 h-full">
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
    </Accordion>
  )
}

/**
 * ProfessorAccordion Component
 * 
 * This component renders an accordion item for a professor's thesis projects.
 * It displays the professor's name with a user icon in the trigger section
 * and renders child components in the expandable content area.
 * 
 * @param {Object} props - Component props
 * @param {string} props.professor - The name of the professor
 * @param {React.ReactNode} props.children - Child components to render in accordion content
 * 
 * Layout:
 * - Accordion item with professor name as value
 * - Trigger section with user icon and professor name
 * - Expandable content section containing children
 * 
 * @returns {JSX.Element} An accordion item for displaying professor thesis info
 */
function ProfessorAccordion ({professor, children}: {professor: string, children?: React.ReactNode}) {
  return (
    <AccordionItem value={professor}>
      <AccordionTrigger>  
        <div className="flex items-center">
          <User className="mr-2 h-5 w-5 text-sky-900" />
          <span>{professor}</span>
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
function ProfessorThesisTable({thesisList}: {thesisList: Thesis[]}) {
  const navigate = useNavigate();
  const handleClick = (id: number) => {navigate(id.toString());};
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="bg-sky-900 text-white">Nombre del proyecto</TableHead>
          <TableHead className="bg-sky-900 text-white">Categoria</TableHead>
          <TableHead className="bg-sky-900 text-white">Número de estudiantes</TableHead>
          <TableHead className="bg-sky-900 text-white w-[80px]">Ver</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
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
