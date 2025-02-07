import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import { AppSidebar } from "components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "components/ui/breadcrumb"
import { Separator } from "components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "components/ui/sidebar"
import ThesisInscription from 'undergraduateThesis/pages/thesis-inscription';
import ThesisStatus from 'undergraduateThesis/pages/thesis-status';
import ThesisDates from 'undergraduateThesis/pages/thesis-dates';

import Footer from 'components/custom/footer';
import AssistanceInscription from 'graduatedAssistance/pages/assistance-Inscription';
import AssistanceStatus from 'graduatedAssistance/pages/assistance-status';
import Incidence from 'support/pages/incidence';
import Tutorials from 'support/pages/tutorials';
import Contact from 'support/pages/contact';

import { FileText, PenSquare, Calendar, AlertTriangle, BookOpen, Video } from "lucide-react"
import { Card, CardContent } from "components/ui/card"
import LoginPage from 'auth/pages/page';

/*
  This is the main component of the application. It is the entry point of the application.
  It uses the BrowserRouter to manage the routes of the application.
*/
export default function App() {
  return (
    <div>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </div>
  );
}

/*
  This component is the main content of the application. It is a container for the rest of the components.
  It uses the Shadcn UI components to create the layout of the sidebar.
  It inserts the content of the specific route in the main section of the page.
*/
function AppContent() {
  const location = useLocation(); 
  const getBreadcrumbText = () => {
      if (location.pathname === "/") return "Inicio";
      let breadCrumbText: string = location.pathname.split("/").pop() || "";
      breadCrumbText = breadCrumbText.replaceAll("_"," ");
      return breadCrumbText.charAt(0).toUpperCase() + breadCrumbText.slice(1);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">
                    Sisinfo
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{getBreadcrumbText()}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <main className="flex flex-grow bg-gray-100">
          <Routes>
            <Route path="/" element={<About />} />

            <Route path="/tesis_pregrado/lista_de_tesis" element={<ThesisInscription />} />
            <Route path="/tesis_pregrado/fechas" element={<ThesisDates/>} />
            <Route path="/tesis_pregrado/estado_inscripcion" element={<ThesisStatus/>} />

            <Route path="/asistencias_graduadas/lista_de_asistencias" element={<AssistanceInscription />} />
            <Route path="/asistencias_graduadas/estado_inscripcion" element={<AssistanceStatus/>} />

            <Route path="/soporte/reporte_incidencias" element={<Incidence />} />
            <Route path="/soporte/tutoriales" element={<Tutorials/>} />
            <Route path="/soporte/contactar_coordinadores" element={<Contact/>} />
          </Routes>
        </main>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}



function About() {
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