"use client"

import * as React from "react"
import {
  FileText,
  School,
  Settings2,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import SisinfoHeaderLogo from "./sisinfo-header-logo"

// This is sample data.
export const sidebarData = {
  user: {
    name: "John Doe",
    email: "john@example.com",
    avatar: "/public/student-cap.svg"
  },
  navMain: [
    {
      title: "Tesis de pregrado",
      url: "undergraduate-thesis",
      icon: FileText,
      isActive: false,
      items: [
        {
          title: "Consultar temas",
          url: "/undergraduate-thesis/thesis-list",
        },
        {
          title: "Consultar inscripcion",
          url: "/undergraduate-thesis/thesis-status",
        },
        {
          title: "Consultar fechas",
          url: "/undergraduate-thesis/thesis-dates",
        },
      ],
    },
    {
      title: "Asistencia graduada",
      url: "graduated-assistance",
      icon: School,
      items: [
        {
          title: "Ver asistencias disponibles",
          url: "/graduated-assistance/assistance-list",
        },
        {
          title: "Ver estado de inscripción",
          url: "/graduated-assistance/assistance-applied-list",
        },
      ],
    },
    {
      title: "Ayuda",
      url: "support",
      icon: Settings2,
      items: [
        {
          title: "Reporte de incidencias",
          url: "/support/incidence",
        },
        {
          title: "Tutoriales",
          url: "/support/tutorials",
        },
        {
          title: "Contactar a coordinadores",
          url: "/support/contact",
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
        <NavMain items={sidebarData.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
