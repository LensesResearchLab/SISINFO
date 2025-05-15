"use client";

import * as React from "react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import SisinfoHeaderLogo from "./sisinfo-header-logo";
import {
  undergraduateData,
  professorData,
  coordinatorData,
  supportData,
  graduateData,
  administratorData,
} from "@/components/links-per-group";
import { useHomeStore } from "@/app/inicio/home.store";
import { getUserInfo } from "@/app/auth/auth-service";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const roles = useHomeStore((state) => state.roles);
  const setRoles = useHomeStore((state) => state.setRoles);
  const [currentUser, setCurrentUser] = useState({
    name: "Cargando...",
    email: "",
    avatar: "/public/student-cap.svg",
  });

  useEffect(() => {
    async function fetchUserData() {
      try {
        const userInfo = await getUserInfo();
        if (userInfo.success && userInfo.user) {
          setCurrentUser({
            name: userInfo.user.name,
            email: userInfo.user.email,
            avatar: "/public/student-cap.svg",
          });
          setRoles(userInfo.user.roles);
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchUserData();
  }, [setRoles]);

  const roleNavMainMap = new Map([
    ["administrador", administratorData],
    ["coordinador", coordinatorData],
    ["profesor", professorData],
    ["estudiante", undergraduateData],
    ["estudiante_maestria", graduateData],
  ]);
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SisinfoHeaderLogo />
      </SidebarHeader>
      <SidebarContent>
        {roles.map((role) => (
          <NavMain
            key={role}
            items={roleNavMainMap.get(role) ?? []}
            title={
              role === "estudiante_maestria"
                ? "Estudiante Maestria"
                : role[0].toUpperCase() + role.slice(1)
            }
          />
        ))}
        <NavMain items={supportData} title="Soporte" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={currentUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
