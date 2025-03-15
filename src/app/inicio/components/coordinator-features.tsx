import InformationSection from "@/app/inicio/components/information-section";
import { ROUTES } from "@/app/routes";
import { FileText, PenSquare, Calendar, BookOpen, AlertTriangle } from "lucide-react";

const SettingsFeatures = [
  {
    Icon: FileText,
    title: "Consultar programas de clases",
    description: "Aquí puedes ver los programas de clases por periodo.",
    url: ROUTES.COURSE_PROGRAMS
  },
  {
    Icon: PenSquare,
    title: "Consultar cargas de notas",
    description: "Aquí puedes ver la carga de notas de los distintos cursos.",
    url: ROUTES.GRADE_LOAD
  },
  {
    Icon: Calendar,
    title: "Administrar cartelera",
    description: "Aquí puedes administrar la cartelera de los distintos periodos.",
    url: ROUTES.BULLETIN_BOARD
  },
];

const alertReportFeatures = [
  {
    Icon: BookOpen,
    title: "Generar reportes",
    description: "Aquí puedes generar reportes de las distintas actividades.",
    url: ROUTES.REPORTS
  },
  {
    Icon: PenSquare,
    title: "Alerta de fechas",
    description: "Aqui puedes generar alertas de fechas importantes.",
    url: ROUTES.DATE_ALERTS
  },
];

const TeachingAssistantFeatures = [
  {
    Icon: AlertTriangle,
    title: "Cargar archivo",
    description: "Carga un archivo con los monitores de los distintos cursos.",
    url: ROUTES.UPLOAD_TAS
  },
];



export default function CoordinatorFeatures() {
  return (
    <div className='min-h-full min-w-full mx-auto p-4 space-y-8'>
      <InformationSection title="Configuración del semestre" features={SettingsFeatures}  background="bg-core-highlight"/>
      <InformationSection title="Reportes y alertas" features={alertReportFeatures}  background="bg-core-highlight"/>
      <InformationSection title="Monitores" features={TeachingAssistantFeatures}  background="bg-core-highlight"/>
    </div>
  )
}