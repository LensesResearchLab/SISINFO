import { Calendar, FileText, Mail, User } from "lucide-react"
import { useEffect, useState } from "react"
import { getAssistanceStatusById } from "../services/assistanceService";
import TabStatus from "components/custom/tab-status";
import { StatusInformation } from "../types/Assistance";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';





/**
 * AssistanceStatus Component
 * 
 * This component displays the status and information of a student's postgraduate assistance application.
 * It fetches the application's status data and displays it in a tabbed interface.
 * 
 * States:
 * - isLoading: Boolean indicating if data is being fetched
 * - statusInformation: Object containing assistance status details like semester, name, professor, etc.
 * 
 * Features:
 * - Displays application's information in two tabs:
 *   1. General information (semester, name, professor, student details)
 *   2. Status information (current step in the application process)
 * - Tracks the application progress through defined steps
 * - Shows relevant status messages based on current step
 * 
 * Layout:
 * - Tabbed interface with general info and status tabs
 * - Organized sections of assistance application information
 * 
 * @returns {JSX.Element} A tabbed interface showing application status and information
 */
export default function AssistanceStatus() {
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate();
  const { id } = useParams();
  const [statusInformation, setStatusInformation] = useState<StatusInformation>({
    id: 0,
    assistance_id: 0,
    start_semester: "",
    name: "",
    professor: "",
    student: "",
    studentEmail: "",
    studentCv: "",
    lastStep: "",
    inscription_date: new Date(),
    clasification: ""
  })

  
  useEffect(() => {
      const fetchData = async () => {
        if (!id) return navigate("/404");
        try { 
          const data = await getAssistanceStatusById(id);
          setStatusInformation(data);
          setIsLoading(false);
        } catch {
          navigate("/404");
        }
      };
    
      fetchData();
    }, [id, navigate]);

  const sections = getSections(statusInformation)
  const steps = ["Postulado", "Aceptado", "Inscrito"]
  const messagePerStep = getMessagesPerStep()

  const generalInformationProps = {title: "Información de aplicacion asistencia graduada", sections}
  const statusProps = {currentStatus: statusInformation.lastStep, statusMessage: messagePerStep.get(statusInformation.lastStep) || "", steps, title: "Estado inscripción proyecto de grado"}
  
  return (isLoading ? <></> : <TabStatus general={generalInformationProps} status={statusProps} />)
}




/**
 * getSections Function
 * 
 * This function generates an array of section objects containing assistance status information
 * to be displayed in the UI. Each section has a title, description and icon.
 * 
 * @param {StatusInformation} statusInformation - Object containing assistance application status details
 * 
 * @returns {Array} Array of section objects with the following properties:
 * - name: String label for the section
 * - description: Corresponding value from statusInformation
 * - icon: React component for the section icon
 * 
 * Sections included:
 * - Semester information with Calendar icon
 * - Name of assistance with FileText icon  
 * - Professor name with User icon
 * - Student name with User icon
 * - Student email with Mail icon
 * - Pdf file with FileText icon
 * 
 * All icons use consistent styling (sky blue color, small size)
 */
function getSections(statusInformation: StatusInformation) {
  return [
    { title: "Semestre de inicio", description: statusInformation.start_semester, icon: <Calendar className="h-5 w-5 text-sky-800 mt-1" /> },
    { title: "Nombre de la asistencia", description:  statusInformation.name, icon: <FileText className="h-5 w-5 text-sky-800 mt-1" /> },
    { title: "Profesor", description:  statusInformation.professor, icon: <User className="h-5 w-5 text-sky-800 mt-1" /> },
    { title: "Estudiante", description:  statusInformation.student, icon: <User className="h-5 w-5 text-sky-800 mt-1" /> },
    { title: "Correo del estudiante", description:  statusInformation.studentEmail, icon: <Mail className="h-5 w-5 text-sky-800 mt-1" /> },
    { title: "Archivo adjunto", description:  statusInformation.studentCv, icon: <FileText className="h-5 w-5 text-sky-800 mt-1" /> },
  ]
}



/**
 * getMessagesPerStep Function
 * 
 * This function creates a map of status messages for each step in the assistance application process.
 * It maps each step to a corresponding message that explains the status of the application process.
 * 
 * @returns {Map<string, string>} A map of status messages for each step
 * 
 * Messages:
 * - "Postulado": "Tu aplicacion ha sido enviada y se encuentra en proceso de revisión"
 * - "Aceptado": "Tu aplicacion ha sido aceptado y se encuentra en proceso de revisión"
 * - "Inscrito": "Tu aplicacion ha sido aceptada y se encuentra en proceso de revisión"
*/ 
function getMessagesPerStep() {
  const messagePerStep = new Map<string, string>()
  messagePerStep.set("Postulado", "Tu aplicacion ha sido enviada y se encuentra en proceso de revisión")
  messagePerStep.set("Aceptado", "Tu aplicacion ha sido aceptada y se encuentra en proceso de revisión")
  messagePerStep.set("Inscrito", "Tu aplicacion ha sido aceptada y se encuentra en proceso de revisión")
  return messagePerStep
}