"use client";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

const EXCLUDED_SEGMENTS = new Set([
 
  "inicio",

  "estudiante",
  "profesor",
  "coordinador",
  "administrador",

  "pregrado",
  "posgrado",
  "postgrado",        
  "asistencia",
  "administracion",   
  "administración",   
  "soporte",
  "alertas",
  "configuracion",
  "programa",
]);

function getBreadcrumbText(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = segments.map((segment, index) => {
    const path: string = `/${segments.slice(0, index + 1).join("/")}`;
    const name: string = segment.replace(/_/g, " ");
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
    return { path, capitalizedName, originalSegment: segment };
  });
  

  return breadcrumbs.filter(
    (breadcrumb) =>
      !EXCLUDED_SEGMENTS.has(breadcrumb.originalSegment.toLowerCase())
  );
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
          <React.Fragment key={breadcrumb.path}>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              {index === breadcrumbs.length - 1 ? (
                <BreadcrumbPage>{breadcrumb.capitalizedName}</BreadcrumbPage>
              ) : (
                <span>{breadcrumb.capitalizedName}</span>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}