
import { Calendar, FileText, Mail, Star, User } from "lucide-react"
import { useEffect, useState } from "react"
import { getThesisStatusInformation } from "../services/thesisService";
import TabStatus from "components/custom/tab-status";
import { StatusInformation } from "../types/Thesis";
import SpinnerPage from "components/custom/spinner-page";


/**
 * ThesisStatus Component
 * 
 * This component displays the status and information of a student's undergraduate thesis.
 * It fetches thesis status data and displays it in a tabbed interface.
 * 
 * States:
 * - isLoading: Boolean indicating if data is being fetched
 * - statusInformation: Object containing thesis status details like semester, title, advisor, etc.
 * 
 * Features:
 * - Shows loading skeleton while data is being fetched
 * - Displays thesis information in two tabs:
 *   1. General information (semester, title, advisor, student details)
 *   2. Status information (current step in thesis process)
 * - Tracks thesis progress through defined steps
 * - Shows relevant status messages based on current step
 * 
 * Layout:
 * - Tabbed interface with general info and status tabs
 * - Loading skeleton during data fetch
 * - Organized sections of thesis information
 * 
 * @returns {JSX.Element} A tabbed interface showing thesis status and information
 */
export default function ThesisStatus() {
  const [isLoading, setIsLoading] = useState(true);
  const [statusInformation, setStatusInformation] = useState<StatusInformation>({
    semester: "",
    projectTitle: "",
    advisor: "",
    student: "",
    studentEmail: "",
    grade: "",
    lastStep: "",
  })
  useEffect(() => {
    getThesisStatusInformation().then((data => setStatusInformation(data))).finally(() => setIsLoading(false))
  }, [])

  const sections = getSections(statusInformation)
  const steps = ["Postulado", "Aceptado", "Inscrito", "Informe", "Finalizado"]
  const messagePerStep = getMessagesPerStep()

  const generalInformationProps = {title: "Información de inscripción proyecto de grado", sections}
  const statusProps = {currentStatus: statusInformation.lastStep, statusMessage: messagePerStep.get(statusInformation.lastStep) || "", steps, title: "Estado inscripción proyecto de grado"}
  
  if (isLoading) return <SpinnerPage />;
  return <TabStatus general={generalInformationProps} status={statusProps} />
}

/**
 * getSections Function
 * 
 * This function generates an array of section objects containing thesis information
 * to be displayed in the UI. Each section has a title, description and icon.
 * 
 * @param {StatusInformation} statusInformation - Object containing thesis status details
 * 
 * @returns {Array} Array of section objects with the following properties:
 * - title: String label for the section
 * - description: Corresponding value from statusInformation
 * - icon: React component for the section icon
 * 
 * Sections included:
 * - Semester information with Calendar icon
 * - Project title with FileText icon  
 * - Advisor name with User icon
 * - Student name with User icon
 * - Student email with Mail icon
 * - Grade with Star icon
 * 
 * All icons use consistent styling (sky blue color, small size)
 */
function getSections(statusInformation: StatusInformation) {
  return [
    { title: "Semestre de inicio", description: statusInformation.semester, icon: <Calendar className="h-5 w-5 text-sky-800 mt-1" /> },
    { title: "Tema del proyecto", description:  statusInformation.projectTitle, icon: <FileText className="h-5 w-5 text-sky-800 mt-1" /> },
    { title: "Asesor", description:  statusInformation.advisor, icon: <User className="h-5 w-5 text-sky-800 mt-1" /> },
    { title: "Estudiante", description:  statusInformation.student, icon: <User className="h-5 w-5 text-sky-800 mt-1" /> },
    { title: "Correo del estudiante", description:  statusInformation.studentEmail, icon: <Mail className="h-5 w-5 text-sky-800 mt-1" /> },
    { title: "Calificación", description:  statusInformation.grade, icon: <Star className="h-5 w-5 text-sky-800 mt-1" /> },
  ]
}

/**
 * getMessagesPerStep Function
 * 
 * This function creates a map of status messages for each step in the thesis process.
 * It maps each step to a corresponding message that explains the status of the thesis.
 * 
 * @returns {Map<string, string>} A map of status messages for each step
 * 
 * Messages:
 * - "Postulado": "Tu proyecto ha sido postulado y se encuentra en proceso de revisión"
 * - "Aceptado": "Tu proyecto ha sido aceptado y se encuentra en proceso de revisión"
 * - "Inscrito": "Tu inscripción ha sido aceptada y se encuentra en proceso de revisión"
 * - "Informe": "Tu informe final ha sido entregado y se encuentra en proceso de revisión"
 * - "Finalizado": "Tu proyecto ha sido finalizado y se encuentra en proceso de revisión"
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