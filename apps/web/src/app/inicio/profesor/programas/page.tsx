"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getBillboard, getCourseWithDocument } from "@/app/services/billboard.service";
import { getPeriodsWMap } from "@/app/services/period.service";
import { mapPeriodToString } from "@/app/mappers/period.mapper";
import { useAuth } from "@/hooks/use-auth";
import { Course as BillboardCourse } from "@/app/types/entities/billboard.type";
import { uploadCourseProgram } from "@/app/services/courses.service";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { type ColumnDef } from "@tanstack/react-table";
import { Eye, Upload as UploadIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
// Removed Badge import as Estado column now uses plain text

export default function ProfessorCourseProgramsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const qc = useQueryClient();

  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [viewTitle, setViewTitle] = useState<string>("");

  // Periods
  const { data: fetchedPeriods } = useQuery({
    queryKey: ["periods"],
    queryFn: getPeriodsWMap,
    staleTime: 1000 * 60 * 5,
  });
  const periods = useMemo(() => (fetchedPeriods ?? []).map(mapPeriodToString), [fetchedPeriods]);

  // Seleccionar automáticamente el último período disponible (el más reciente)
  useEffect(() => {
    if (periods && periods.length > 0 && !selectedPeriod) {
      const lastPeriod = periods[periods.length - 1];
      setSelectedPeriod(lastPeriod);
    }
  }, [periods, selectedPeriod]);

  // Courses for selected period (billboard)
  const { data: billboard, isFetching: billboardLoading } = useQuery({
    queryKey: ["billboard", selectedPeriod],
    queryFn: () => getBillboard(selectedPeriod),
    enabled: Boolean(selectedPeriod),
  });

  // Filter only courses where the logged professor is mainProfessor
  const myLeaderCourses: BillboardCourse[] = useMemo(() => {
    if (!billboard?.courses || !user) return [];
    return billboard.courses.filter(
      (c: BillboardCourse) => c.mainProfessor?.user?.id === user.id
    );
  }, [billboard, user]);

  const onFileSelected = async (courseId: string, fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const file = fileList[0];
    if (file.type !== "application/pdf") {
      toast.error("Solo se permiten archivos PDF");
      return;
    }
    try {
      setUploadingFor(courseId);
      await uploadCourseProgram(courseId, file);
      toast.success("Programa subido correctamente");
      // Refresh billboard and possibly course cache
      await qc.invalidateQueries({ queryKey: ["billboard", selectedPeriod] });
    } catch (e: any) {
      toast.error(e?.message ?? "Error al subir el programa");
    } finally {
      setUploadingFor(null);
    }
  };

  const onViewPdf = async (course: BillboardCourse) => {
    try {
      setViewTitle(`${course.code} · ${course.name}`);
      setViewOpen(true);
      setPdfLoading(true);
      setPdfUrl(null);
      const detail = await getCourseWithDocument(course.id);
      const bytes = detail?.program?.file?.data as number[] | undefined;
      if (!bytes || bytes.length === 0) {
        toast.info("Este curso no tiene programa cargado");
        setViewOpen(false);
        return;
      }
      const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (e: any) {
      toast.error(e?.message ?? "No fue posible cargar el PDF");
      setViewOpen(false);
    } finally {
      setPdfLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  const columns: ColumnDef<BillboardCourse>[] = useMemo(() => [
    {
      accessorKey: "code",
      header: "Código",
      cell: ({ row }) => <span className="text-foreground">{row.original.code}</span>,
    },
    {
      accessorKey: "name",
      header: "Clase",
      cell: ({ row }) => <span className="font-semibold text-foreground">{row.original.name}</span>,
    },
    {
      id: "status",
      header: "Estado",
      cell: ({ row }) => {
        const loaded = Boolean(row.original.program);
        return <span className="text-foreground">{loaded ? "Cargado" : "Pendiente"}</span>;
      },
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const course = row.original;
        const inputId = `file-${course.id}`;
        const hasProgram = Boolean(course.program);
        const viewDisabled = pdfLoading || !hasProgram;
        return (
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <span>
                    <Button
                      type="button"
                      size="sm"
                      className="gap-2"
                      disabled={viewDisabled}
                      onClick={() => onViewPdf(course)}
                    >
                      <Eye className="w-4 h-4" /> Ver PDF
                    </Button>
                  </span>
                </TooltipTrigger>
                {viewDisabled && (
                  <TooltipContent>
                    {!hasProgram ? "Primero debes subir el programa del curso" : "Cargando…"}
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>

            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              id={inputId}
              onChange={(e) => onFileSelected(course.id, e.target.files)}
            />
              <Button
                type="button"
                variant="default"
                size="sm"
                disabled={uploadingFor === course.id}
                onClick={() => document.getElementById(inputId)?.click()}
                className="gap-2"
              >
                <UploadIcon className="w-4 h-4" />
                {uploadingFor === course.id ? "Subiendo…" : course.program ? "Reemplazar PDF" : "Subir PDF"}
              </Button>
          </div>
        );
      },
    },
  ], [onFileSelected, uploadingFor, pdfLoading]);

  return (
    <div className="min-w-full mx-auto p-4 space-y-6 text-foreground">
      <div className="bg-card border-none rounded-xl p-5">
        <h2 className="text-xl font-bold text-core">Subir programas de curso</h2>
        <p className="text-sm text-muted-foreground">
          Solo puedes subir el PDF del programa de los cursos en los que eres profesor líder.
        </p>

        {/* Period selector */}
        <div className="mt-4 w-full sm:w-72">
          <label htmlFor="period-select" className="block text-sm mb-1 text-foreground">Periodo</label>
          <select
            id="period-select"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-input bg-background text-foreground rounded-md px-3 py-2 w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="" disabled>Seleccione un periodo</option>
            {periods.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Courses table */}
      <div className="bg-card border-none rounded-xl p-5">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Tus cursos como líder</h3>
        {authLoading || billboardLoading ? (
          <p className="text-sm text-muted-foreground">Cargando…</p>
        ) : selectedPeriod && myLeaderCourses.length === 0 ? (
          <p className="text-sm text-muted-foreground">No tienes cursos como líder en el periodo seleccionado.</p>
        ) : (
          <DataTable columns={columns} data={myLeaderCourses} />
        )}
      </div>

      {/* View PDF dialog */}
      <Dialog open={viewOpen} onOpenChange={(open) => {
        if (!open && pdfUrl) URL.revokeObjectURL(pdfUrl);
        setViewOpen(open);
        if (!open) setPdfUrl(null);
      }}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>{viewTitle || "Programa del curso"}</DialogTitle>
            <DialogDescription>Vista previa del documento PDF</DialogDescription>
          </DialogHeader>
          <div className="min-h-[60vh] w-full">
            {pdfLoading && (
              <p className="text-center text-muted-foreground">Cargando documento…</p>
            )}
            {!pdfLoading && pdfUrl && (
              <iframe
                src={pdfUrl}
                title="Documento PDF"
                className="w-full h-[70vh] rounded-md"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
