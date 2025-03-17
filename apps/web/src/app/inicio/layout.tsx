"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import Footer from "@/components/shared/footer";
import BreadCrumbDetail from "@/components/shared/breadcrumb-detail";
import Provider from "@/app/providers/providers";
import { useEffect } from "react";
import { useHomeStore } from "./home.store";

export default function Layout({children}: {children: React.ReactNode}) {
  const setRoles = useHomeStore((state) => state.setRoles);

  useEffect(() => {
    setRoles(["coordinador", "profesor", "estudiante"]);
  }, []);

  return (
    <Provider>
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
  
            <main className="flex flex-grow bg-background">
              {children}
            </main>
  

          <Footer />
        </SidebarInset>
      </SidebarProvider>
    </Provider>
  )
}