
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
import { Skeleton } from "components/ui/skeleton";
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


export default function ThesisList() {
  const [isLoading, setIsLoading] = useState(true);
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
    setIsLoading(true);
    getUndergraduateThesis(searchTerm, searchCategory).then((data) => {
      setThesisList(data);
      const sortedKeys = Object.keys(data).sort((a, b) => sortDirection * a.localeCompare(b));
      setOrder(sortedKeys);
    }).finally(() => setIsLoading(false));
  }, [searchTerm, searchCategory]);

  useEffect(() => {
    const sortedKeys = Object.keys(thesisList).sort((a, b) => sortDirection * a.localeCompare(b));
    setOrder(sortedKeys);

    const sortedThesisList: { [professor: string]: Thesis[] } = {};
    sortedKeys.forEach((key) => {
      sortedThesisList[key] = thesisList[key];
    });
    setThesisList(sortedThesisList);
  }, [sortDirection, thesisList]);

  return (
    <div className="min-h-full min-w-full mx-auto p-4 space-y-8">
        <Accordion type="single" collapsible className="w-full bg-white shadow-lg rounded-xl p-5 h-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <SelectSearchCategory setSearchCategory={setSearchCategory} />
              <SelectSemester setSearchTerm={setSearchTerm} semesters={semesters} />
            </div>

            <Button variant="default" className="bg-sky-600 hover:bg-sky-700" onClick={toggleSort}>
              <ArrowUpDown className="w-4 h-4 mr-2" />
              {sortDirection === 1 ? "A-Z" : "Z-A"}
            </Button>
          </div>
          { isLoading ? <SkeletonAccordion /> : <AccordionListSimpleFactory category={searchCategory} thesisList={thesisList} order={order}/>}
        </Accordion>
      
    </div>
  );
}

function SelectSemester({setSearchTerm, semesters}: {setSearchTerm: (category: string) => void, semesters: string[]}) {
  const handleClick = (category: string) => {setSearchTerm(category);};
  return (
    <Select onValueChange={handleClick}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Semestre" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Semestre</SelectLabel>
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


function SelectSearchCategory({setSearchCategory}: {setSearchCategory: (category: string) => void}) {
  const handleClick = (category: string) => {setSearchCategory(category);};
  return (
    <Select onValueChange={handleClick}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Criterio de busqueda" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Criterio de busqueda</SelectLabel>
          <SelectItem value="professor">Profesor</SelectItem>
          <SelectItem value="areas_of_interest">Área de interés</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

function AccordionListSimpleFactory({category, thesisList, order}: {category: string, thesisList: {[professor: string]: Thesis[]}, order: string[]}) {
  if (category === "areas_of_interest") return <AreaOfInterestAccordionList thesisList={thesisList} order={order} />
  return <ProfessorAccordionList thesisList={thesisList} order={order} />
}

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


function ElementAccordion({element, children, icon}: {element: string, children?: React.ReactNode, icon?: React.ReactNode}) {
  return (
    <AccordionItem value={element}>
      <AccordionTrigger>  
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
