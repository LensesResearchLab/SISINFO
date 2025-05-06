"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import Footer from "@/components/shared/footer";
import BreadCrumbDetail from "@/components/shared/breadcrumb-detail";
import Provider from "@/app/providers/providers";
import { useHomeStore } from "./home.store";
import RingBell from "@/components/shared/ring-bell";


export default function Layout({children}: {readonly children: React.ReactNode}) {
  const tasks = useHomeStore((state) => state.tasks);

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
            <div className="mr-4">
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