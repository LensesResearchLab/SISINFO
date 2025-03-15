"use client";
import { Calendar, FileText, Mail, Star, User } from "lucide-react"
import { getThesisStatusInformation } from "@/app/inicio/pregrado/tesis/services/thesis.service"
import { StatusInformation } from "@/app/inicio/pregrado/tesis/types/thesis.type"
import SpinnerPage from "@/components/shared/spinner-page";
import TabStatus from "@/components/shared/tab-status";
import { useQuery } from "@tanstack/react-query";

/**
 * ThesisStatus Component
 * 
 * This component displays the status and information of a student's undergraduate thesis.
 * It fetches thesis status data and displays it in a tabbed interface.
 * 
 * States:
 * - statusInformation: Object containing thesis status details like semester, title, advisor, etc.
 * - isFetching: Boolean indicating if data is being fetched
 * - error: Any error that occurred during data fetching
 * 
 * Features:
 * - Uses React Query for data fetching and caching
 * - Shows loading spinner while data is being fetched
 * - Displays thesis information in two tabs:
 *   1. General information (semester, title, advisor, student details)
 *   2. Status information (current step in thesis process)
 * - Tracks thesis progress through defined steps
 * - Shows relevant status messages based on current step
 * 
 * Layout:
 * - Tabbed interface with general info and status tabs
 * - Loading spinner during data fetch
 * - Error state handling
 * - Organized sections of thesis information
 * 
 * @returns {JSX.Element} A tabbed interface showing thesis status and information
 */
export default function ThesisStatus() {
  const { data: statusInformation, isFetching, error } = useQuery({
    queryKey: ['student-thesis-status'],
    queryFn: getThesisStatusInformation,
  });

  if (isFetching) return <SpinnerPage />;
  if (error || !statusInformation) return <ThesisNotFound />;

  const sections = getSections(statusInformation)
  const steps = ["Postulado", "Aceptado", "Inscrito", "Informe", "Finalizado"]
  const messagePerStep = getMessagesPerStep()
  const generalInformationProps = {title: "Información de inscripción proyecto de grado", sections}
  const statusProps = {currentStatus: statusInformation.lastStep, statusMessage: messagePerStep.get(statusInformation.lastStep) || "", steps, title: "Estado inscripción proyecto de grado"}
  
  return <TabStatus general={generalInformationProps} status={statusProps} />
}


/**
 * ThesisNotFound Component
 * 
 * Displays an error message when thesis information cannot be found.
 * 
 * Layout:
 * - Centered container with max width
 * - White background card with shadow
 * - Error heading and descriptive message
 * 
 * Styling:
 * - Uses Tailwind classes for spacing, colors and layout
 * - Responsive container with padding
 * - Rounded corners and shadow for card
 * 
 * @returns {JSX.Element} Error message component
 */
function ThesisNotFound() {
  return (
    <div className="min-h-full mx-auto p-4 space-y-8 container max-w-[900px]">
      <div className="w-full bg-white shadow-lg rounded-xl p-5 h-full space-y-4">
        <h2 className="text-xl font-bold text-gray-800">No se encontró información de inscripción</h2>
        <p className="text-gray-600">No se pudo encontrar información de inscripción para el proyecto de grado</p>
      </div>
    </div>
  )
}

/**
 * getSections Function
 * 
 * Creates an array of section objects containing thesis information for display.
 * Each section represents a piece of thesis information with consistent styling.
 * 
 * @param {StatusInformation} statusInformation - Object containing thesis details
 * 
 * @returns {Array} Array of section objects with:
 * - title: Section label
 * - description: Value from statusInformation
 * - icon: React component icon
 * 
 * Section Types:
 * 1. Starting semester (Calendar icon)
 * 2. Project title (FileText icon)
 * 3. Advisor name (User icon)
 * 4. Student name (User icon)
 * 5. Student email (Mail icon)
 * 6. Grade (Star icon)
 * 
 * Icons are styled consistently with sky blue color and small size
 */
function getSections(statusInformation: StatusInformation) {
  return [
    { title: "Semestre de inicio", description: statusInformation.semester, icon: <Calendar className="h-5 w-5 text-core mt-1" /> },
    { title: "Tema del proyecto", description:  statusInformation.projectTitle, icon: <FileText className="h-5 w-5 text-core mt-1" /> },
    { title: "Asesor", description:  statusInformation.advisor, icon: <User className="h-5 w-5 text-core mt-1" /> },
    { title: "Estudiante", description:  statusInformation.student, icon: <User className="h-5 w-5 text-core mt-1" /> },
    { title: "Correo del estudiante", description:  statusInformation.studentEmail, icon: <Mail className="h-5 w-5 text-core mt-1" /> },
    { title: "Calificación", description:  statusInformation.grade, icon: <Star className="h-5 w-5 text-core mt-1" /> },
  ]
}

/**
 * getMessagesPerStep Function
 * 
 * Creates a mapping between thesis process steps and their corresponding status messages.
 * Used to display appropriate feedback based on the current thesis stage.
 * 
 * @returns {Map<string, string>} Map where:
 * - Key: Step name in Spanish
 * - Value: Descriptive status message
 * 
 * Steps and Messages:
 * 1. "Postulado" (Submitted) - Project submitted and under review
 * 2. "Aceptado" (Accepted) - Project accepted and under review
 * 3. "Inscrito" (Enrolled) - Registration accepted and under review
 * 4. "Informe" (Report) - Final report submitted and under review
 * 5. "Finalizado" (Finished) - Project completed and under review
 */
function getMessagesPerStep() {
  const messagePerStep = new Map<string, string>()
  messagePerStep.set("Postulado", "Tu proyecto ha sido postulado y se encuentra en proceso de revisión")
  messagePerStep.set("Aceptado", "Tu proyecto ha sido aceptado y se encuentra en proceso de revisión")
  messagePerStep.set("Inscrito", "Tu inscripción ha sido aceptada y se encuentra en proceso de revisión")
  messagePerStep.set("Informe", "Tu informe final ha sido entregado y se encuentra en proceso de revisión")
  messagePerStep.set("Finalizado", "Tu proyecto ha sido finalizado y se encuentra en proceso de revisión")
  return messagePerStep
}