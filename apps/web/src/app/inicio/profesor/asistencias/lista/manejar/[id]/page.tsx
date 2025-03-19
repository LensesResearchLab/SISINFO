"use client";

import { Button } from "@/components/ui/button";
import { CircleCheck, ClipboardList, FileText, User2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TabApplicants from "@/components/shared/tab-applicants";
import { ROUTES } from "@/app/routes";
import { ConfirmationModal } from "@/components/shared/confirmation-modal";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const path = `${ROUTES.HOME}/${ROUTES.PROFESSOR_ASSISTANCE_LIST}`;
  const dialogTextAccepted = {
    title: "Confirmar Accion",
    description: "¿Estás seguro de que quieres proceder?",
    buttonText: "Aceptar",
    successTitle: "Exitoso.",
    successText: "Accion realizada correctamente.",
    url: path,
  };

  // Secciones
  const sections = [
    {
      title: "Nombre",
      description: assistanceDetail.name,
      icon: <FileText className="h-8 w-8 text-core-highlight" />,
    },
    {
      title: "Clasificación",
      description: assistanceDetail.classification,
      icon: <User2 className="h-8 w-8 text-core-highlight" />,
    },
    {
      title: "Descripción",
      description: assistanceDetail.description,
      icon: <ClipboardList className="h-8 w-8 text-core-highlight" />,
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

  const handleEditClick = (id: number) => {
    const path = `${ROUTES.HOME}/${ROUTES.PROFESSOR_ASSISTANCE_LIST_EDIT_ID}/${id}`;
    router.push(path);
  };

  const handleConfirmDeletion = () => {
    console.log("Confirmed!");
  };

  return (
    <div className="container mx-auto py-6 px-4">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 text-core-highlight">
            "
          </div>
        </div>
      ) : (
        <>
          <h1 className="sr-only">Detalle asistencia graduada</h1>
          <TabApplicants general={generalProps} status={statusProps}>
            <div className="mt-8">
              <h3 className="text-xl font-medium text-core-highlight">
                Requisitos
              </h3>
              <ul className="space-y-3 p-4">
                {assistanceDetail.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CircleCheck className="w-10 h-7 mb-0.1 text-core-highlight" />
                    <div>
                      <p style={{ color: "var(--primary)" }}>{req}</p>
                      <hr className="h-[1px] w-[750px] my-2 border-0 bg-ring" />
                    </div>
                  </li>
                ))}
              </ul>

              <div className="flex gap-4 mt-8 justify-center justify-items-center">
                <Button
                  className="px-8 w-32"
                  onClick={() => handleEditClick(assistanceDetail.id)}
                >
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  className="hover:bg-red-700 px-8 w-32"
                  onClick={() => setIsModalOpen(true)}
                >
                  Eliminar
                </Button>

                <ConfirmationModal
                  dialogText={dialogTextAccepted}
                  onConfirm={handleConfirmDeletion}
                  open={isModalOpen}
                  setIsOpen={setIsModalOpen}
                />
              </div>
            </div>
          </TabApplicants>
        </>
      )}
    </div>
  );
}
