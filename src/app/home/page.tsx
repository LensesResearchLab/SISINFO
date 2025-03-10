"use client"
import Link from "next/link"
import { FileText, PenSquare, Calendar, AlertTriangle, BookOpen, Video, LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card";


const thesisFeatures = [
  {
    Icon: FileText,
    title: "Consultar temas",
    description: "Aquí puedes ver los proyectos disponibles y aplicar al que te interese.",
    url: "/undergraduate-thesis/thesis-list"
  },
  {
    Icon: PenSquare,
    title: "Ver estado de aplicación",
    description: "Aquí puedes ver los detalles de tu inscripción al proyecto de grado.",
    url: "/undergraduate-thesis/thesis-status"
  },
  {
    Icon: Calendar,
    title: "Consultar fechas",
    description: "Aquí puedes consultar las fechas importantes del proceso.",
    url: "/undergraduate-thesis/thesis-dates"
  },
];

const assistanceFeatures = [
  {
    Icon: BookOpen,
    title: "Ver asistencias disponibles",
    description: "Aquí puedes ver las asistencias disponibles y aplicar a estas.",
    url: "/graduated-assistance/assistance-list"
  },
  {
    Icon: PenSquare,
    title: "Ver estado de inscripción",
    description: "Consulta como se encuentra tu proceso de asistencia graduada.",
    url: "/graduated-assistance/assistance-applied-list"
  },
];

const supportFeatures = [
  {
    Icon: AlertTriangle,
    title: "Reporte de incidencias",
    description: "Reporta cualquier problema que tengas con la plataforma.",
    url: "/support/incidence"
  },
  {
    Icon: Video,
    title: "Tutoriales",
    description: "Aquí puedes ver tutoriales para aprender a usar la plataforma.",
    url: "/support/tutorials"
  },
  {
    Icon: BookOpen,
    title: "Contactar a coordinadores",
    description: "Aquí puedes contactar a los coordinadores de la plataforma.",
    url: "/support/contact"
  },
];


export default function Home() {
  return (
    <div className='min-h-full min-w-full mx-auto p-4 space-y-8'>
      <section>
        <h2 className="text-2xl font-bold p-4 bg-[#379777] text-white rounded">Proyectos de grado</h2>
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          {thesisFeatures.map((feature, index) => (
            <InformationCard key={index} {...feature} />
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold p-4 bg-[#F18F01] text-white rounded">Asistencias graduadas</h2>
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          {assistanceFeatures.map((feature, index) => (
            <InformationCard key={index} {...feature} />
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold p-4 bg-[#483C46] text-white rounded">Soporte</h2>
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          {supportFeatures.map((feature, index) => (
            <InformationCard key={index} {...feature} />
          ))}
        </div>
      </section>

    </div>
  );
}

interface InformationCardProps {
  /** Icon component to display */
  Icon: LucideIcon;
  /** Title text for the card */
  title: string;
  /** Description text explaining the feature */
  description: string;
  /** URL route that the card links to */
  url: string;
}

/**
 * InformationCard Component
 * 
 * A clickable card component that displays information about a feature or section of the application.
 * Contains an icon, title, and description, and links to a specific route when clicked.
 * 
 * @param {InformationCardProps} props
 * @param {LucideIcon} props.Icon - The icon component to display
 * @param {string} props.title - The title of the feature
 * @param {string} props.description - A description of the feature
 * @param {string} props.url - The route to navigate to when clicked
 * @returns {JSX.Element} A card component with icon, title and description that links to a route
 */
function InformationCard({ Icon, title, description, url }: InformationCardProps) {
  return (
    <Link href={`/home/${url}`}>
      <Card>
        <CardContent className="p-6 flex items-start space-x-4">
          <Icon className="h-8 w-8 flex-shrink-0" />
          <div>
          <h3 className="font-semibold mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}