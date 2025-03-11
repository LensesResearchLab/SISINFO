"use client";

import { Button } from "@/components/ui/button";
import { CircleCheck, ClipboardList, FileText, User2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TabApplicants from "@/components/shared/tab-applicants";

interface AssistanceDetail {
  id: number;
  name: string;
  classification: string;
  description: string;
  requirements: string[];
  professor: string;
  start_semester: string;
  publication_date: Date;
  end_date: Date;
}

export default function AssistanceManagePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [isLoading, setIsLoading] = useState(true);
  const [assistanceDetail, setAssistanceDetail] = useState<AssistanceDetail>({
    id: 0,
    name: "Asistente graduado ISIS2203",
    classification: "Docencia",
    description:
      "Se requiere un estudiante de maestría para que dicté la clase de los laboratorios del curso ISIS2203",
    requirements: [
      "Informar el promedio de pregrado",
      "Informar el promedio de la materia (debe ser mayor a 4.5)",
      "Adjuntar hoja de vida",
    ],
    professor: "Camilo Andrés Escobar",
    start_semester: "2025-01",
    publication_date: new Date("2025-12-12"),
    end_date: new Date("2025-12-12"),
  });

  // Datos temporales TODO
  const mockApplicants = [
    {
      id: "1",
      name: "Alfredo Torres",
      email: "a.torres@uniandes.edu.co",
      status: "Aceptado" as const,
    },
    {
      id: "2",
      name: "Nicolás Camargo",
      email: "n.camargop@uniandes.edu.co",
      status: "En revisión" as const,
    },
  ];

  useEffect(() => {
    setIsLoading(false);
  });

  // Secciones
  const sections = [
    {
      title: "Nombre",
      description: assistanceDetail.name,
      icon: <FileText className="h-5 w-5 text-sky-800 mt-1" />,
    },
    {
      title: "Clasificación",
      description: assistanceDetail.classification,
      icon: <User2 className="h-5 w-5 text-sky-800 mt-1" />,
    },
    {
      title: "Descripción",
      description: assistanceDetail.description,
      icon: <ClipboardList className="h-5 w-5 text-sky-800 mt-1" />,
    },
  ];

  const generalProps = {
    title: "Información general",
    sections: sections,
  };

  const statusProps = {
    title: "Aplicantes",
    applicants: mockApplicants,
  };

  return (
    <div className="container mx-auto py-6 px-4">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-800"></div>
        </div>
      ) : (
        <>
          <h1 className="sr-only">Detalle asistencia graduada</h1>
          <TabApplicants general={generalProps} status={statusProps}>
            <div className="mt-8">
              <h3 className="text-xl font-medium text-sky-800 mb-4">
                Requisitos
              </h3>
              <ul className="space-y-3">
                {assistanceDetail.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CircleCheck className="w-5 h-5 text-sky-800 mt-0.5" />
                    <div>
                      <p className="text-gray-700">{req}</p>
                      <hr className="bg-gray-300 h-[1px] w-full my-2 border-0" />
                    </div>
                  </li>
                ))}
              </ul>

              <div className="flex gap-4 mt-8 justify-center justify-items-center">
                <Button
                  variant="outline"
                  className="bg-zinc-900 text-white hover:bg-zinc-800 px-8 w-32"
                >
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700 px-8 w-32"
                >
                  Eliminar
                </Button>
              </div>
            </div>
          </TabApplicants>
        </>
      )}
    </div>
  );
}
