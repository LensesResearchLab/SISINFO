"use client";
import { useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import Footer from "@/components/shared/footer";
import BreadCrumbDetail from "@/components/shared/breadcrumb-detail";
import Provider from "@/app/providers/providers";
import { useHomeStore } from "./home.store";
import RingBell from "@/components/shared/ring-bell";
import { getPendingTasksForCoordinator, getPendingTasksForProfessor, getPendingTasksForStudent } from "@/app/services/project-application.service";
import { getPendingStandaloneTasksForProfessor, getPendingStandaloneTasksForStudent } from "@/app/services/tasks.service";
import { getUserInfo } from "../auth/auth-service";
import { mapTasksToTaskTable } from "../mappers/task.mapper";


export default function Layout({children}: {readonly children: React.ReactNode}) {
  const tasks = useHomeStore((state) => state.tasks);
  const setTasks = useHomeStore((state) => state.setTasks);

  useEffect(() => {
    let interval: number | undefined;
    let cancelled = false;
    const loadTasks = async () => {
      try {
        const data = await getUserInfo();
        if (!data.success || !data.user) return;
        const roles = data.user.roles ?? [];
        const requests = [
          getPendingTasksForStudent(data.user.id).catch(() => []),
          getPendingStandaloneTasksForStudent(data.user.id).catch(() => []),
          getPendingTasksForProfessor(data.user.id).catch(() => []),
          getPendingStandaloneTasksForProfessor(data.user.id).catch(() => []),
        ];
        if (roles.includes("coordinador")) requests.push(getPendingTasksForCoordinator().catch(() => []));
        const results = await Promise.all(requests);
        if (!cancelled) setTasks(mapTasksToTaskTable(results.flat()));
      } catch {
        // La sesión puede no estar disponible todavía al montar el layout.
      }
    };
    void loadTasks();
    interval = window.setInterval(() => void loadTasks(), 10000);
    return () => { cancelled = true; if (interval !== undefined) window.clearInterval(interval); };
  }, [setTasks]);

  return (
    <Provider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="bg-secondary flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex gap-2 px-4 flex-justify-between w-full">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <BreadCrumbDetail/>
            </div>
            <div className="mr-4 flex items-center gap-3">
              <RingBell tasks={tasks.length} />
            </div>
          </header>
  
            <main className="flex flex-grow bg-background">
              {children}
            </main>
  

          <Footer />
        </SidebarInset>
      </SidebarProvider>
    </Provider>
  )
}
