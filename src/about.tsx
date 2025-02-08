import { FileText, PenSquare, Calendar, AlertTriangle, BookOpen, Video } from "lucide-react"
import { Card, CardContent } from "components/ui/card"
import { Link } from "react-router-dom";

/*
  This component is the home page of the application. It contains information about the features of the application.
  It uses the InformationCard component to display the features.
*/
export default function About() {
  const thesisFeatures = [
    {
      Icon: FileText,
      title: "Consultar temas",
      description: "Aquí puedes ver los proyectos disponibles y aplicar al que te interese.",
      url: "/tesis_pregrado/lista_de_tesis"
    },
    {
      Icon: PenSquare,
      title: "Ver estado de aplicación",
      description: "Aquí puedes ver los detalles de tu inscripción al proyecto de grado.",
      url: "/tesis_pregrado/estado_inscripcion"
    },
    {
      Icon: Calendar,
      title: "Consultar fechas",
      description: "Aquí puedes consultar las fechas importantes del proceso.",
      url: "/tesis_pregrado/fechas"
    },
  ];

  const assistanceFeatures = [
    {
      Icon: BookOpen,
      title: "Ver asistencias disponibles",
      description: "Aquí puedes ver las asistencias disponibles y aplicar a estas.",
      url: "/asistencias_graduadas/lista_de_asistencias"
    },
    {
      Icon: PenSquare,
      title: "Ver estado de inscripción",
      description: "Consulta como se encuentra tu proceso de asistencia graduada.",
      url: "/asistencias_graduadas/estado_inscripcion"
    },
  ];

  const supportFeatures = [
    {
      Icon: AlertTriangle,
      title: "Reporte de incidencias",
      description: "Reporta cualquier problema que tengas con la plataforma.",
      url: "/soporte/reporte_incidencias"
    },
    {
      Icon: Video,
      title: "Tutoriales",
      description: "Aquí puedes ver tutoriales para aprender a usar la plataforma.",
      url: "/soporte/tutoriales"
    },
    {
      Icon: BookOpen,
      title: "Contactar a coordinadores",
      description: "Aquí puedes contactar a los coordinadores de la plataforma.",
      url: "/soporte/contactar_coordinadores"
    },
  ];

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
  )
}

interface InformationCardProps {
  Icon: any
  title: string;
  description: string;
  url: string;
}

/*
  This component is a card that contains an icon, a title, a description and a link to a specific route.
  It is used to display the features of the application in the home page.
*/
function InformationCard({ Icon, title, description, url }: InformationCardProps) {
  return (
    <Link to={url}>
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