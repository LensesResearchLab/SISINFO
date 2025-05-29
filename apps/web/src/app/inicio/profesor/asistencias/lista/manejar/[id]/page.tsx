"use client";

import { Button } from "@/components/ui/button";
import { CircleCheck, ClipboardList, FileText, User2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TabApplicants from "@/components/shared/tab-applicants";
import { ROUTES } from "@/app/routes";
import { ConfirmationModal } from "@/components/shared/confirmation-modal";
import {
  deleteGraduatedAssistance,
  getGraduatedAssistanceById,
} from "@/app/services/assistance.service";
import { GraduatedAssistance } from "@/app/types/entities/graduated-assistance.type";

/**
 * AssistanceManagePage Component
 *
 * This page allows professors to view detailed information about a specific graduated assistance post.
 * It includes general information, classification, description, and requirements of the assistance,
 * as well as a list of student applicants.
 *
 * Features:
 * - Fetches the assistance post by ID on component mount
 * - Displays general info and requirements in a sectioned layout
 * - Allows professors to edit or delete the assistance post
 * - Integrates with ConfirmationModal for deletion confirmation
 * - Uses TabApplicants to render the main tabbed UI for general and applicants view
 *
 * Navigation:
 * - On edit: navigates to the edit page for the specific assistance
 * - On delete: removes the assistance and redirects back to the listing
 */

export default function AssistanceManagePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assistance, setAssistance] =
  useState<GraduatedAssistance | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const assistanceData = await getGraduatedAssistanceById(id);
        setAssistance(assistanceData);
      } catch (error) {
        console.error("Error fetching assistance data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

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
      description: assistance?.title ?? "No title available",
      icon: <FileText className="h-8 w-8 text-core-highlight" />,
    },
    {
      title: "Clasificación",
      description: assistance?.category ?? "No title available",
      icon: <User2 className="h-8 w-8 text-core-highlight" />,
    },
    {
      title: "Descripción",
      description: assistance?.description ?? "No title available",
      icon: <ClipboardList className="h-8 w-8 text-core-highlight" />,
    },
  ];

  const generalProps = {
    title: "Información general",
    sections: sections,
  };

  const statusProps = {
    title: "Aplicantes",
    applicants: assistance?.assistanceApplications ?? [],
  };

  const handleDetails = (id: string) => {
    const currentPath = window.location.pathname;
    const newPath = `${currentPath}/${id}`;
    router.push(newPath);
  }

  const handleEditClick = (id: string) => {
    const path = `${ROUTES.HOME}/${ROUTES.PROFESSOR_ASSISTANCE_LIST_EDIT_ID}/${id}`;
    router.push(path);
  };

  const handleConfirmDeletion = async (id: string) => {
    try {
      await deleteGraduatedAssistance(id);
    } catch (error) {
      console.log(error);
    }
  };

  console.log("Assistance Requirements:", assistance);

  return (
    <div className="container mx-auto py-6 px-4">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 text-core-highlight">
            &quot;
          </div>
        </div>
      ) : (
        <>
          <h1 className="sr-only">Detalle asistencia graduada</h1>
          <TabApplicants general={generalProps} status={statusProps} handleDetails={handleDetails}>
            <div className="mt-8">
              <h3 className="text-xl font-medium text-core-highlight">
                Requisitos
              </h3>
              <ul className="space-y-3 p-4">
                {assistance?.requirements?.map((req) => (
                  <li key={req.id} className="flex items-start gap-3">
                    <CircleCheck className="w-10 h-7 mb-0.1 text-core-highlight" />
                    <div>
                      <p className="text-primary">{req.description}</p>
                      <hr className="h-[1px] w-[750px] my-2 border-0 bg-ring" />
                    </div>
                  </li>
                ))}
              </ul>

              <div className="flex gap-4 mt-8 justify-center justify-items-center">
                <Button
                  className="px-8 w-32"
                  onClick={() => {
                    if (assistance) {
                      handleEditClick(assistance.id);
                    }
                  }}
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
                  onConfirm={() => {
                    if (assistance) {
                      handleConfirmDeletion(assistance.id);
                    }
                  }}
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
