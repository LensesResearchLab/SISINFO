"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Download } from "lucide-react";
import SpinnerPage from "@/components/shared/spinner-page";
import { useParams, useRouter } from "next/navigation";
import { getCourseWithDocument } from "@/app/services/billboard.service";
import { useProgramsStore } from "../store";

export default function ApplicationDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = useParams();
  const router = useRouter();

  const { period, ids } = useProgramsStore();

  const currentIndex = ids.findIndex((item) => item === id);
  const prevId = ids[currentIndex - 1];
  const nextId = ids[currentIndex + 1];

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const { data: course, isFetching, error } = useQuery({
    queryKey: ["course-program", id],
    queryFn: () => (typeof id === "string" ? getCourseWithDocument(id) : Promise.reject("Invalid ID"))
  });

  useEffect(() => {
    if (course?.program?.file?.data) {
      const blob = new Blob([new Uint8Array(course.program.file.data)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [course]);

  if (isFetching) return <SpinnerPage />;

  return (
    <div className="flex flex-col h-full w-full">

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        <section className="lg:col-span-2 flex flex-col">
          <div className="flex-1 border rounded-lg overflow-hidden">
            {error ? (
              <p className="text-red-500 p-4">Error al cargar el documento</p>
            ) : pdfUrl ? (
              <iframe
                src={pdfUrl}
                width="100%"
                height="100%"
                title="Documento PDF"
                className="min-h-[400px] md:min-h-[600px]"
              />
            ) : (
              <p className="text-center py-4 text-gray-500">Cargando documento…</p>
            )}
          </div>
        </section>

        <aside className="space-y-6">
          <div className="bg-white rounded-3xl shadow-lg p-6 space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Periodo:</p>
              <p className="text-lg font-semibold text-foreground">{period || "—"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Clase:</p>
              <p className="text-lg font-semibold text-foreground">{course?.name || "—"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Profesor:</p>
              <p className="text-lg font-semibold text-foreground">
                {course?.mainProfessor?.user?.name || "—"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Estado:</p>
              <p className="text-lg font-semibold text-foreground">
                {course?.program ? "Cargado" : "Pendiente"}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => prevId && router.push(
                `/inicio/coordinador/programas/lista/${prevId}?period=${period}`
              )}
              disabled={!prevId}
              className="flex-1 flex items-center justify-center gap-2 bg-core text-white py-3 rounded-lg cursor-pointer hover:bg-core-highlight transition disabled:opacity-50"
            >
              <ArrowLeft /> Anterior
            </button>
            <button
              onClick={() => nextId && router.push(
                `/inicio/coordinador/programas/lista/${nextId}?period=${period}`
              )}
              disabled={!nextId}
              className="flex-1 flex items-center justify-center gap-2 bg-core text-white py-3 rounded-lg cursor-pointer hover:bg-core-highlight transition disabled:opacity-50"
            >
              Siguiente <ArrowRight />
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}