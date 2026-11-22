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

const LABELS: Record<string, string> = {
  profesores: "Administrar profesores",
  estudiantes: "Administrar estudiantes",
  cargar_profesores: "Administrar profesores",
};

// Only these prefixes correspond to pages that can safely be revisited.
// Menu/group names and folder-like segments are intentionally excluded.
const NAVIGABLE_PATHS = new Set([
  "/inicio",
  "/inicio/coordinador/programas/lista",
  "/inicio/coordinador/cartelera",
  "/inicio/coordinador/reportes",
  "/inicio/coordinador/asistencias",
  "/inicio/profesor/asistencias/lista",
  "/inicio/profesor/asistencias/nuevo",
  "/inicio/profesor/maestria/lista",
  "/inicio/profesor/pregrado/lista",
  "/inicio/pregrado/tesis/lista",
  "/inicio/posgrado/tesis/lista",
  "/inicio/profesor/pregrado/tesis/lista",
  "/inicio/profesor/maestria/tesis/lista",
  "/inicio/estudiante/notas-proyectos",
  "/inicio/profesor/notas-proyectos",
]);

function getBreadcrumbText(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = segments.map((segment, index) => {
    const path: string = `/${segments.slice(0, index + 1).join("/")}`;
    const name: string = segment.replace(/_/g, " ");
    const capitalizedName = LABELS[segment.toLowerCase()] ?? (name.charAt(0).toUpperCase() + name.slice(1));
    return { path, capitalizedName, originalSegment: segment };
  });
  

  const filtered = breadcrumbs.filter(
    (breadcrumb) =>
      !EXCLUDED_SEGMENTS.has(breadcrumb.originalSegment.toLowerCase())
  );

  const parentLists = [
    ["/inicio/profesor/maestria/nuevo", "/inicio/profesor/maestria/lista", "Lista"],
    ["/inicio/profesor/pregrado/nuevo", "/inicio/profesor/pregrado/lista", "Lista"],
  ] as const;
  const parent = parentLists.find(([screen]) => pathname === screen);
  if (parent && !filtered.some((breadcrumb) => breadcrumb.path === parent[1])) {
    filtered.splice(Math.max(filtered.length - 1, 0), 0, {
      path: parent[1],
      capitalizedName: parent[2],
      originalSegment: "lista",
    });
  }

  return filtered;
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
              {!NAVIGABLE_PATHS.has(breadcrumb.path) ? (
              <BreadcrumbPage>{breadcrumb.capitalizedName}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={breadcrumb.path}>{breadcrumb.capitalizedName}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
