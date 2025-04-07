"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Users, GraduationCap, ClipboardList } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Reports() {
  const router = useRouter();

  const handleClick = (type: string) => {
    let path = "";

    if (type === "project") {
      path = "/inicio/coordinador/reportes/proyecto-grado";
    } else if (type === "thesis") {
      path = "/inicio/coordinador/reportes/tesis";
    } else if (type === "thesis1-detail") {
      path = "/inicio/coordinador/reportes/tesis-detalle";
    } else if (type === "thesis2-inscription") {
      path = "/inicio/coordinador/reportes/tesis2";
    } else if (type === "sections-syllabus") {
      path = "/inicio/coordinador/reportes/secciones-programa";
    } else if (type === "sections-30%") {
      path = "/inicio/coordinador/reportes/notas-parciales";
    } else if (type === "sections-100%") {
      path = "/inicio/coordinador/reportes/notas-totales";
    }

    router.push(path);
  };

  return (
    <div className="min-h-full min-w-full p-20">
      <div className="bg-card rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleClick("project")}
          >
            <CardContent className="pt-6 pb-4 px-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg p-2 bg-blue-50">
                  <GraduationCap className="h-10 w-10 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">
                    Reporte proyectos de grado
                  </CardTitle>
                  <CardDescription>
                    Generar y visualizar reportes de proyectos de grado
                  </CardDescription>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleClick("thesis")}
          >
            <CardContent className="pt-6 pb-4 px-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg p-2 bg-green-50">
                  <Users className="h-10 w-10 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Reporte de tesis 1</CardTitle>
                  <CardDescription>
                    Generar y visualizar reporte de tesis 1 de maestria.
                  </CardDescription>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleClick("thesis1-detail")}
          >
            <CardContent className="pt-6 pb-4 px-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg p-2 bg-green-50">
                  <Users className="h-10 w-10 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">
                    Reporte detallado inscritos a tesis 1
                  </CardTitle>
                  <CardDescription>
                    Generar y visualizar reporte detallado inscritos a tesis 1
                    de maestria.
                  </CardDescription>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleClick("thesis2-inscription")}
          >
            <CardContent className="pt-6 pb-4 px-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg p-2 bg-green-50">
                  <Users className="h-10 w-10 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">
                    Reporte detallado inscritos a tesis 1 e inscripcion a tesis
                    2
                  </CardTitle>
                  <CardDescription>
                    Generar y visualizar reporte detallado inscritos a tesis 1
                    de maestria e inscripcion a tesis 2.
                  </CardDescription>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleClick("sections-syllabus")}
          >
            <CardContent className="pt-6 pb-4 px-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg p-2 bg-purple-50">
                  <ClipboardList className="h-10 w-10 text-amber-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">
                    Reporte de secciones sin archivos de programa
                  </CardTitle>
                  <CardDescription>
                    Generar y visualizar reporte de secciones que no han cargado
                    archivo de programa.
                  </CardDescription>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleClick("sections-30%")}
          >
            <CardContent className="pt-6 pb-4 px-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg p-2 bg-amber-50">
                  <ClipboardList className="h-10 w-10 text-amber-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">
                    Reporte de secciones sin archivos de 30%
                  </CardTitle>
                  <CardDescription>
                    Generar y visualizar reporte de secciones que no han cargado
                    archivo del 30%.
                  </CardDescription>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleClick("sections-100%")}
          >
            <CardContent className="pt-6 pb-4 px-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg p-2 bg-amber-50">
                  <ClipboardList className="h-10 w-10 text-amber-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">
                    Reporte de secciones sin archivos de cierre
                  </CardTitle>
                  <CardDescription>
                    Generar y visualizar reporte de secciones que no han cargado
                    archivo de cierre.
                  </CardDescription>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
