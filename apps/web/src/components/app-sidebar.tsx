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
import {undergraduateData, professorData, coordinatorData, supportData } from "@/components/links-per-group";
import { useHomeStore } from "@/app/inicio/home.store"

const user = {
  name: "John Doe",
  email: "john@example.com",
  avatar: "/public/student-cap.svg"
}




export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const roles = useHomeStore((state) => state.roles);
  const roleNavMainMap = new Map([
    ["coordinador", coordinatorData],
    ["profesor", professorData],
    ["estudiante", undergraduateData],
  ])
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SisinfoHeaderLogo />
      </SidebarHeader>
      <SidebarContent>
        {
          roles.map((role) => (
            <NavMain key={role} items={roleNavMainMap.get(role) ?? []} title={role[0].toUpperCase() + role.slice(1)} />
          ))
        }
        <NavMain items={supportData} title="Soporte" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
