"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ConfirmationModal } from "@/components/shared/confirmation-modal";
import { ROUTES } from "@/app/routes";

import { createTask, getTask } from "@/app/services/tasks.service";
import { TaskType } from "../flows";

/* ---------- VALIDACIÓN ---------- */
const taskSchema = z.object({
  type: z.nativeEnum(TaskType),
  document: z.instanceof(File).optional(),
  comment: z.string().optional(),
  isApproved: z.boolean().optional(),
});

export default function TaskForm() {
  const { id } = useParams();
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState<any>(null);

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);          // ← nuevo

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      type: TaskType.UPLOAD_FILE,
      document: undefined,
      comment: "",
      isApproved: false,
    },
  });

  /* ---------- CARGAR TAREA ---------- */
  useEffect(() => {
    async function fetchTask() {
      if (!id) return;
      try {
        const response = await getTask(id as string);
        setTask(response);

        // Si la tarea trae PDF, obtenemos url
        if (response?.document?.file?.data) {
          setPdfLoading(true);
          const bytes = new Uint8Array(response.document.file.data);
          const blob = new Blob([bytes], { type: "application/pdf" });
          setPdfUrl(URL.createObjectURL(blob));
          setPdfLoading(false);
        }

        form.setValue("type", response.type);
        form.setValue("isApproved", Boolean(response.approved));
      } catch (err) {
        console.error("Error al obtener la tarea:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTask();

    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [id]);

  /* ---------- GUARDAR TAREA ---------- */
  async function onSubmit(values: z.infer<typeof taskSchema>) {
    if (!id) return;

    const taskData = {
      type: values.type,
      state: "pending",
      date: new Date(),
      comment: values.comment,
      approved: values.isApproved,
    };

    await createTask(id as string, taskData, values.document);
    router.push(`${ROUTES.HOME}/${ROUTES.PROJECT_LIST}`);
  }

  /* ---------- UI ---------- */
  if (loading) return <div className="text-center py-10">Cargando tarea…</div>;
  if (!task)
    return (
      <div className="text-center py-10 text-red-500">
        Tarea no encontrada
      </div>
    );

  const hasDocument = Boolean(task.document);

  return (
    <div className="min-h-full mx-auto p-4 container max-w-3xl">
      <div className="w-full bg-card shadow-xl rounded-2xl p-8 space-y-4 border border-gray-100">
        {/* Encabezado */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-core-highlight">
            {task.title ?? task.document?.name ?? "Revisión de documento"}
          </h1>
          {task.description && (
            <p className="text-muted-foreground">{task.description}</p>
          )}
        </div>

        {/* Comentario previo de la tarea */}
        {task.comment && task.comment.trim() !== "" && (
          <div className="bg-muted/60 p-4 rounded-md border text-sm space-y-1">
            <p className="font-semibold text-primary">Comentario existente:</p>
            <p className="whitespace-pre-wrap">{task.comment}</p>
          </div>
        )}

        {/* Visor PDF */}
        {hasDocument &&
          (pdfUrl ? (
            <iframe
              src={pdfUrl}
              width="100%"
              height="600px"
              title="Documento PDF"
              className="min-h-[400px] md:min-h-[600px]"
            />
          ) : (
            pdfLoading && (
              <p className="text-center text-gray-500">
                Cargando documento…
              </p>
            )
          ))}

        {/* Formulario */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tipo de tarea */}
              <FormItem>
                <FormLabel className="font-semibold">Tipo de tarea</FormLabel>
                <div className="p-2 bg-muted rounded-md text-sm text-primary font-medium capitalize">
                  {task.type.replace("_", " ").toLowerCase()}
                </div>
              </FormItem>

              {/* Subida de archivo */}
              {task.type === TaskType.UPLOAD_FILE && (
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="document"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary font-semibold">
                          Selecciona el documento
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="application/pdf"
                            onChange={(e) =>
                              field.onChange(e.target.files?.[0])
                            }
                            className="focus:ring-2 focus:ring-core border-gray-300 rounded-lg"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Comentarios */}
              {task.type === TaskType.SEND_COMMENTS && (
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary font-semibold">
                          Comentarios
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Escribe tus comentarios aquí…"
                            className="min-h-[100px] focus:ring-2 focus:ring-core border-gray-300 rounded-lg text-primary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Aprobación */}
              {task.type === TaskType.SEND_APPROVE && (
                <FormField
                  control={form.control}
                  name="isApproved"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        ¿Aprobar tarea?
                      </FormLabel>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Botón y modal */}
            <div className="flex justify-center">
              <Button
                type="button"
                onClick={async () => {
                  const isValid = await form.trigger();
                  if (isValid) setIsModalOpen(true);
                }}
                className="bg-core text-white hover:bg-core-dark"
              >
                Confirmar tarea
              </Button>

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
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
