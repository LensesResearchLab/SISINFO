"use client";
import { Calendar, FileText, Mail, User } from "lucide-react";
import { use, useEffect, useState } from "react";
import { StatusInformation } from "@/app/types/graduated-assistance.type";
import TabStatus, { SectionProps } from "@/components/shared/tab-status";
import { useRouter } from "next/navigation";
import SpinnerPage from "@/components/shared/spinner-page";
import { getAssistanceStatusById } from "@/app/services/assistance.service";

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
export default function AssistanceStatus({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { id } = use(params);
  const [statusInformation, setStatusInformation] = useState<StatusInformation>(
    {
      id: "0",
      graduatedAssistance: {
        id: "0",
        title: "",
        category: "",
        description: "",
        requirements: [],
        startDate: new Date(),
        endDate: new Date(),
        professor: {
          user: {
            id: "",
            name: "",
            email: "",
          },
        },
      },
      status: "",
      student: {
        user: {
          id: "",
          name: "",
          email: "",
        },
        isUndergraduate: false,
        code: "",
      },
    }
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return router.push("/404");
      try {
        const data = await getAssistanceStatusById(id);
        setStatusInformation(data);
        setIsLoading(false);
      } catch {
        router.push("/404");
      }
    };

    fetchData();
  }, [id, router]);

  const sections: SectionProps[] = getSections(statusInformation);
  const steps = ["Postulado", "Aceptado", "Inscrito"];
  const messagePerStep = getMessagesPerStep();

  const generalInformationProps = {
    title: "Información de aplicacion asistencia graduada",
    sections,
  };
  const statusProps = {
    currentStatus: statusInformation.status,
    statusMessage: messagePerStep.get(statusInformation.status) ?? "",
    steps: statusInformation.status === "Rechazado" ? [] : steps,
    title: "Estado inscripción proyecto de grado",
  };

  if (isLoading) {
    return <SpinnerPage />;
  }

  return isLoading ? (
    <></>
  ) : (
    <TabStatus general={generalInformationProps} status={statusProps} />
  );
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
function getSections(statusInformation: StatusInformation)  {
  return [
    {
      title: "Semestre de inicio",
      description: statusInformation.graduatedAssistance.startDate.toLocaleDateString(
        "es-CO",
        {
          year: "numeric",
          month: "long",
          day: "2-digit",
        }
      ),
      icon: <Calendar className="h-5 w-5 text-core mt-1" />,
    },
    {
      title: "Nombre de la asistencia",
      description: statusInformation.graduatedAssistance.title,
      icon: <FileText className="h-5 w-5 text-core mt-1" />,
    },
    {
      title: "Profesor",
      description: statusInformation.graduatedAssistance.professor.user.name,
      icon: <User className="h-5 w-5 text-core mt-1" />,
    },
    {
      title: "Estudiante",
      description: statusInformation.student.user.name,
      icon: <User className="h-5 w-5 text-core mt-1" />,
    },
    {
      title: "Correo del estudiante",
      description: statusInformation.student.user.email,
      icon: <Mail className="h-5 w-5 text-core mt-1" />,
    },
    {
      title: "Archivo adjunto",
      description: "statusInformation.studentCv",
      icon: <FileText className="h-5 w-5 text-core mt-1" />,
    },
  ];
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
 * - "Rechazado" : "Tu aplicacion fue rechazada." -- En este caso no se visualizan los demas pasos.
 */
function getMessagesPerStep() {
  const messagePerStep = new Map<string, string>();
  messagePerStep.set(
    "Postulado",
    "Tu aplicacion ha sido enviada y se encuentra en proceso de revisión"
  );
  messagePerStep.set(
    "Aceptado",
    "Tu aplicacion ha sido aceptada y se encuentra en proceso de revisión"
  );
  messagePerStep.set(
    "Inscrito",
    "Tu aplicacion ha sido aceptada y se encuentra en proceso de revisión"
  );
  messagePerStep.set("Rechazado", "Tu aplicación ha sido rechazada");
  return messagePerStep;
}
