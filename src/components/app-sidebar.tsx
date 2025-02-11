import * as React from "react"
import {
  FileText,
  School,
  Settings2,
} from "lucide-react"

import { NavMain } from "components/nav-main"
import { NavUser } from "components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "components/ui/sidebar"
import SisinfoHeaderLogo from "./custom/sisinfo-sidebar-logo"

// This is sample data.
const data = {
  user: {
    name: "John Doe",
    email: "john@example.com",
    avatar: "/public/student-cap.svg"
  },
  navMain: [
    {
      title: "Tesis de pregrado",
      url: "tesis_pregrado",
      icon: FileText,
      isActive: false,
      items: [
        {
          title: "Consultar temas",
          url: "/tesis_pregrado/lista_de_tesis",
        },
        {
          title: "Consultar inscripcion",
          url: "/tesis_pregrado/fechas",
        },
        {
          title: "Consultar fechas",
          url: "/tesis_pregrado/estado_inscripcion",
        },
      ],
    },
    {
      title: "Asistencia graduada",
      url: "asistencias",
      icon: School,
      items: [
        {
          title: "Ver asistencias disponibles",
          url: "/asistencias_graduadas/lista_de_asistencias",
        },
        {
          title: "Ver estado de inscripción",
          url: "/asistencias_graduadas/lista_estados_inscripcion",
        },
      ],
    },
    {
      title: "Ayuda",
      url: "soporte",
      icon: Settings2,
      items: [
        {
          title: "Reporte de incidencias",
          url: "/soporte/reporte_incidencias",
        },
        {
          title: "Tutoriales",
          url: "/soporte/tutoriales",
        },
        {
          title: "Contactar a coordinadores",
          url: "/soporte/contactar_coordinadores",
        },
      ],
    },

  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SisinfoHeaderLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
