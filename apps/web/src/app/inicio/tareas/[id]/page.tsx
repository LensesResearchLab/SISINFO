"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
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
import { ROUTES, API_ROUTES } from "@/app/routes"
import { createTask, getTask } from "@/app/services/tasks.service"
import { TaskType } from "../flows"
import { cn } from "@/lib/utils"
import { UploadCloud } from "lucide-react"
import type { Task } from "@/app/types/entities/task.type";
import { toast } from "sonner"
import SpinnerPage from "@/components/shared/spinner-page"
import { YesNoRadioGroup } from "@/components/shared/yes-no-radio-group"
import { flows } from "../flows"

const taskSchema = z.object({
  type: z.nativeEnum(TaskType),
  step: z.number().int().optional(),
  document: z.instanceof(File).optional(),
  comment: z.string().optional(),
  isApproved: z.boolean().optional(),
  suggestWithdraw: z.boolean().optional(),
  grade: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : Number(v)),
    z.number().min(0, "La nota debe estar entre 0 y 5").max(5, "La nota debe ser menor o igual 5").optional()
  ),
}).superRefine((data, ctx) => {
  // Validación nota obligatoria en step 7
  if (data.step === 7 && (data.grade === undefined || Number.isNaN(data.grade))) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "La nota final es obligatoria",
      path: ["grade"],
    });
  }

  // Validación archivo PDF obligatorio para UPLOAD_FILE
  if (data.type === TaskType.UPLOAD_FILE && !data.document) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Debes seleccionar un archivo PDF antes de continuar",
      path: ["document"],
    });
  }

  // Validación archivo Excel obligatorio para ABET
  if (data.type === TaskType.ABET_TASK) {
    const file = data.document as File | undefined;
    if (!file) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "El archivo Excel es obligatorio para este tipo de tarea",
        path: ["document"],
      });
      return;
    }
    const name = (file.name || "").toLowerCase();
    const allowed = [".xlsx", ".xls", ".xlsm"];
    if (!allowed.some((ext) => name.endsWith(ext))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "El archivo debe ser un Excel (.xlsx, .xls, .xlsm)",
        path: ["document"],
      });
    }
  }
});

export default function TaskForm() {
  const { id } = useParams()
  const router = useRouter()
  const searchParams = useSearchParams();

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [task, setTask] = useState<Task  | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [pdfLoading, setPdfLoading] = useState(false)

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      type: TaskType.UPLOAD_FILE,
      step: undefined,
      document: undefined,
      comment: "",
      suggestWithdraw: false,
      isApproved: false,
      grade: undefined,
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
      const stepIndex = typeof response.step === "string" ? Number(response.step) : response.step;
      form.setValue("step", stepIndex);
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
    console.log("SUBMIT step:", currentStep, "grade:", values.grade);
    if (isFinalGradeStep && values.grade === undefined) {
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
      grade: isFinalGradeStep && values.grade !== undefined ? String(values.grade) : undefined,
    }
    try {
      // If this task is attached to a ProjectApplication flow, use existing endpoint
      if (task?.projectActualTask) {
        await createTask(id as string, taskData, values.document)
      } else {
        // Standalone task (e.g., subarea inscription): update task directly
        const patchRes = await fetch(`${API_ROUTES.BASE}/${API_ROUTES.TASKS}/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ approved: taskData.approved, comment: taskData.comment, grade: taskData.grade })
        });
        if (!patchRes.ok) throw new Error('Error actualizando la tarea');

        // If this was an approval/rejection task, map to thesis application status
        if (task?.type === TaskType.SEND_APPROVE && task?.student?.id) {
          // Find the student's thesis application
          const appRes = await fetch(`${API_ROUTES.BASE}/${API_ROUTES.THESIS_APPLICATIONS}/student/${task.student.id}`);
          if (appRes.ok) {
            const application = await appRes.json();
            const status = taskData.approved ? 'APPROVED' : 'REJECTED';
            await fetch(`${API_ROUTES.BASE}/${API_ROUTES.THESIS_APPLICATIONS}/${application.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status })
            });
          }
        }
      }

      toast.success("Tarea enviada correctamente")
    } catch (e) {
      const error = e as Error
      console.error("Error creando tarea:", e)
      toast.error(error?.message ?? "Error al enviar la tarea")
      throw error
    }
  }

  if (loading) return <SpinnerPage />
  if (!task) return <div className="text-center py-10 text-red-500">Tarea no encontrada</div>

  const studentNameFromUrl = searchParams.get("studentName");
  const studentCodeFromUrl = searchParams.get("studentCode");

  const flowKey = "proyectoPregrado"; // Para tener los titulos especificos de cada tarea 
  const stepIndex =
    typeof task?.step === "string" ? Number(task.step) : task?.step;

  const currentStep = 
    stepIndex !== undefined ? flows[flowKey][stepIndex] : undefined;

  const baseTitle = (() => {
    if (task.step === 5) return "Retirará la materia";
    else if (currentStep) return currentStep.title;
    return "Aprobar esta tarea";
  })();

  const taskTitle = `¿${baseTitle}?`; // Asi queda con los signos de interrogacion

  const studentName =
    task?.projectActualTask?.student?.user?.name ?? studentNameFromUrl;

  const studentCode =
    task?.projectActualTask?.student?.code ?? studentCodeFromUrl;


  const isAcceptStudentTask =
    task.type === TaskType.SEND_APPROVE &&
    (Boolean(task?.projectActualTask?.student) || Boolean(studentNameFromUrl));

     
  const isApproved = form.watch("isApproved");
  const approvalAction = isApproved ? "aprobar" : "rechazar";

  const isWithdrawStep = task.step === 5;
const confirmationDescription = (() => {
  if (isWithdrawStep) {
    const withdrawAction = isApproved ? "SI va a" : "NO va a";
    return `¿Estás seguro? Usted está confirmando que ${withdrawAction} retirar la materia.`;
  }
  if (isAcceptStudentTask) {
    return `¿Estás seguro de ${approvalAction} al estudiante ${studentName ?? "este estudiante"}${
      studentCode ? ` (${studentCode})` : ""
    }?`;
  }
  return "¿Estás seguro de completar esta tarea?";
})();



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
              {task.projectActualTask && (
                <>
                  <h2 className="text-lg font-semibold text-center text-primary">Solicitud del estudiante</h2>
                  <div className="bg-muted rounded-md p-3 border border-gray-200 text-sm text-gray-700">
                    {task.projectActualTask.motivation && (
                      <div className="mb-2">
                        <strong>Comentarios del estudiante:</strong>
                        <div className="whitespace-pre-line mt-1">{task.projectActualTask.motivation}</div>
                      </div>
                    )}
                    <div>
                      <strong>Contactó al profesor:</strong>
                      <span className="ml-2">{task.projectActualTask.wasContacted ? 'Sí' : 'No'}</span>
                    </div>
                  </div>
                </>
              )}
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
                    render={({ field }) => {
                      const isAbet = task.type === TaskType.ABET_TASK
                      return (
                        <FormItem>
                          <FormLabel className="text-primary font-semibold">
                            {isAbet ? "Adjuntar archivo Excel" : "Adjuntar archivo PDF"}
                          </FormLabel>
                          <FormControl>
                            <label
                              className={cn(
                                "flex flex-col items-center justify-center w-full",
                                "rounded-lg border-2 border-dashed border-primary/40 bg-primary/5",
                                "cursor-pointer py-8 px-4 gap-3",
                                "hover:border-primary/70 hover:bg-primary/10 transition-colors"
                              )}
                            >
                              <UploadCloud className="h-10 w-10 text-primary/60" />
                              {field.value ? (
                                <span className="text-sm font-medium text-primary">
                                  {(field.value as File).name}
                                </span>
                              ) : (
                                <>
                                  <span className="text-sm font-semibold text-primary">
                                    Haz clic para seleccionar un archivo
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {isAbet ? "Excel (.xlsx, .xls, .xlsm)" : "PDF"}
                                  </span>
                                </>
                              )}
                              <input
                                type="file"
                                className="hidden"
                                accept={
                                  isAbet
                                    ? ".xlsx,.xls,.xlsm,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                                    : "application/pdf"
                                }
                                onChange={(e) => field.onChange(e.target.files?.[0])}
                              />
                            </label>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )
                    }}
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
                              name={field.name}
                              ref={field.ref}
                              onBlur={field.onBlur}
                              type="number"
                              min="0"
                              max="5"
                              step="0.1"
                              placeholder="Ingrese la nota (0-5)"
                              value={field.value ?? ""}
                              onChange={(e) => {
                                const raw = e.target.value;
                                field.onChange(raw === "" ? undefined : Number(raw));
                              }}
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
                        {task.projectActualTask && (
                          <div className="bg-muted rounded-md p-3 border border-gray-200 text-sm text-gray-700 mb-3">
                            {task.projectActualTask.motivation && (
                              <div className="mb-2">
                                <strong>Comentarios del estudiante:</strong>
                                <div className="whitespace-pre-line mt-1">{task.projectActualTask.motivation}</div>
                              </div>
                            )}
                            <div>
                              <strong>Contactó al profesor:</strong>
                              <span className="ml-2">{task.projectActualTask.wasContacted ? 'Sí' : 'No'}</span>
                            </div>
                          </div>
                        )}
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
                            {taskTitle}
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
                      const isValid = await form.trigger(undefined, { shouldFocus: true })
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
                    description: confirmationDescription,
                    buttonText: "Confirmar",
                    successTitle: "Tarea completada",
                    successText: "La tarea se completó correctamente",
                    url: `${ROUTES.HOME}/${ROUTES.PROJECT_LIST}`,
                    errorTitle: "Error al completar la tarea",
                    errorText: "Ocurrió un error al procesar la tarea. Por favor intenta nuevamente.",
                  }}
                  onConfirm={async () => { await form.handleSubmit(onSubmit)(); }}
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
