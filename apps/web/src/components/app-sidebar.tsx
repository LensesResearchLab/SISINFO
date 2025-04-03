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
} from "@/components/links-per-group";
import { useHomeStore } from "@/app/inicio/home.store";
import { getUserInfo } from "@/app/auth/auth-service";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const roles = useHomeStore((state) => state.roles);
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
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchUserData();
  }, []);

  const roleNavMainMap = new Map([
    ["coordinador", coordinatorData],
    ["profesor", professorData],
    ["estudiante", undergraduateData],
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
            title={role[0].toUpperCase() + role.slice(1)}
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
