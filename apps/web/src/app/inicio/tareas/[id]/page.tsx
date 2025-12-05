"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ConfirmationModal } from "@/components/shared/confirmation-modal"
import { ROUTES } from "@/app/routes"
import { createTask, getTask } from "@/app/services/tasks.service"
import { TaskType } from "../flows"
import { cn } from "@/lib/utils"
import { CreateTask } from "@/app/types/entities/task.type"
import SpinnerPage from "@/components/shared/spinner-page"
import { YesNoRadioGroup } from "@/components/shared/yes-no-radio-group"

const taskSchema = z.object({
  type: z.nativeEnum(TaskType),
  document: z.instanceof(File).optional(),
  comment: z.string().optional(),
  isApproved: z.boolean().optional(),
  suggestWithdraw: z.boolean().optional(),
  grade: z.string().optional(),
})

export default function TaskForm() {
  const { id } = useParams()
  const router = useRouter()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [task, setTask] = useState<CreateTask  | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [pdfLoading, setPdfLoading] = useState(false)

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      type: TaskType.UPLOAD_FILE,
      document: undefined,
      comment: "",
      suggestWithdraw: false,
      isApproved: false,
      grade: "",
    },
  })

  useEffect(() => {
  if (!id) return;
  let cancelled = false;

  (async () => {
    try {
      const response = await getTask(id as string);
      if (cancelled) return;

      setTask(response);
      form.setValue("type", response.type);
      form.setValue("isApproved", Boolean(response.approved));

      // Si hay PDF, crea el URL SOLO una vez tras el fetch
      if (response?.document?.file?.data) {
        setPdfLoading(true);
        const bytes = new Uint8Array(response.document.file.data);
        const blob = new Blob([bytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
        setPdfLoading(false);
      } else {
        setPdfUrl(null);
      }
    } catch (e) {
      console.error("Error al obtener la tarea:", e);
    } finally {
      if (!cancelled) setLoading(false);
    }
  })();

  return () => {
    cancelled = true;
  };
  // ✅ solo depende de id
}, [form, id]);

// Limpieza del ObjectURL en un efecto aparte
useEffect(() => {
  return () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
  };
}, [pdfUrl]);

  async function onSubmit(values: z.infer<typeof taskSchema>) {
    const currentStep = typeof task?.step === "string" ? Number(task.step) : task?.step;
    const isFinalGradeStep = currentStep === 7;

    // Validar nota obligatoria en step 7 (Nota 100%)
    if (isFinalGradeStep && !values.grade?.trim()) {
      form.setError("grade", { message: "La nota final es obligatoria" });
      return;
    }

    const suggestText = `Se sugiere retirar la materia al estudiante: ${
    values.suggestWithdraw ? "Sí" : "No"
  }`;

  const finalComment = [values.comment?.trim(), suggestText]
    .filter(Boolean)          // elimina undefined / "" si no hay comentario
    .join("\n");              

    if (!id) return
    const taskData = {
      type: values.type,
      state: "pending",
      date: new Date(),
      comment: finalComment,
      approved: values.isApproved ?? false,
      grade: isFinalGradeStep ? values.grade : undefined,
    }
    await createTask(id as string, taskData, values.document)
    router.push(`${ROUTES.HOME}/${ROUTES.PROJECT_LIST}`)
  }

  if (loading) return <SpinnerPage />
  if (!task) return <div className="text-center py-10 text-red-500">Tarea no encontrada</div>

  const isViewOnly = task.type === TaskType.VIEW_COMMENTS
  const hasDocument = Boolean(task.document)

  return (
    <div className="min-h-full mx-auto p-4 container max-w-6xl">
      <div className="w-full flex flex-col md:flex-row gap-6 bg-card shadow-xl rounded-2xl p-6 border border-gray-100">
        {hasDocument && (
          <div className="w-full md:w-3/5">
            {pdfUrl ? (
              <iframe
                src={pdfUrl}
                width="100%"
                height="700px"
                title="Documento PDF"
                className="rounded-md border"
              />
            ) : (
              pdfLoading && <p className="text-center text-gray-500">Cargando documento…</p>
            )}
          </div>
        )}

        <div className={cn("space-y-6", hasDocument ? "md:w-2/5" : "w-full")}>
          {isViewOnly ? (
            <>
              {task.comment && (
                <>
                  <h2 className="text-lg font-semibold text-center text-primary">
                    Comentarios y Nota Final
                  </h2>
                  <div className="bg-muted rounded-md p-3 border border-gray-200 text-sm text-gray-700 whitespace-pre-line">
                    {task.comment}
                  </div>
                </>
              )}
              {task.grade && (
                <div className="bg-green-50 rounded-md p-4 border border-green-200 text-center">
                  <span className="text-sm text-green-600 font-medium">Nota Final:</span>
                  <span className="ml-2 text-2xl font-bold text-green-700">{task.grade}</span>
                </div>
              )}
              {!task.comment && !task.grade && (
                <div className="text-gray-500 text-sm text-center">No hay comentarios disponibles.</div>
              )}
              <div className="flex justify-center gap-3 mt-4">
                <p className="text-sm text-gray-500 text-center">
                  Esta información es solo de lectura. Puedes volver cuando lo desees.
                </p>
              </div>
              <div className="flex justify-center gap-3 mt-2">
                <Button
                  onClick={() => router.push(`${ROUTES.HOME}/${ROUTES.PROJECT_LIST}`)}
                  variant="outline"
                  className="border-core text-core hover:bg-core/10"
                >
                  Volver
                </Button>
              </div>
            </>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {(task.type === TaskType.UPLOAD_FILE || task.type === TaskType.ABET_TASK) && (
                  <FormField
                    control={form.control}
                    name="document"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary font-semibold">
                          Adjuntar archivo PDF
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => field.onChange(e.target.files?.[0])}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {task.type === TaskType.SEND_COMMENTS && (
                  <>
                  <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary font-semibold">
                          Comentarios
                        </FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Escribe tus comentarios aquí…" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {task.step === 4 && (
                    <FormField
                      control={form.control}
                      name="suggestWithdraw"
                      render={({ field }) => (
                        <FormItem className="space-y-3 text-center">
                          <FormLabel className="font-semibold text-base">
                            ¿Sugiere que el estudiante retire la materia?
                          </FormLabel>
                          <FormControl>
                            <YesNoRadioGroup
                              name="suggestWithdraw"
                              value={field.value ?? false}
                              onChange={field.onChange}
                              className="justify-center"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  {task.step === 7 && (
                    <FormField
                      control={form.control}
                      name="grade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary font-semibold">
                            Nota Final (Obligatoria)
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min="0"
                              max="100"
                              step="0.1"
                              placeholder="Ingrese la nota (0-100)"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
</>
                )}

                {task.type === TaskType.SEND_APPROVE && (
                  <>
                    {task.comment && (
                      <div className="bg-muted rounded-md p-3 border border-gray-200 text-sm text-gray-700 whitespace-pre-line">
                        {task.comment}
                      </div>
                    )}
                    <FormField
                      control={form.control}
                      name="isApproved"
                      render={({ field }) => (
                        <FormItem className="space-y-3 text-center">
                          <FormLabel className="font-semibold text-base">
                            ¿Aprobar esta tarea?
                          </FormLabel>
                          <FormControl>
                            <YesNoRadioGroup
                              name="isApproved"
                              value={field.value ?? false}
                              onChange={field.onChange}
                              className="justify-center"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                <div className="flex justify-center">
                  <Button
                    type="button"
                    onClick={async () => {
                      const isValid = await form.trigger()
                      if (isValid) setIsModalOpen(true)
                    }}
                    className="bg-core text-white hover:bg-core-dark w-full"
                  >
                    Enviar tarea
                  </Button>
                </div>

                <ConfirmationModal
                  dialogText={{
                    title: "Confirmar acción",
                    description: "¿Estás seguro de completar esta tarea?",
                    buttonText: "Confirmar",
                    successTitle: "Tarea completada",
                    successText: "La tarea se completó correctamente",
                    url: `${ROUTES.HOME}/${ROUTES.PROJECT_LIST}`,
                  }}
                  onConfirm={form.handleSubmit(onSubmit)}
                  open={isModalOpen}
                  setIsOpen={setIsModalOpen}
                />
              </form>
            </Form>
          )}
        </div>
      </div>
    </div>
  )
}
