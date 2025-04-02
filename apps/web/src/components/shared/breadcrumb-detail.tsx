"use client";
import { Fragment } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { usePathname } from 'next/navigation';
import Link from "next/link";
import {undergraduateData, professorData, coordinatorData, supportData} from "@/components/links-per-group";

const EXCLUDED_ROUTES = 
  undergraduateData.map((item) => item.url)
  .concat(professorData.map((item) => item.url))
  .concat(coordinatorData.map((item) => item.url))
  .concat(supportData.map((item) => item.url))
  .concat(["inicio", "tesis", "publicar-consultar", "asistencia", "estudiante","profesor", "coordinador", "maestria", "administrador", "aplicantes" ]);

function getBreadcrumbText(pathname: string) {
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs = segments.map((segment, index) => {
      const path: string = `/${segments.slice(0, index + 1).join("/")}`;
      const name: string = segment.replace(/_/g, " ");
      const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
      return { path, capitalizedName };
    });
    return breadcrumbs.filter((breadcrumb) => !EXCLUDED_ROUTES.includes(breadcrumb.capitalizedName.toLowerCase()));
}

export default function BreadCrumbDetail() {
    const pathname = usePathname();
    const breadcrumbs = getBreadcrumbText(pathname);

    return (
      <Breadcrumb>
        <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/inicio">Inicio</BreadcrumbLink>
            </BreadcrumbItem>
            {breadcrumbs.map((breadcrumb, index) => (
              <Fragment key={breadcrumb.path}>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  {index === breadcrumbs.length - 1 ? (
                    <BreadcrumbPage>
                      {breadcrumb.capitalizedName}
                    </BreadcrumbPage>
                  ) : (
                    <Link href={breadcrumb.path}>
                      {breadcrumb.capitalizedName}
                    </Link>
                  )}
                </BreadcrumbItem>
              </Fragment>
            ))}
          </BreadcrumbList>
      </Breadcrumb>
    );
}