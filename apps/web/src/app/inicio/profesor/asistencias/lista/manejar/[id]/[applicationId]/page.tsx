"use client";

import { getAssistanceStatusByIdWithDocument } from "@/app/services/assistance.service";
import { useQuery } from "@tanstack/react-query";
import { use, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, FileText } from "lucide-react";
import SpinnerPage from "@/components/shared/spinner-page";

export default function ApplicationDetail({
  params,
}: {
  params: Promise<{ id: string; applicationId: string }>;
}) {
  const { applicationId } = use(params);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const {
    data: application,
    isFetching,
    error,
  } = useQuery({
    queryKey: [`assitance-application-${applicationId}`],
    queryFn: () => getAssistanceStatusByIdWithDocument(applicationId),
  });

  useEffect(() => {
    if (application?.document?.file?.data) {
      const byteArray = new Uint8Array(application.document.file.data);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [application]);
  if (isFetching) return <SpinnerPage />

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
            name={application?.student?.name}
            email={application?.student?.email}
          />
        )}
      </div>
    </div>
  );
}

function PdfViewer({ pdfUrl }: { pdfUrl: string | null }) {
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
  name?: string;
  email?: string;
  pdfUrl?: string;
  onAccept?: () => void;
  onReject?: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
}

function StudentProfileCard({
  name = "Estudiante",
  email = "correo@universidad.edu",
  pdfUrl = "#",
  onAccept = () => console.log("Accepted"),
  onReject = () => console.log("Rejected"),
  onPrevious = () => console.log("Previous applicant"),
  onNext = () => console.log("Next applicant"),
}: StudentProfileProps) {
  return (
    <div className="w-full">
      <div className="bg-white rounded-3xl shadow-lg p-6 mb-4">
        <div className="mb-6">
          <p className="text-lg font-medium mb-1">Nombre estudiante:</p>
          <p className="text-xl mb-4 font-semibold text-foreground">{name}</p>

          <p className="text-lg font-medium mb-1">Correo:</p>
          <p className="text-xl mb-4 font-semibold text-foreground">{email}</p>

          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 bg-gray-100 text-foreground font-medium rounded-lg hover:bg-gray-200 transition-colors mb-4"
          >
            <FileText className="w-5 h-5" />
            Ver PDF en nueva pestaña
          </a>

          <div className="border-b border-gray-300 mb-6"></div>

          <div className="space-y-3">
            <button
              onClick={onAccept}
              className="w-full py-3 bg-core text-white font-medium rounded-lg hover:bg-core-highlight transition-colors"
            >
              Aceptar solicitud
            </button>

            <button
              onClick={onReject}
              className="w-full py-3 bg-[#e56b6b] text-white font-medium rounded-lg hover:bg-[#d45c5c] transition-colors"
            >
              Rechazar solicitud
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-between gap-2">
        <button
          onClick={onPrevious}
          className="flex items-center gap-2 bg-core text-white px-4 py-2 rounded-lg hover:bg-core-highlight transition-colors flex-1"
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
          className="flex items-center gap-2 bg-core text-white px-4 py-2 rounded-lg hover:bg-core-highlight transition-colors flex-1"
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
