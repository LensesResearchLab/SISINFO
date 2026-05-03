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

// Steps del proceso de proyecto de grado (orden visual para el indicador de progreso)
const processSteps = [
  "Postulado",  // Estudiante aplicó, esperando coordinador
  "Aceptado",   // Coordinador aprobó
  "Inscrito",   // Estudiante inscrito oficialmente
  "Propuesta",  // Subiendo/aprobando propuesta
  "30%",        // Nota del 30%
  "Poster",     // Poster y presentación
  "ABET",       // Reporte ABET
  "Finalizado", // Proyecto completado
];


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
        applicationStatus: thesisStatus.status,
      };
    },
  });
  if (isFetching) return <SpinnerPage />;
  if (error || !statusInfo) return <ProjectNotFound />;

  /** Devuelve el label y el índice en processSteps según tus reglas */
function getCurrentStep(
  lastTask: LastTask | null | undefined,
  statusInfo: ProjectStatusInformation,
  applicationStatus?: string
) {

  if (applicationStatus === "Rechazado") {
    return { label: "Rechazado", index: -1 };
  }
  if (applicationStatus === "Retirado") {
    return { label: "Retirado", index: -1 };
  }
  // Si el proyecto está finalizado (sin tareas pendientes), mostrar "Finalizado"
  if (!lastTask && applicationStatus === "Finalizado") {
    return { label: "Finalizado", index: processSteps.indexOf("Finalizado") };
  }
  
  // Si no hay lastTask, usar el status de la aplicación
  if (!lastTask) {
    const label = applicationStatus ?? statusInfo.lastStep ?? "Postulado";
    const index = processSteps.indexOf(label);
    return { label, index: index >= 0 ? index : 0 };
  }

  // Mapeo basado en el step de la tarea actual y el applicationStatus
  let label: string;

    // Step 0: Coordinador debe aprobar
    if (lastTask.step === 0) {
      if (applicationStatus === "Postulado") {
        label = "Postulado";
      } else if (applicationStatus === "Aceptado") {
        label = "Aceptado";
      } else {
        label = applicationStatus ?? "Postulado";
      }
    } 
    // Step 1: Profesor acepta al estudiante
    else if (lastTask.step === 1) {
      // Mientras el profesor no apruebe, seguimos en "Aceptado"
      label = "Aceptado";
    }
    // Step 2-3: Propuesta (subir o aprobar)
    else if (lastTask.step === 2 || lastTask.step === 3) {
      // Ya fue aceptado por profesor => estado ENROLLED
      if (applicationStatus === "Inscrito") {
        label = lastTask.step === 2 ? "Inscrito" : "Propuesta";
      } else {
        label = "Propuesta";
      }
    }
    // Step 4-5: 30% (nota y decisión de retiro)
    else if (lastTask.step === 4 || lastTask.step === 5) {
      label = "30%";
    }
    // Steps 6-8: Poster (subir poster, nota 100%, revisar nota)
    else if (lastTask.step >= 6 && lastTask.step <= 8) {
      label = "Poster";
    }
    // Step 9: ABET
    else if (lastTask.step === 9) {
      label = "ABET";
    }
    // Step 10+: Finalizado
    else if (lastTask.step >= 10) {
      label = "Finalizado";
    }
  // Fallback
  else {
    label = applicationStatus ?? "Postulado";
  }

  const index = processSteps.indexOf(label);
  return { label, index: index >= 0 ? index : 0 };
}



  const infoSections = createStatusSections(statusInfo.statusInfo);
  const stepMessages = createStepMessages();

  const generalInfoProps = {
    title: "Información de inscripción del proyecto de grado",
    sections: infoSections,
  };
  const {label} = getCurrentStep(
    statusInfo.lastTask,                                
    statusInfo.statusInfo,
    statusInfo.applicationStatus
  );

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
  messages.set("Postulado", "Tu proyecto ha sido postulado y está esperando la aprobación del coordinador.");
  messages.set("Aceptado", "El coordinador te aceptó. Falta que el profesor confirme para inscribirte oficialmente.");
  messages.set("Inscrito", "El profesor te aceptó. Estás inscrito oficialmente y debes subir tu propuesta.");
  messages.set("Propuesta", "Tienes que realizar una propuesta y esta tiene que ser revisada y aprobada por el profesor.");
  messages.set("30%", "Tu proyecto ha sido revisado y se encuentra en la etapa de 30% y se te dira si se te recomienda retirar el proyecto.");
  messages.set(
    "Poster",
    "Debes preparar y subir el poster de tu proyecto para que el profesor lo revise y apruebe.",
  );
  messages.set(
    "ABET",
    "El profesor está completando el reporte ABET de tu proyecto. Puedes ver tu nota final.",
  );
  messages.set("Finalizado", "Tu proyecto ha sido finalizado. Felicitaciones por completar el proceso.");
  messages.set("Rechazado", "Tu postulación fue rechazada. Puedes volver a postularte a otro proyecto.");
  messages.set("Retirado", "Has retirado la materia. Tu proyecto de grado ha sido cerrado.");
  return messages;
}