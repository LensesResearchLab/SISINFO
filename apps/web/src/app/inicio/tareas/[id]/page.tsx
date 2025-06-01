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
import { Checkbox } from "@/components/ui/checkbox"
import { CreateTask } from "@/app/types/entities/task.type"

const taskSchema = z.object({
  type: z.nativeEnum(TaskType),
  document: z.instanceof(File).optional(),
  comment: z.string().optional(),
  isApproved: z.boolean().optional(),
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
      isApproved: false,
    },
  })

  useEffect(() => {
    async function fetchTask() {
      if (!id) return
      try {
        const response = await getTask(id as string)
        setTask(response)

        if (response?.document?.file?.data) {
          setPdfLoading(true)
          const bytes = new Uint8Array(response.document.file.data)
          const blob = new Blob([bytes], { type: "application/pdf" })
          setPdfUrl(URL.createObjectURL(blob))
          setPdfLoading(false)
        }

        form.setValue("type", response.type)
        form.setValue("isApproved", Boolean(response.approved))
      } catch (err) {
        console.error("Error al obtener la tarea:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchTask()
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl)
    }
  }, [form, id, pdfUrl])

  async function onSubmit(values: z.infer<typeof taskSchema>) {
    if (!id) return
    const taskData = {
      type: values.type,
      state: "pending",
      date: new Date(),
      comment: values.comment ?? '',
      approved: values.isApproved ?? false,
    }
    await createTask(id as string, taskData, values.document)
    router.push(`${ROUTES.HOME}/${ROUTES.PROJECT_LIST}`)
  }

  if (loading) return <div className="text-center py-10">Cargando tarea…</div>
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
                    Comentarios
                  </h2>
                  <div className="bg-muted rounded-md p-3 border border-gray-200 text-sm text-gray-700 whitespace-pre-line">
                    {task.comment}
                  </div>
                </>
              )}
              {!task.comment && (
                <div className="text-gray-500 text-sm text-center">No hay comentarios disponibles.</div>
              )}
              <div className="flex justify-center mt-4">
                <Button
                  onClick={() => router.push(`${ROUTES.HOME}/${ROUTES.PROJECT_LIST}`)}
                  className="bg-core text-white hover:bg-core-dark"
                >
                  Volver al inicio
                </Button>
              </div>
            </>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {task.type === TaskType.UPLOAD_FILE && (
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
                        <FormItem className="flex flex-col items-center gap-2 text-center">
                          <FormLabel className="font-semibold text-base">¿Aprobar esta tarea?</FormLabel>
                          <div className="flex items-center gap-3">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                id="isApproved"
                              />
                            </FormControl>
                            <span
                              className={cn(
                                "text-sm font-medium",
                                field.value ? "text-green-600" : "text-gray-400"
                              )}
                            >
                              {field.value ? "Sí" : "No"}
                            </span>
                          </div>
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
