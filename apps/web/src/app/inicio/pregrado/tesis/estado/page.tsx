"use client";

import { Calendar, FileText, Mail, Star, User } from "lucide-react";
import { getUndergraduateThesisStatusInformation } from "@/app/services/project.service";
import SpinnerPage from "@/components/shared/spinner-page";
import TabStatus from "@/components/shared/tab-status";
import { useQuery } from "@tanstack/react-query";
import { ProjectStatusInformation } from "@/app/types/status-information.type";
import { getUserInfo } from "@/app/auth/auth-service";
import { ProjectApplicationToProjectStatusInformation } from "@/app/mappers/project-status-information";
import { mapPeriodToString } from "@/app/mappers/period.mapper";
import { LastTask } from "@/app/types/entities/last-task.type";






/**
 * ProjectStatus Component
 *
 * Displays the registration status and details of a student's undergraduate thesis.
 * Uses React Query to fetch and cache the status information.
 *
 * - While loading, shows a spinner.
 * - If an error occurs or no data is available, shows an error component.
 * - Displays the information in two tabs: general info and status info.
 *
 * @returns {JSX.Element} Tabbed interface with thesis status and details.
 */
export default function ProjectStatus() {
  const {
    data: statusInfo,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["student-project-status"],
    queryFn: async () => {
      const userData = await getUserInfo();
      const thesisStatus = await getUndergraduateThesisStatusInformation(userData.user.id);
      return {
        statusInfo: await ProjectApplicationToProjectStatusInformation(thesisStatus),
        lastTask: thesisStatus.actualTask,
      };
    },
  });
  if (isFetching) return <SpinnerPage />;
  if (error || !statusInfo) return <ProjectNotFound />;

  /** Devuelve el label y el índice en processSteps según tus reglas */
function getCurrentStep(
  lastTask: LastTask | null | undefined,
  statusInfo: ProjectStatusInformation
) {
  // 1) Si no hay lastTask, usa statusInfo.statusInfo.lastStep (o statusInfo.lastStep)
  const externalLastStep = statusInfo.lastStep; // ajusta si tu objeto es statusInfo.statusInfo.lastStepç
  
  if (!lastTask) {
    const label = externalLastStep ?? "Postulado";
    const index = processSteps.indexOf(label);
    return { label, index };
  }

  // 2) Si hay lastTask, mapeo por step
  let label: string;

  if (lastTask.step === 0 || lastTask.step === 1) {
    label = "Propuesta";
  } else if (lastTask.step === 2 || lastTask.step === 3) {
    label = "Treinta-30%";
  } else if (lastTask.step === 4) {
    label = "Poster";
  } else if (lastTask.step === 5 || lastTask.step === 6) {
    label = "Documento Final";
  } else {
    // fallback seguro si viene un step inesperado
    label = externalLastStep ?? "Postulado";
  }

  // 3) Regla especial: si es 6 y approved === false -> 'Finalizado'
  if (lastTask.step === 7 && lastTask.approved === false) {
    label = "Finalizado";
  }

  const index = processSteps.indexOf(label);
  return { label, index };
}



  const infoSections = createStatusSections(statusInfo.statusInfo);
  const processSteps = ["Postulado", "Pendiente", "Aceptado", "Inscrito",'Propuesta','Treinta-30%','Poster','Documento Final',"Finalizado"];
  const stepMessages = createStepMessages();

  const generalInfoProps = {
    title: "Información de inscripción del proyecto de grado",
    sections: infoSections,
  };
  const {label} = getCurrentStep(
  statusInfo.lastTask,                                
  statusInfo.statusInfo // adapta esta línea a tu shape exacto
);
console.log("Current Step Label:", label); // Debugging line

  const statusTabProps = {
    currentStatus: label,

    statusMessage: stepMessages.get(label) ?? "",
    steps: processSteps,
    title: "Estado de inscripción del proyecto de grado",
  };
  

  return <TabStatus general={generalInfoProps} status={statusTabProps} />;
}

/**
 * ProjectNotFound Component
 *
 * Renders a message when thesis registration data is not found.
 *
 * @returns {JSX.Element} Not found message.
 */
function ProjectNotFound() {
  return (
    <div className="min-h-full mx-auto p-4 space-y-8 container max-w-[800px]">
      <div className="w-full bg-white shadow-lg rounded-xl p-5 h-full space-y-4">
        <h2 className="text-xl font-bold text-foreground-soft">
          Información de inscripción no encontrada
        </h2>
        <p className="text-foreground-soft">
          No se pudo encontrar información de inscripción para el proyecto de grado.
        </p>
      </div>
    </div>
  );
}

/**
 * createStatusSections
 *
 * Generates an array of objects representing the sections of thesis registration data.
 * Each section includes a title, description, and an icon.
 *
 * @param {ProjectStatusInformation} statusInfo - Object with thesis status details.
 * @returns {Array} Array of section objects.
 */
function createStatusSections(statusInfo: ProjectStatusInformation) {
  return [
    {
      title: "Semestre de inicio",
      description: mapPeriodToString(statusInfo.period),
      icon: <Calendar className="h-5 w-5 text-core mt-1" />,
    },
    {
      title: "Tema del proyecto",
      description: statusInfo.project.title,
      icon: <FileText className="h-5 w-5 text-core mt-1" />,
    },
    {
      title: "Asesor",
      description: statusInfo.professor.user.name,
      icon: <User className="h-5 w-5 text-core mt-1" />,
    },
    {
      title: "Estudiante",
      description: statusInfo.student.user.name,
      icon: <User className="h-5 w-5 text-core mt-1" />,
    },
    {
      title: "Correo del estudiante",
      description: statusInfo.student.user.email,
      icon: <Mail className="h-5 w-5 text-core mt-1" />,
    },
    {
      title: "Calificación",
      description: statusInfo.grade,
      icon: <Star className="h-5 w-5 text-core mt-1" />,
    },
  ];
}

/**
 * createStepMessages
 *
 * Returns a Map that relates each thesis process step with a corresponding status message.
 *
 * @returns {Map<string, string>} Mapping of process steps to messages.
 */
function createStepMessages() {
  const messages = new Map<string, string>();
  messages.set("Postulado", "Tu proyecto ha sido postulado y se encuentra en proceso de revisión.");
  messages.set("Pendiente", "Tu proyecto está pendiente de revisión, por favor espera la respuesta.");
  messages.set("Aceptado", "Tu proyecto ha sido aceptado.");
  messages.set("Inscrito", "Tu inscripción ha sido completada.");
  messages.set("Propuesta", "Tienes que realizar una propuesta y esta tiene que ser revisada y aprobada por el profesor.");
  messages.set("Treinta-30%", "Tu proyecto ha sido revisado y se encuentra en la etapa de 30% y se te dira si se te recomienda retirar el proyecto.");
  messages.set("Poster", "Tienes que realizar un poster sobre tu proyecto y debe ser aprobado por el profesor.");
  messages.set("Documento Final", "Tu proyecto se encuentra en la etapa final, debes subir el documento final para su revisión.");
  messages.set("Finalizado", "Tu proyecto ha sido finalizado. Felicitaciones por completar el proceso.");
  return messages;
}