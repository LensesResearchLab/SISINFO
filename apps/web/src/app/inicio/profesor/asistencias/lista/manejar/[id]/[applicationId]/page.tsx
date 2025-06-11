"use client";

import { getAssistanceStatusByIdWithDocument, updateAssistanceApplication } from "@/app/services/assistance.service";
import { useQuery } from "@tanstack/react-query";
import { use, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, FileText } from "lucide-react";
import SpinnerPage from "@/components/shared/spinner-page";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";

/**
 * ApplicationDetail Component
 *
 * This page is responsible for displaying the full details of a student's application
 * to a graduated assistance opportunity. It includes:
 * - PDF resume preview using a Blob generated from binary data.
 * - A responsive layout with two sections: PDF viewer and student information card.
 * - Accept/Reject action buttons (not yet connected to backend).
 * - Navigation buttons for switching between applicants (handlers provided as props).
 *
 * Data fetching:
 * - Uses `getAssistanceStatusByIdWithDocument` to retrieve the full application including the document.
 * - Uses React Query for cache and loading management.
 * - Parses binary data to display the PDF using a blob URL.
 *
 * Params:
 * - Expects `applicationId` from the `params` promise.
 *
 * Structure:
 * - Left section: PDF viewer (iframe).
 * - Right section: `StudentProfileCard` with student's name, email, and action buttons.
 */

export default function ApplicationDetail({
  params,
}: {
  readonly params: Promise<{ id: string; applicationId: string }>;
}) {
  const { applicationId } = use(params);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const {
    data,
    isFetching,
    error,
  } = useQuery({
    queryKey: [`assitance-application-${applicationId}`],
    queryFn: () => getAssistanceStatusByIdWithDocument(applicationId),
  });

  const { application, previousId, nextId } = data ?? {};

  useEffect(() => {
    if (application?.document?.file?.data) {
      const byteArray = new Uint8Array(application.document.file.data);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [application]);

  if (isFetching) return <SpinnerPage />;

  const onAccept = () => {
    setStatus("Aceptado");
    updateAssistanceApplication(applicationId, { status: "Aceptado" });
  };
  const onReject = () => {
    setStatus("Rechazado");
    updateAssistanceApplication(applicationId, { status: "Rechazado" });
  };

  const navigateTo = (targetId: string) => {
    const pathSegments = pathname.split("/");
    pathSegments[pathSegments.length - 1] = targetId;
    const newPath = pathSegments.join("/");
    router.push(newPath);
  };

  const onPrevious = () => {
    if (previousId) {
      navigateTo(previousId);
    }
  };

  const onNext = () => {
    if (nextId) {
      navigateTo(nextId);
    }
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-full p-6 w-full">
      <div className="col-span-1 lg:col-span-2 flex flex-col">
        {error && <p>Error al cargar la aplicación</p>}
        {!error && <PdfViewer pdfUrl={pdfUrl} />}
      </div>
      <div className="col-span-1">
        {!error && (
          <StudentProfileCard
            pdfUrl={pdfUrl ?? "#"}
            name={application?.student?.user?.name}
            email={application?.student?.user?.email}
            onAccept={onAccept}
            onReject={onReject}
            status={status ?? application.status}
            onPrevious={onPrevious}
            onNext={onNext}
            disablePrevious={!previousId}
            disableNext={!nextId}
          />
        )}
      </div>
    </div>
  );
}

function PdfViewer({ pdfUrl }: { readonly pdfUrl: string | null }) {
  if (!pdfUrl)
    return <p className="text-red-500">Error al cargar el documento</p>;

  return (
    <div className="flex-1 border rounded-lg overflow-hidden">
      <iframe
        src={pdfUrl}
        width="100%"
        height="100%"
        title="Documento PDF"
        className="min-h-[400px] md:min-h-[600px]"
      />
    </div>
  );
}

interface StudentProfileProps {
  readonly name?: string;
  readonly email?: string;
  readonly pdfUrl?: string;
  readonly status?: string;
  readonly onAccept?: () => void;
  readonly onReject?: () => void;
  readonly onPrevious?: () => void;
  readonly onNext?: () => void;
  readonly disablePrevious?: boolean;
  readonly disableNext?: boolean;
}

function StudentProfileCard({
  name = "Estudiante",
  email = "correo@universidad.edu",
  pdfUrl = "#",
  onAccept = () => console.log("Accepted"),
  onReject = () => console.log("Rejected"),
  status = "",
  onPrevious = () => console.log("Previous applicant"),
  onNext = () => console.log("Next applicant"),
  disablePrevious = false,
  disableNext = false,
}: StudentProfileProps) {
  return (
    <div className="w-full">
      <div className="bg-card rounded-3xl shadow-lg p-6 mb-4">
        <div className="mb-6">
          <p className="text-lg font-medium mb-1 text-foreground">Nombre estudiante:</p>
          <p className="text-xl mb-4 font-semibold text-foreground">{name}</p>

          <p className="text-lg font-medium mb-1 text-foreground">Correo:</p>
          <p className="text-xl mb-4 font-semibold text-foreground">{email}</p>

          <p className="text-lg font-medium mb-1 text-foreground">Estado:</p>
          <p className="text-xl mb-4 font-semibold text-foreground">{status}</p>

          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 bg-gray-100 text-black font-medium rounded-lg hover:bg-gray-200 transition-colors mb-4"
          >
            <FileText className="w-5 h-5" />
            Ver PDF en nueva pestaña
          </a>

          <div className="border-b border-gray-300 mb-6"></div>

          <div className="space-y-3">
            <Button onClick={onAccept} className="w-full py-3 font-medium rounded-lg transition-colors">
              Aceptar solicitud
            </Button>
            <Button
              onClick={onReject}
              className="w-full py-3 bg-[#e56b6b] font-medium rounded-lg hover:bg-[#d45c5c] transition-colors"
            >
              Rechazar solicitud
            </Button>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onPrevious}
          disabled={disablePrevious}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg flex-1 ${
            disablePrevious ? "bg-gray-300 cursor-not-allowed" : "bg-core text-white hover:bg-core-highlight"
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-left">
            Anterior
            <br />
            aplicante
          </span>
        </button>

        <button
          onClick={onNext}
          disabled={disableNext}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg flex-1 ${
            disableNext ? "bg-gray-300 cursor-not-allowed" : "bg-core text-white hover:bg-core-highlight"
          }`}
        >
          <span className="text-right">
            Siguiente
            <br />
            aplicante
          </span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}