import InformationSection from "@/app/inicio/components/information-section";
import { ROUTES } from "@/app/routes";
import { FileText, PenSquare, Calendar, BookOpen} from "lucide-react";

const undergraduateThesisFeatures = [
  {
    Icon: FileText,
    title: "Publicar y consultar proyectos de pregrado",
    description: "Aquí puedes publicar y consultar los proyectos de grado activos.",
    url: ROUTES.PROFESSOR_UNDERGRADUATE_THESIS_LIST
  },
  {
    Icon: PenSquare,
    title: "Consultar histórico proyectos de grado",
    description: "Aqui puedes ver los proyectos de grado que han existido.",
    url: ROUTES.PROFESSOR_UNDERGRADUATE_THESIS_HISTORY
  },
  {
    Icon: Calendar,
    title: "Consultar fechas",
    description: "Aquí puedes consultar las fechas importantes del proceso.",
    url: ROUTES.PROFESSOR_UNDERGRADUATE_THESIS_DATES
  },
];

const postgraduateThesisFeatures = [
    {
      Icon: FileText,
      title: "Publicar y consultar proyectos de maestria",
      description: "Aquí puedes publicar y consultar los proyectos de grado activos.",
      url: ROUTES.PROFESSOR_POSTGRADUATE_THESIS_LIST
    },
    {
      Icon: PenSquare,
      title: "Consultar histórico proyectos de grado",
      description: "Aqui puedes ver los proyectos de grado que han existido.",
      url: ROUTES.PROFESSOR_POSTGRADUATE_THESIS_HISTORY
    },
    {
      Icon: Calendar,
      title: "Consultar fechas",
      description: "Aquí puedes consultar las fechas importantes del proceso.",
      url: ROUTES.PROFESSOR_POSTGRADUATE_THESIS_DATES
    },
  ];

const assistanceFeatures = [
  {
    Icon: BookOpen,
    title: "Ver asistencias publicadas",
    description: "Aqui puedes ver las asistencias publicadas y sus aplicantes.",
    url: ROUTES.PROFESSOR_ASSISTANCE_LIST
  },
  {
    Icon: PenSquare,
    title: "Crear oferta",
    description: "Crea oferta de asistencia graduada",
    url: ROUTES.PROFESSOR_NEW_ASSISTANCE
  },
];

export default function ProfessorFeatures() {
  return (
    <div className='min-h-full min-w-full mx-auto p-4 space-y-8'>
      <InformationSection title="Proyecto de pregrado" features={undergraduateThesisFeatures} background="bg-core-highlight"/>
      <InformationSection title="Proyecto de maestria" features={postgraduateThesisFeatures} background="bg-core-highlight"/>
      <InformationSection title="Asistencias graduadas" features={assistanceFeatures} background="bg-core-highlight"/>
    </div>
  )
}