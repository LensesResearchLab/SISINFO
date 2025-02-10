import {Card, CardContent, CardHeader, CardTitle } from 'components/ui/card'
import { Badge } from "components/ui/badge"
import { Mail, Users, Calendar, Tag, FileText } from "lucide-react"
import { Button } from 'components/ui/button'
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUndergraduateThesisById } from '../services/thesisService';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from 'components/ui/skeleton';
import { Thesis } from 'undergraduateThesis/types/Thesis';
import { Textarea } from 'components/ui/textarea';
import { Checkbox } from 'components/ui/checkbox';
import { ConfirmationModal } from 'components/custom/confirmation-modal';

/**
 * ThesisInscription Component
 * 
 * This component handles the display and interaction for a thesis inscription page.
 * It fetches thesis details based on the URL parameter and manages the application state.
 * 
 * States:
 * - thesis: Object containing thesis details (id, title, description, etc.)
 * - loading: Boolean to track data fetching state
 * - isApplying: Boolean to control whether application form is shown
 * 
 * Navigation:
 * - Redirects to 404 page if thesis id is invalid or not found
 * 
 * Child Components:
 * - ThesisDetails: Displays thesis information when not applying
 * - ThesisApplying: Shows application form when user is applying
 * - ThesisDetailsSkeleton: Loading state UI
 */
export default function ThesisInscription() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [thesis, setThesis] = useState({ 
    id: 0, 
    title: "",
    description: "", 
    email: "", category: "", 
    semester: "", students: "", 
    areas_of_interest: [""], 
    professor: "" });
  const [loading, setLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);

  useEffect (() => {
    !id ? navigate("/404") : getUndergraduateThesisById(id).then((data) => {setThesis(data);} ).catch(() => navigate("/404")).finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <ThesisDetailsSkeleton />
  return (
    <div className="min-h-full min-w-full mx-auto p-4 space-y-8">
      {!isApplying && <ThesisDetails thesis={thesis} setIsApplying={setIsApplying} />}
      {isApplying && <ThesisApplying thesis={thesis} setIsApplying={setIsApplying} />}
    </div>
  )
}

/**
 * ThesisDetails Component
 * 
 * This component displays detailed information about a thesis project.
 * It shows the thesis title, description, areas of interest, and other data
 * in an organized card layout.
 *
 * @param {Object} props - Component props
 * @param {Thesis} props.thesis - The thesis object containing all project details
 * @param {Function} props.setIsApplying - Function to toggle application state
 * 
 * Layout:
 * - Card with header showing title
 * - Main content section with:
 *   - Project title and description
 *   - Areas of interest tags
 *   - Two column layout for category/semester and students/contact info
 * - Apply button at bottom
 */
function ThesisDetails({thesis, setIsApplying}: {thesis: Thesis, setIsApplying: (value: boolean) => void}) {
  return (
    <Card className="max-w-3xl  mx-auto shadow-lg">
      <CardHeader className=" rounded-t-lg">
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
 * This component displays the main information of a thesis project,
 * including its title and description.
 * 
 * @param {Object} props - Component props
 * @param {Thesis} props.thesis - The thesis object containing the project details
 * 
 * Layout:
 * - Project title displayed with a label
 * - Project description displayed below
 * 
 * @returns {JSX.Element} A div containing the formatted title and description
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
 * This component displays a list of areas of interest for a thesis project
 * as badges/tags.
 * 
 * @param {Object} props - Component props
 * @param {string[]} props.areas - Array of area names to display
 * 
 * Layout:
 * - Section title "Areas of Interest"
 * - Flex container with wrapped badges
 * - Each area displayed as a gray badge with hover effect
 * 
 * @returns {JSX.Element} A div containing the title and area badges
 */
function AreasOfInterest({areas}: {areas: string[]}) {
  return (
    <div>
    <h3 className="font-semibold text-lg">Áreas de interés:</h3>
    <div className="flex flex-wrap gap-2 mt-2">
      {areas.map((area) => (
        <Badge  variant="secondary" className="bg-gray-200 text-gray-700 hover:bg-gray-300">
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
 * This component displays the category and semester information for a thesis project.
 * It shows two sections with icons and labels for the category and period.
 * 
 * @param {Object} props - Component props
 * @param {Thesis} props.thesis - The thesis object containing category and semester info
 * 
 * Layout:
 * - Container with vertical spacing between items
 * - Category section with Tag icon and category text
 * - Period section with Calendar icon and semester text
 * - Each section uses flex layout with icon aligned to top
 * 
 * @returns {JSX.Element} A div containing the formatted category and semester information
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
 * This component displays information about the maximum number of students allowed
 * and contact details for a thesis project.
 * 
 * @param {Object} props - Component props
 * @param {Thesis} props.thesis - The thesis object containing students count and contact info
 * 
 * Layout:
 * - Container with vertical spacing between items
 * - Students section with Users icon showing max students allowed
 * - Contact section with Mail icon showing professor name and email
 * - Email is clickable and opens default mail client
 * 
 * @returns {JSX.Element} A div containing the formatted students and contact information
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
 * This component handles the thesis application form interface.
 * It allows students to submit their motivation and contact status for a thesis project.
 * 
 * @param {Object} props - Component props
 * @param {Thesis} props.thesis - The thesis object containing project details
 * @param {Function} props.setIsApplying - Function to toggle application form visibility
 * 
 * States:
 * - motivation: String containing student's motivation text
 * - contacted: Boolean indicating if student has contacted professor
 * 
 * Features:
 * - Form with motivation text area and contact checkbox
 * - Confirmation modal before submitting
 * - Success message and redirection after submission
 * - Back button to return to thesis details
 * 
 * @returns {JSX.Element} A card containing the thesis application form
 */
function ThesisApplying({thesis, setIsApplying}: {thesis: Thesis, setIsApplying: (value: boolean) => void}) {
  const [motivation, setMotivation] = useState("");
  const [contacted, setContacted] = useState(false);
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
    "url": "/tesis_pregrado/estado_inscripcion"
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
 * This component renders a "Ver detalles" (View details) button that allows users to go back
 * to the thesis details view from the application form.
 * 
 * @param {Object} props - Component props
 * @param {Function} props.setIsApplying - Function to toggle the application form visibility
 *                                        When clicked, sets isApplying to false to show thesis details
 * 
 * Styling:
 * - Uses outline variant with sky blue colors
 * - Small size button
 * - Includes FileText icon
 * - Hover effects for text, border and background
 * 
 * @returns {JSX.Element} A button that returns to thesis details view
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
 * This component displays the professor's information for a thesis project,
 * including their name and email contact.
 * 
 * @param {Object} props - Component props
 * @param {Thesis} props.thesis - The thesis object containing professor details
 *                               Must include professor name and email
 * 
 * Features:
 * - Displays professor name with semantic heading
 * - Clickable email link with mailto functionality
 * - Mail icon visual indicator for email
 * - Hover underline effect on email
 * 
 * Styling:
 * - Consistent spacing between elements
 * - Professor name has semibold weight with normal weight for the actual name
 * - Email uses sky blue color scheme with hover effects
 * 
 * @returns {JSX.Element} A section showing professor name and contact email
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
 * This component renders a text area for students to input their motivation and relevant experience
 * when applying for a thesis project.
 * 
 * @param {Object} props - Component props
 * @param {string} props.motivation - The current motivation text value
 * @param {function} props.setMotivation - Function to update the motivation text value
 * 
 * Features:
 * - Descriptive label explaining the purpose of the text area
 * - Controlled textarea component with placeholder text
 * - Fixed minimum height of 200px
 * - Non-resizable text area for consistent UI
 * 
 * Styling:
 * - Consistent spacing between elements using space-y-2
 * - Gray colored label text for visual hierarchy
 * - Custom styling for the textarea including minimum height
 * 
 * @returns {JSX.Element} A labeled textarea for motivation input
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
 * This component renders a checkbox that allows students to indicate if they have
 * contacted the professor through other means regarding the thesis project.
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.contacted - The current state of the checkbox
 * @param {function} props.setContacted - Function to update the checkbox state
 * 
 * Features:
 * - Controlled checkbox component with associated label
 * - Accessible through id/htmlFor connection
 * - Visual feedback for disabled state
 * 
 * Styling:
 * - Flex layout with consistent spacing
 * - Small text size for label
 * - Medium font weight for emphasis
 * - Custom styling for disabled state
 * 
 * @returns {JSX.Element} A checkbox with label for indicating professor contact
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


/**
 * ThesisDetailsSkeleton Component
 * 
 * This component renders a loading skeleton for the thesis details view.
 * It displays placeholder content while the actual thesis data is being fetched.
 * 
 * Structure:
 * - Card container with header and content sections
 * - Main information section showing project name and description placeholders
 * - Areas of interest section with badge/tag placeholders
 * - Two-column grid layout for category/semester and students/contact info
 * - Centered button placeholder at the bottom
 * 
 * Styling:
 * - Responsive grid layout (1 column on mobile, 2 columns on medium screens)
 * - Consistent spacing and padding
 * - Shadow effect on card
 * - Sky blue theme colors matching the application style
 * 
 * Sub-components used:
 * - MainInformationSkeleton
 * - AreasOfInterestSkeleton
 * - CategoryAndSemesterInfoSkeleton
 * - StudentsAndContactInfoSkeleton
 * 
 * @returns {JSX.Element} A skeleton loading state UI for the thesis details view
 */
function ThesisDetailsSkeleton() {
  return (
    <div className="min-h-full min-w-full mx-auto p-4 space-y-8">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader className="rounded-t-lg">
          <CardTitle className="text-xl font-bold text-sky-800">Información del proyecto de grado</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-4">
            <MainInformationSkeleton />
            <AreasOfInterestSkeleton />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CategoryAndSemesterInfoSkeleton />
              <StudentsAndContactInfoSkeleton />
            </div>
          </div>
          <div className="flex justify-center pt-4"><Skeleton className="h-10 w-40" /></div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * MainInformationSkeleton Component
 * 
 * This component renders a loading skeleton for the main thesis information section.
 * It displays placeholder content while the actual project name and description are being fetched.
 * 
 * Structure:
 * - Project name section with inline skeleton placeholder
 * - Description section with full width skeleton placeholder
 * 
 * Styling:
 * - Semibold headings with large text
 * - Consistent spacing between sections
 * - Gray text color for description area
 * - Flex layout for project name to align skeleton
 * 
 * @returns {JSX.Element} A skeleton loading state UI for the main thesis information
 */
function MainInformationSkeleton() {
  return  (
    <div>
      <h3 className="font-semibold text-lg flex items-center gap-2">Nombre del proyecto: <Skeleton className="h-6 w-[300px] inline-block" /></h3>
      <h3 className="font-semibold text-lg mt-4">Descripción:</h3>
      <p className="text-gray-700">              
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
        </div>
      </p>
    </div>
  )
}

/**
 * AreasOfInterestSkeleton Component
 * 
 * This component renders a loading skeleton for the areas of interest section.
 * It displays placeholder content while the actual areas of interest are being fetched.
 * 
 * Structure:
 * - Section heading for "Areas of Interest"
 * - Flex container with two skeleton pills representing loading areas
 * 
 * Styling:
 * - Semibold heading with large text and bottom margin
 * - Flex layout with wrapping for multiple area pills
 * - Rounded full styling for pill-shaped skeleton loaders
 * - Consistent spacing between skeleton pills
 * 
 * @returns {JSX.Element} A skeleton loading state UI for the areas of interest section
 */
function AreasOfInterestSkeleton() {
  return (
    <div>
      <h3 className="font-semibold text-lg mb-2">Áreas de interés:</h3>
      <div className="flex flex-wrap gap-2 mt-2">
        <Skeleton className="h-7 w-32 rounded-full" />
        <Skeleton className="h-7 w-32 rounded-full" />
      </div>
    </div>
  )
}

/**
 * CategoryAndSemesterInfoSkeleton Component
 * 
 * This component renders a loading skeleton for the category and semester information section.
 * It displays placeholder content while the actual data is being fetched.
 * 
 * Structure:
 * - Two sections with icons and labels:
 *   1. Category section with Tag icon
 *   2. Period/Semester section with Calendar icon
 * 
 * Styling:
 * - Flex layout with gap between icon and content
 * - Icons colored in sky blue
 * - Semibold headings
 * - Skeleton loaders with appropriate widths for data
 * - Consistent vertical spacing between sections
 * 
 * @returns {JSX.Element} A skeleton loading state UI for category and semester information
 */
function CategoryAndSemesterInfoSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-2">
        <Tag className="h-5 w-5 text-sky-800 mt-1" />
        <div className="flex-1">
          <h3 className="font-semibold">Categoría:</h3>
          <Skeleton className="h-4 w-24 mt-1" />
        </div>
      </div>

      <div className="flex items-start gap-2">
        <Calendar className="h-5 w-5 text-sky-800 mt-1" />
        <div className="flex-1">
          <h3 className="font-semibold">Periodo:</h3>
          <Skeleton className="h-4 w-20 mt-1" />
        </div>
      </div>
    </div>
  )
}

/**
 * StudentsAndContactInfoSkeleton Component
 * 
 * This component renders a loading skeleton for the students and contact information section.
 * It displays placeholder content while the actual data is being fetched.
 * 
 * Structure:
 * - Two sections with icons and labels:
 *   1. Maximum students section with Users icon
 *   2. Contact information section with Mail icon
 * 
 * Styling:
 * - Flex layout with gap between icon and content
 * - Icons colored in sky blue
 * - Semibold headings
 * - Skeleton loaders with appropriate widths for data
 * - Consistent vertical spacing between sections
 * 
 * @returns {JSX.Element} A skeleton loading state UI for students and contact information
 */
function StudentsAndContactInfoSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-2">
        <Users className="h-5 w-5 text-sky-800 mt-1" />
        <div className="flex-1">
          <h3 className="font-semibold">Número máximo de estudiantes:</h3>
          <Skeleton className="h-4 w-8 mt-1" />
        </div>
      </div>

      <div className="flex items-start gap-2">
        <Mail className="h-5 w-5 text-sky-800 mt-1" />
        <div className="flex-1">
          <h3 className="font-semibold">Contacto:</h3>
          <Skeleton className="h-4 w-48 mt-1" />
          <Skeleton className="h-4 w-56 mt-1" />
        </div>
      </div>
    </div>
  )
}