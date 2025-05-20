"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SpinnerPage from "@/components/shared/spinner-page";
import { useParams, useRouter } from "next/navigation";

import { useProgramsStore } from "../store";
import { getCourseWithDocument } from "@/app/services/billboard.service";

/**
 * ApplicationDetail Component
 *
 * Displays detailed information about a selected course's academic program, including a PDF document if available.
 * Enables navigation between previous and next courses within the selected period.
 *
 * Features:
 * - Fetches course details and associated program document (PDF)
 * - Displays course metadata (name, professor, status, etc.)
 * - PDF preview using iframe
 * - Navigation buttons to view previous and next course documents
 *
 * @returns {JSX.Element} UI view for individual course detail and program
 */
export default function ApplicationDetail() {
  const { id } = useParams(); // Extract course ID from the route
  const router = useRouter();

  const { period, ids } = useProgramsStore(); // Global state for current period and course ID list

  // Determine the position of the current course and its neighbors
  const currentIndex = ids.findIndex((item) => item === id);
  const prevId = ids[currentIndex - 1];
  const nextId = ids[currentIndex + 1];

  const [pdfUrl, setPdfUrl] = useState<string | null>(null); // Blob URL for the PDF document

  // Fetch course data using React Query
  const { data: course, isFetching, error } = useQuery({
    queryKey: ["course-program", id],
    queryFn: () =>
      typeof id === "string" ? getCourseWithDocument(id) : Promise.reject("Invalid ID"),
  });

  /**
   * Converts the course program file (binary buffer) to a Blob URL for rendering in an iframe.
   * Cleans up the URL when the component unmounts or the course changes.
   */
  useEffect(() => {
    if (course?.program?.file?.data) {
      const blob = new Blob([new Uint8Array(course.program.file.data)], {
        type: "application/pdf",
      });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      return () => URL.revokeObjectURL(url); // Cleanup
    }
  }, [course]);

  // Show loading spinner while data is being fetched
  if (isFetching) return <SpinnerPage />;

  return (
    <div className="flex flex-col h-full w-full">
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Left section: PDF document or error/loading message */}
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

        {/* Right section: Course metadata and navigation buttons */}
        <aside className="space-y-6">
          {/* Course Information Card */}
          <div className="bg-white rounded-3xl shadow-lg p-6 space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Periodo:</p>
              <p className="text-lg font-semibold text-foreground">
                {period ?? "—"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Clase:</p>
              <p className="text-lg font-semibold text-foreground">
                {course?.name ?? "—"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Profesor:</p>
              <p className="text-lg font-semibold text-foreground">
                {course?.mainProfessor?.user?.name ?? "—"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Estado:</p>
              <p className="text-lg font-semibold text-foreground">
                {course?.program ? "Cargado" : "Pendiente"}
              </p>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-2">
            <button
              onClick={() =>
                prevId &&
                router.push(
                  `/inicio/coordinador/programas/lista/${prevId}?period=${period}`
                )
              }
              disabled={!prevId}
              className="flex-1 flex items-center justify-center gap-2 bg-core text-white py-3 rounded-lg cursor-pointer hover:bg-core-highlight transition disabled:opacity-50"
            >
              <ArrowLeft /> Anterior
            </button>
            <button
              onClick={() =>
                nextId &&
                router.push(
                  `/inicio/coordinador/programas/lista/${nextId}?period=${period}`
                )
              }
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
