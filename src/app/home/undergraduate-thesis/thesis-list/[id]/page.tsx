"use client";
import {Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from "@/components/ui/badge"
import { Mail, Users, Calendar, Tag, FileText } from "lucide-react"
import { Button } from '@/components/ui/button'
import { getUndergraduateThesisById } from '@/app/home/undergraduate-thesis/services/thesis.service';
import { useRouter } from 'next/navigation'
import { Thesis } from '@/app/home/undergraduate-thesis/types/thesis.type';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ConfirmationModal } from '@/components/shared/confirmation-modal';
import { use, useEffect, useState } from 'react';
import SpinnerPage from '@/components/shared/spinner-page';
import { useQuery } from '@tanstack/react-query';
import { useThesisInscriptionStore } from './store';


/**
 * ThesisInscription Component
 * 
 * Main component for handling thesis inscription functionality.
 * Displays thesis details and application form based on user interaction.
 * 
 * Features:
 * - Fetches thesis details using the provided ID
 * - Handles loading and error states
 * - Toggles between details view and application form
 * - Resets application state when ID changes
 * 
 * @param {Object} params - URL parameters containing thesis ID
 */
export default function ThesisInscription({ params } :{ params: Promise<{ id: string }> }) {
  const { id } = use(params); 
  const reset = useThesisInscriptionStore(state => state.reset);

  const { data: thesis, isFetching, error} = useQuery({
    queryKey: ['student-thesis-application', id],
    queryFn: () => getUndergraduateThesisById(id),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const isApplying = useThesisInscriptionStore(state => state.isApplying);

  useEffect(() => {
    reset();
  }, [id]);

  if (isFetching) return <SpinnerPage />;
  if (error || !thesis) return <ThesisNotFound />;
  return (
    <div className="min-h-full max-w-[900px] container mx-auto p-4 space-y-8">
      {!isApplying && <ThesisDetails thesis={thesis!}/>}
      {isApplying && <ThesisApplying thesis={thesis!}/>}
    </div>
  )
}


/**
 * ThesisNotFound Component
 * 
 * Displays a message when a thesis is not found in the system.
 * Provides a button to navigate back to the thesis list page.
 * 
 * Features:
 * - Clear error message
 * - Navigation button to return to thesis list
 * - Consistent styling with the main application
 * 
 * @returns {JSX.Element} Error card with navigation button
 */
function ThesisNotFound() {
  const router = useRouter();
  return (
    <div className="min-h-full max-w-[900px] container mx-auto p-4 space-y-8">
      <Card className="w-full mx-auto shadow-lg border-none">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-sky-800">Tesis no encontrada</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <p className="text-gray-700">La tesis que buscas no se encuentra en el sistema. Por favor verifica la URL o intenta de nuevo más tarde.</p>
          <Button 
            className="bg-black hover:bg-black/90 w-40 mx-auto block" 
            onClick={() => router.push("/home/undergraduate-thesis/thesis-list")}
          >Volver a la lista</Button>
        </CardContent>
      </Card>
    </div>
  
  )
}


/**
 * ThesisDetails Component
 * 
 * Displays comprehensive information about a thesis project in a structured card layout.
 * Shows title, description, areas of interest, and other metadata.
 *
 * Features:
 * - Organized sections for different types of information
 * - Responsive layout with appropriate spacing
 * - Apply button to initiate the application process
 * 
 * @param {Object} props - Component props
 * @param {Thesis} props.thesis - The thesis object containing all project details
 * 
 * @returns {JSX.Element} Card with formatted thesis information
 */
function ThesisDetails({thesis}: {thesis: Thesis}) {
  const setIsApplying = useThesisInscriptionStore(state => state.setIsApplying);
  return (
    <Card className="w-full  mx-auto shadow-lg border-none">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-sky-800">Información del proyecto de grado</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-4">
          <MainInformation thesis={thesis} />
          <AreasOfInterest areas={thesis.areas_of_interest} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CategoryAndSemesterInfo thesis={thesis} />
            <StudentsAndContactInfo thesis={thesis} />
          </div>
        </div>
        <Button className="bg-black hover:bg-black/90 w-40 mx-auto block" onClick={() => setIsApplying(true)}>Aplicar</Button>
      </CardContent>
    </Card>
  )
}

/**
 * MainInformation Component
 * 
 * Displays the primary information of a thesis project including title and description.
 * 
 * Features:
 * - Clear labeling for project title
 * - Formatted description with appropriate spacing
 * - Visual hierarchy through font styling
 * 
 * @param {Object} props - Component props
 * @param {Thesis} props.thesis - The thesis object containing project details
 * 
 * @returns {JSX.Element} Section with formatted title and description
 */
function MainInformation({thesis}: {thesis: Thesis}) {
  return  (
    <div>
      <h3 className="font-semibold text-lg">Nombre del proyecto: <span className="text-gray-700 font-normal"> {thesis.title}</span></h3>
      <h3 className="font-semibold text-lg mt-4">Descripción:</h3>
      <p className="text-gray-700">{thesis.description}</p>
    </div>
  )
}

/**
 * AreasOfInterest Component
 * 
 * Displays a collection of interest areas related to the thesis as interactive badges.
 * 
 * Features:
 * - Flexible layout that wraps on smaller screens
 * - Visual representation of areas as badges
 * - Consistent styling with hover effects
 * 
 * @param {Object} props - Component props
 * @param {string[]} props.areas - Array of area names to display as badges
 * 
 * @returns {JSX.Element} Section with heading and area badges
 */
function AreasOfInterest({areas}: {areas: string[]}) {
  return (
    <div>
    <h3 className="font-semibold text-lg">Áreas de interés:</h3>
    <div className="flex flex-wrap gap-2 mt-2">
      {areas.map((area) => (
        <Badge  variant="secondary" className="bg-gray-200 text-gray-700 hover:bg-gray-300" key={area}>
          {area}
        </Badge>
      ))}
    </div>
    </div>
  )
}

/**
 * CategoryAndSemesterInfo Component
 * 
 * Displays metadata about the thesis category and academic semester.
 * Uses icons to enhance visual understanding of the information.
 * 
 * Features:
 * - Icon-paired information for visual clarity
 * - Consistent layout and spacing
 * - Semantic grouping of related information
 * 
 * @param {Object} props - Component props
 * @param {Thesis} props.thesis - The thesis object containing category and semester data
 * 
 * @returns {JSX.Element} Section with formatted category and semester information
 */
function CategoryAndSemesterInfo({thesis}: {thesis: Thesis}) {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-2">
        <Tag className="h-5 w-5 text-sky-800 mt-1" />
        <div>
          <h3 className="font-semibold">Categoría:</h3>
          <p className="text-gray-700">{thesis.category}</p>
        </div>
      </div>

      <div className="flex items-start gap-2">
        <Calendar className="h-5 w-5 text-sky-800 mt-1" />
        <div>
          <h3 className="font-semibold">Periodo:</h3>
          <p className="text-gray-700">{thesis.semester}</p>
        </div>
      </div>
    </div>
  )
}

/**
 * StudentsAndContactInfo Component
 * 
 * Displays information about student capacity and professor contact details.
 * Includes interactive email link for direct communication.
 * 
 * Features:
 * - Icon-paired information for visual clarity
 * - Clickable email link with mailto functionality
 * - Organized layout with consistent spacing
 * 
 * @param {Object} props - Component props
 * @param {Thesis} props.thesis - The thesis object containing student capacity and contact information
 * 
 * @returns {JSX.Element} Section with formatted student capacity and contact information
 */
function StudentsAndContactInfo({thesis}: {thesis: Thesis}) {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-2">
        <Users className="h-5 w-5 text-sky-800 mt-1" />
        <div>
          <h3 className="font-semibold">Número máximo de estudiantes:</h3>
          <p className="text-gray-700">{thesis.students}</p>
        </div>
      </div>

      <div className="flex items-start gap-2">
        <Mail className="h-5 w-5 text-sky-800 mt-1" />
        <div>
          <h3 className="font-semibold">Contacto:</h3>
          <p className="text-gray-700">{thesis.professor}</p>
          <a href={`mailto:${thesis.email}`} className="text-sky-800 hover:underline">
            {thesis.email}
          </a>
        </div>
      </div>
    </div>
  )
}

/**
 * ThesisApplying Component
 * 
 * Handles the thesis application process with a form interface.
 * Allows students to submit their motivation and indicate contact status.
 * 
 * Features:
 * - Form with text area for motivation statement
 * - Contact status checkbox
 * - Confirmation modal before submission
 * - Navigation back to thesis details
 * - Success feedback after submission
 * 
 * @param {Object} props - Component props
 * @param {Thesis} props.thesis - The thesis object containing project details
 * 
 * @returns {JSX.Element} Card containing the application form interface
 */
function ThesisApplying({thesis}: {thesis: Thesis}) {
  const setIsApplying = useThesisInscriptionStore(state => state.setIsApplying);
  const motivation = useThesisInscriptionStore(state => state.motivation);
  const setMotivation = useThesisInscriptionStore(state => state.setMotivation);
  const contacted = useThesisInscriptionStore(state => state.contacted);
  const setContacted = useThesisInscriptionStore(state => state.setContacted);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Aplicación enviada con exito, motivación: " + motivation + ", contacto: " + contacted);
  }

  const modalProps = {
    "title": "¿Estás seguro de aplicar a esta tesis?",
    "description": "Recuerda que una vez aplicas no podrás cambiar tu decisión", 
    "buttonText": "Aplicar",
    "successTitle": "¡Aplicación enviada!",
    "successText": "Tu aplicación ha sido enviada con éxito",
    "url": "/home/undergraduate-thesis/thesis-status"
  }

  return (
    <Card className="max-w-3xl  mx-auto shadow-lg">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <CardTitle className="text-2xl font-medium text-sky-800">{thesis.title}</CardTitle>
        <ButtonBack setIsApplying={setIsApplying} />
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <ProfessorInformation thesis={thesis} />
          <MotivationTextArea motivation={motivation} setMotivation={setMotivation} />
          <ContactedCheckbox contacted={contacted} setContacted={setContacted} />
          <div className="flex justify-center pt-3.5">
            <ConfirmationModal dialogText={modalProps} onConfirm={handleSubmit}/>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

/**
 * ButtonBack Component
 * 
 * Renders a button that allows users to return to the thesis details view.
 * Provides visual feedback through icon and styling.
 * 
 * Features:
 * - Clear visual indication of purpose with icon
 * - Consistent styling with the application
 * - Interactive hover effects
 * - Compact size for secondary action
 * 
 * @param {Object} props - Component props
 * @param {Function} props.setIsApplying - Function to toggle application form visibility
 * 
 * @returns {JSX.Element} Styled button for returning to thesis details
 */
function ButtonBack({setIsApplying}: {setIsApplying: (value: boolean) => void}) {
  return  (
    <Button variant="outline"
      size="sm"
      className="text-sky-800 hover:text-sky-900 border-sky-800 hover:border-sky-900 hover:bg-sky-50"
      onClick={() => setIsApplying(false)}
    >
      <FileText className="h-4 w-4 mr-2" />
      Ver detalles
    </Button>
  )
}

/**
 * ProfessorInformation Component
 * 
 * Displays the professor's contact information for the thesis project.
 * Includes name and interactive email link.
 * 
 * Features:
 * - Clear presentation of professor name
 * - Interactive email link with icon
 * - Visual feedback on interaction
 * - Semantic grouping of related information
 * 
 * @param {Object} props - Component props
 * @param {Thesis} props.thesis - The thesis object containing professor details
 * 
 * @returns {JSX.Element} Section with formatted professor information
 */
function ProfessorInformation({thesis}: {thesis: Thesis}) {
  return (
    <div className="space-y-2">
      <div className="flex flex-col space-y-1">
        <h2 className="text-lg font-semibold">Profesor: <span className='text-gray-900 font-normal'>{thesis.professor}</span></h2>
        <a
          href={`mailto:${thesis.email}`}
          className="text-sky-800 hover:underline inline-flex items-center gap-2"
        >
          <Mail className="h-4 w-4" />
          {thesis.email}
        </a>
      </div>
    </div>
  )
}

/**
 * MotivationTextArea Component
 * 
 * Provides a text input area for students to express their motivation and relevant experience.
 * Includes descriptive label and appropriate styling.
 * 
 * Features:
 * - Descriptive label explaining purpose
 * - Controlled component with state management
 * - Appropriate sizing for detailed responses
 * - Placeholder text for guidance
 * 
 * @param {Object} props - Component props
 * @param {string} props.motivation - Current motivation text value
 * @param {function} props.setMotivation - Function to update motivation text
 * 
 * @returns {JSX.Element} Labeled textarea for motivation input
 */
function MotivationTextArea({motivation, setMotivation}: {motivation: string, setMotivation: (value: string) => void}) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-600">
        Escribe aquí las razones por las que quieres aplicar y tus conocimientos relevantes
      </label>
      <Textarea
        value={motivation}
        onChange={(e) => setMotivation(e.target.value)}
        placeholder="Describe tus motivaciones y experiencia"
        className="min-h-[200px] resize-none"
      />
    </div>
  )
}

/**
 * ContactedCheckbox Component
 * 
 * Provides a checkbox for students to indicate if they have contacted the professor.
 * Includes accessible label and state management.
 * 
 * Features:
 * - Accessible checkbox with associated label
 * - Controlled component with state management
 * - Visual styling consistent with application
 * - Clear labeling of purpose
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.contacted - Current checkbox state
 * @param {function} props.setContacted - Function to update checkbox state
 * 
 * @returns {JSX.Element} Labeled checkbox for indicating professor contact
 */
function ContactedCheckbox({contacted, setContacted}: {contacted: boolean, setContacted: (value: boolean) => void}) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="contacted"
        checked={contacted}
        onCheckedChange={(checked) => setContacted(checked as boolean)}
      />
      <label
        htmlFor="contacted"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Contacté al profesor por otro medio
      </label>
    </div>
  )
}