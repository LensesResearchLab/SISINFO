"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Users, GraduationCap, ClipboardList } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * Reports Component
 *
 * Displays a grid of report options for the academic coordinator to access.
 * Each card represents a different type of academic report (projects, theses, sections).
 *
 * Features:
 * - Visual menu of all report categories
 * - Navigation on card click
 * - Semantic icons and descriptions for quick understanding
 *
 * @returns {JSX.Element} A responsive, interactive report dashboard
 */
export default function Reports() {
  const router = useRouter();

  /**
   * Navigates to the selected report route based on type
   * @param type - report type identifier
   */
  const handleClick = (type: string) => {
    let path = "";

    switch (type) {
      case "project":
        path = "/inicio/coordinador/reportes/proyecto-grado";
        break;
      case "thesis":
        path = "/inicio/coordinador/reportes/tesis";
        break;
      case "thesis1-detail":
        path = "/inicio/coordinador/reportes/tesis-detalle";
        break;
      case "thesis2-inscription":
        path = "/inicio/coordinador/reportes/tesis2";
        break;
      case "sections-syllabus":
        path = "/inicio/coordinador/reportes/secciones-programa";
        break;
      case "sections-30%":
        path = "/inicio/coordinador/reportes/notas-parciales";
        break;
      case "sections-100%":
        path = "/inicio/coordinador/reportes/notas-totales";
        break;
    }

    router.push(path);
  };

  return (
    <div className="min-h-full min-w-full p-20">
      <div className="bg-card rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Project Report Card */}
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

          {/* Thesis 1 Report */}
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
                    Generar y visualizar reporte de tesis 1 de maestría.
                  </CardDescription>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Thesis 1 Report */}
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
                    Generar y visualizar reporte detallado de inscripción a tesis 1.
                  </CardDescription>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Thesis 1 to Thesis 2 Report */}
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
                    Reporte de inscripción a tesis 2
                  </CardTitle>
                  <CardDescription>
                    Visualizar estudiantes que culminaron tesis 1 e inscribieron tesis 2.
                  </CardDescription>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sections Without Program File */}
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
                    Reporte de secciones sin programa académico cargado.
                  </CardDescription>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sections Without 30% Grade File */}
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
                    Ver qué secciones no han cargado notas parciales.
                  </CardDescription>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sections Without Final Grade File */}
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
                    Reporte de secciones que no han entregado notas finales.
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