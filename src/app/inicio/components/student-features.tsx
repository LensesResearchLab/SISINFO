import InformationSection from "@/app/inicio/components/information-section";
import { ROUTES } from "@/app/routes";
import { FileText, PenSquare, Calendar, BookOpen, AlertTriangle, Video } from "lucide-react";

const thesisFeatures = [
  {
    Icon: FileText,
    title: "Consultar temas",
    description: "Aquí puedes ver los proyectos disponibles y aplicar al que te interese.",
    url: ROUTES.UNDERGRADUATE_THESIS_LIST
  },
  {
    Icon: PenSquare,
    title: "Ver estado de aplicación",
    description: "Aquí puedes ver los detalles de tu inscripción al proyecto de grado.",
    url: ROUTES.UNDERGRADUATE_THESIS_STATUS
  },
  {
    Icon: Calendar,
    title: "Consultar fechas",
    description: "Aquí puedes consultar las fechas importantes del proceso.",
    url: ROUTES.UNDERGRADUATE_THESIS_DATES
  },
];

const assistanceFeatures = [
  {
    Icon: BookOpen,
    title: "Ver asistencias disponibles",
    description: "Aquí puedes ver las asistencias disponibles y aplicar a estas.",
    url: ROUTES.ASSISTANCE_LIST
  },
  {
    Icon: PenSquare,
    title: "Ver estado de inscripción",
    description: "Consulta como se encuentra tu proceso de asistencia graduada.",
    url: ROUTES.ASSISTANCE_APPLIED_LIST
  },
];

const supportFeatures = [
  {
    Icon: AlertTriangle,
    title: "Reporte de incidencias",
    description: "Reporta cualquier problema que tengas con la plataforma.",
    url: ROUTES.SUPPORT_INCIDENCE
  },
  {
    Icon: Video,
    title: "Tutoriales",
    description: "Aquí puedes ver tutoriales para aprender a usar la plataforma.",
    url: ROUTES.SUPPORT_TUTORIALS
  },
  {
    Icon: BookOpen,
    title: "Contactar a coordinadores",
    description: "Aquí puedes contactar a los coordinadores de la plataforma.",
    url: ROUTES.SUPPORT_CONTACT
  },
];

export default function StudentFeatures() {
  return (
    <div className='min-h-full min-w-full mx-auto p-4 space-y-8'>
      <InformationSection title="Proyectos de grado" features={thesisFeatures}  background="bg-core-highlight"/>
      <InformationSection title="Asistencias graduadas" features={assistanceFeatures}  background="bg-core-highlight"/>
      <InformationSection title="Soporte" features={supportFeatures} background="bg-core-highlight"/>
    </div>
  )
}