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
import ThesisList from 'undergraduateThesis/pages/thesis-list';
import ThesisInscription from 'undergraduateThesis/pages/thesis-inscription';
import ThesisStatus from 'undergraduateThesis/pages/thesis-status';
import ThesisDates from 'undergraduateThesis/pages/thesis-dates';

import Footer from 'components/custom/footer';
import AssistanceList from 'graduatedAssistance/pages/assistance-list';
import AssistanceStatus from 'graduatedAssistance/pages/assistance-status';

import Incidence from 'support/pages/incidence';
import Tutorials from 'support/pages/tutorials';
import Contact from 'support/pages/contact';


import { Fragment } from 'react/jsx-runtime';
import About from 'about';
import AssistanceDetails from 'graduatedAssistance/pages/assistance-detail';
import AssistanceAppliedList from 'graduatedAssistance/pages/assistance-applied-list';

import Error404 from 'error404';
import Login from 'auth/pages/page';




/*
  This is the main component of the application. It is the entry point of the application.
  It uses the BrowserRouter to manage the routes of the application.
*/
export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

/*
  This component is the main content of the application. It is a container for the rest of the components.
  It uses the Shadcn UI components to create the layout of the sidebar.
  It inserts the content of the specific route in the main section of the page.
*/
function AppContent() {
  const location = useLocation(); 
  if (location.pathname === "/login") {
    return <Login />;
  }
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <BreadCrumbDetail/>
          </div>
        </header>
        <main className="flex flex-grow bg-gray-100">
          <Routes>
            <Route path="/" element={<About />} />

            <Route path="/tesis_pregrado/lista_de_tesis" element={<ThesisInscription />} />
              <Route path="/tesis_pregrado/lista_de_tesis/:id" element={<ThesisStatus/>} />
            <Route path="/tesis_pregrado/fechas" element={<ThesisDates/>} />
            <Route path="/tesis_pregrado/estado_inscripcion" element={<ThesisStatus/>} />

            <Route path="/asistencias_graduadas/lista_de_asistencias" element={<AssistanceList />} />
              <Route path="/asistencias_graduadas/lista_de_asistencias/:id" element={<AssistanceDetails />} />
            <Route path="/asistencias_graduadas/lista_estados_inscripcion" element={<AssistanceAppliedList/>} />
              <Route path="/asistencias_graduadas/lista_estados_inscripcion/:id" element={<AssistanceStatus/>} />

            <Route path="/soporte/reporte_incidencias" element={<Incidence />} />
            <Route path="/soporte/tutoriales" element={<Tutorials/>} />
            <Route path="/soporte/contactar_coordinadores" element={<Contact/>} />
          </Routes>
          <SisinfoRoutes/>
        </main>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}


function getBreadcrumbText(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = segments.map((segment, index) => {
    const path: string = `/${segments.slice(0, index + 1).join("/")}`;
    let name: string = segment.replace(/_/g, " ");
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
    return { path, capitalizedName };
  });
  breadcrumbs.shift();
  return breadcrumbs;
}


function BreadCrumbDetail(){
  const location = useLocation(); 
  const breadcrumbs = getBreadcrumbText(location.pathname);  
  return (
    <Breadcrumb>
      <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="/">Sisinfo</BreadcrumbLink>
          </BreadcrumbItem>
          {breadcrumbs.map((breadcrumb, index) => (
            <Fragment key={breadcrumb.path}>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                {index === getBreadcrumbText.length - 1 ? (
                  <BreadcrumbPage>
                    {breadcrumb.capitalizedName}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink>
                    <Link to={breadcrumb.path}>
                      {breadcrumb.capitalizedName}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          ))}
        </BreadcrumbList>
    </Breadcrumb>
  )
}

function SisinfoRoutes(){
  return (
    <Routes>
    <Route path="/" element={<About />} />
    <Route path="*" element={<Error404 />} />

    <Route path="/tesis_pregrado/lista_de_tesis" element={<ThesisList />} />
      <Route path="/tesis_pregrado/lista_de_tesis/:id" element={<ThesisInscription/>} />
    <Route path="/tesis_pregrado/fechas" element={<ThesisDates/>} />
    <Route path="/tesis_pregrado/estado_inscripcion" element={<ThesisStatus/>} />

    <Route path="/asistencias_graduadas/lista_de_asistencias" element={<AssistanceInscription />} />
    <Route path="/asistencias_graduadas/estado_inscripcion" element={<AssistanceStatus/>} />

    <Route path="/soporte/reporte_incidencias" element={<Incidence />} />
    <Route path="/soporte/tutoriales" element={<Tutorials/>} />
    <Route path="/soporte/contactar_coordinadores" element={<Contact/>} />
  </Routes>
  )
}
