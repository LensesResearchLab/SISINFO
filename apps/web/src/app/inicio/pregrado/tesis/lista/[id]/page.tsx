// ThesisInscription.tsx
"use client";
import { use, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, FileText } from "lucide-react";

import { ConfirmationModal } from "@/components/shared/confirmation-modal";
import SpinnerPage from "@/components/shared/spinner-page";
import { ProjectDetailCard, ProjectNotFound } from "@/components/shared/project-detail-card";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { ROUTES } from "@/app/routes";
import { getUndergraduateProjectById, createProjectApplication } from "@/app/services/project.service";

import { useProjectInscriptionStore } from "./store";
import { Project } from "@/app/types/entities/project.type";
import { CreateProjectApplication } from "@/app/types/entities/project-application.type";

/**
 * ThesisInscription Component – maneja la vista de detalle y la postulación
 */
export default function ThesisInscription({
  params,
}: {
  readonly params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const reset = useProjectInscriptionStore((state) => state.reset);

  const {
    data: project,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["student-project-application", id],
    queryFn: () => getUndergraduateProjectById(id),
  });

  const isApplying = useProjectInscriptionStore((state) => state.isApplying);

  useEffect(() => {
    reset();
  }, [id, reset]);

  if (isFetching) return <SpinnerPage />;
  if (error || !project) return <ProjectNotFound />;

  return (
    <div className="min-h-full mx-auto p-4 container max-w-3xl">
      {!isApplying && <ProjectDetails project={project} />}
      {isApplying && <ProjectApplying project={project} />}
    </div>
  );
}

/*************************************
 * Detalle del proyecto
 *************************************/
function ProjectDetails({ project }: { readonly project: Project }) {
  const setIsApplying = useProjectInscriptionStore((state) => state.setIsApplying);
  return (
    <ProjectDetailCard project={project}>
      <Button className="w-40 mx-auto block" onClick={() => setIsApplying(true)}>
        Aplicar
      </Button>
    </ProjectDetailCard>
  );
}

/*************************************
 * Formulario de aplicación
 *************************************/
function ProjectApplying({ project }: { readonly project: Project }) {
  // store
  const setIsApplying = useProjectInscriptionStore((state) => state.setIsApplying);
  const motivation = useProjectInscriptionStore((state) => state.motivation);
  const setMotivation = useProjectInscriptionStore((state) => state.setMotivation);
  const contacted = useProjectInscriptionStore((state) => state.contacted);
  const setContacted = useProjectInscriptionStore((state) => state.setContacted);

  // local
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [openError, setOpenError] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    try {
      const projectApplication: CreateProjectApplication = {
        motivation,
        wasContacted: contacted,
        projectId: project.id,
      };
      await createProjectApplication(projectApplication);
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err).response === "object" &&
        (err).response !== null &&
        "status" in (err).response
      ) {
        const status = (err as { response: { status: number } }).response.status;
        if (status === 409) {
          setErrorMsg("Error al enviar la aplicación: ya hay una aplicación activa.");
        } else {
          setErrorMsg("Ocurrió un error inesperado. Intenta nuevamente.");
        }
      } else {
        setErrorMsg("Ocurrió un error inesperado. Intenta nuevamente.");
      }

      setOpenError(true);
    }
  };

  const modalProps = {
    title: "¿Estás seguro de aplicar a esta tesis?",
    description: "Recuerda que una vez aplicas no podrás cambiar tu decisión",
    buttonText: "Aplicar",
    successTitle: "¡Aplicación enviada!",
    successText: "Tu aplicación ha sido enviada con éxito",
    url: `${ROUTES.HOME}/${ROUTES.UNDERGRADUATE_THESIS_STATUS}`,
  };

  return (
    <Card className="w-full mx-auto shadow-lg border-none">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <CardTitle className="text-2xl font-medium text-core-highlight">
          {project.title}
        </CardTitle>
        <ButtonBack setIsApplying={setIsApplying} />
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <ProfessorInformation project={project} />
          <MotivationTextArea motivation={motivation} setMotivation={setMotivation} />
          <ContactedCheckbox contacted={contacted} setContacted={setContacted} />

          <div className="flex justify-center pt-3.5">
            <Button type="button" onClick={() => setIsConfirmed(true)}>
              Aplicar
            </Button>
            <ConfirmationModal
              dialogText={modalProps}
              onConfirm={handleSubmit}
              open={isConfirmed}
              setIsOpen={setIsConfirmed}
            />
          </div>
        </form>
      </CardContent>

      {/* Dialogo de error */}
      {errorMsg && (
        <AlertDialog open={openError} onOpenChange={setOpenError}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¡Ups!</AlertDialogTitle>
              <AlertDialogDescription>{errorMsg}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogAction>Cerrar</AlertDialogAction>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </Card>
  );
}

/*************************************
 * Subcomponentes
 *************************************/
function ButtonBack({ setIsApplying }: { readonly setIsApplying: (v: boolean) => void }) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="text-core-highlight hover:text-core-highlight border-core hover:border-core-highlight hover:bg-sky-50"
      onClick={() => setIsApplying(false)}
    >
      <FileText className="h-4 w-4 mr-2" />
      Ver detalles
    </Button>
  );
}

function ProfessorInformation({ project }: { readonly project: Project }) {
  return (
    <div className="space-y-2">
      <div className="flex flex-col space-y-1">
        <h2 className="text-lg font-semibold">
          Profesor: <span className="text-gray-900 font-normal">{project.professor?.user.name ?? "Profesor no encontrado"}</span>
        </h2>
        <a
          href={`mailto:${project.professor?.user.email ?? ""}`}
          className="text-core-highlight hover:underline inline-flex items-center gap-2"
        >
          <Mail className="h-4 w-4" />
          {project.professor?.user.email ?? "Email no encontrado"}
        </a>
      </div>
    </div>
  );
}

function MotivationTextArea({ 
  motivation,
  setMotivation,
}: {
  readonly motivation: string;
  readonly setMotivation: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor="motivation-textarea" className="text-sm text-gray-600">
        Escribe aquí las razones por las que quieres aplicar y tus conocimientos relevantes
      </label>
      <Textarea
        id="motivation-textarea"
        value={motivation}
        onChange={(e) => setMotivation(e.target.value)}
        placeholder="Describe tus motivaciones y experiencia"
        className="min-h-[200px] resize-none"
      />
    </div>
  );
}

function ContactedCheckbox({
  contacted,
  setContacted,
}: {
  readonly contacted: boolean;
  readonly setContacted: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="contacted"
        checked={contacted}
        onCheckedChange={(checked) => setContacted(!!checked)}
      />
      <label htmlFor="contacted" className="text-sm font-medium leading-none">
        Contacté al profesor por otro medio
      </label>
    </div>
  );
}
