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

const taskSchema = z.object({
  taskType: z.nativeEnum(TaskType),
  document: z.instanceof(File).optional(),
  comment: z.string().optional(),
  isApproved: z.boolean().optional(),
});

export default function TaskForm() {
  const { id } = useParams();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState<any>(null); // Puedes tiparlo mejor si sabes la forma exacta

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      taskType: TaskType.UPLOAD_FILE,
      document: undefined,
      comment: "",
      isApproved: false,
    },
  });

  // Obtener tarea desde el backend
  useEffect(() => {
    async function fetchTask() {
      if (!id) return;
      try {
        const response = await getTask(id as string);
        setTask(response);
        form.setValue("taskType", response.type);
      } catch (error) {
        console.error("Error al obtener la tarea", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTask();
  }, [id, form]);

  const dialogText = {
    title: "Confirmar Acción",
    description: "¿Estás seguro de que deseas completar esta tarea?",
    buttonText: "Confirmar",
    successTitle: "Tarea completada",
    successText: "La tarea se completó correctamente",
    url: `${ROUTES.HOME}/${ROUTES.PROJECT_LIST}`,
  };

  async function onSubmit(values: z.infer<typeof taskSchema>) {
  if (!id) return;

  const taskData = {
    type: values.taskType,
    state: "pending",
    date: new Date(),
    payload: {
      comment: values.comment,
      isApproved: values.isApproved,
    },
  };

  const file = values.document ?? undefined;
  
  await createTask(id as string, taskData, file);
  router.push(dialogText.url);
}


  if (loading) return <div className="text-center py-10">Cargando tarea...</div>;
  if (!task) return <div className="text-center py-10 text-red-500">Tarea no encontrada</div>;

  return (
    <div className="min-h-full mx-auto p-4 container max-w-3xl">
      <div className="w-full bg-card shadow-xl rounded-2xl p-8 space-y-2 border border-gray-100">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-core-highlight">{task.title}</h1>
          <p className="text-muted-foreground">{task.description}</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormItem>
                <FormLabel className="font-semibold">Tipo de Tarea</FormLabel>
                <div className="p-2 bg-muted rounded-md text-sm text-primary font-medium">
                  {task.type === TaskType.UPLOAD_FILE && "Subir archivo"}
                  {task.type === TaskType.SEND_COMMENTS && "Enviar comentarios"}
                  {task.type === TaskType.SEND_APPROVE && "Aprobar tarea"}
                </div>
              </FormItem>

              {task.type === TaskType.UPLOAD_FILE && (
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="document"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary font-semibold">Selecciona el Documento</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            className="focus:ring-2 focus:ring-core border-gray-300 rounded-lg"
                            onChange={(e) => field.onChange(e.target.files?.[0])}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {task.type === TaskType.SEND_COMMENTS && (
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary font-semibold">Comentarios</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Escribe tus comentarios aquí..."
                            className="min-h-[100px] focus:ring-2 focus:ring-core border-gray-300 rounded-lg text-primary"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {task.type === TaskType.SEND_APPROVE && (
                <FormField
                  control={form.control}
                  name="isApproved"
                  render={({ field }) => (
                    <FormItem className="text-primary">
                      <FormLabel className="font-semibold">¿Aprobar tarea?</FormLabel>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => field.onChange(checked)}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="flex justify-center mt-5">
              <Button
                type="button"
                onClick={async () => {
                  const isValid = await form.trigger();
                  if (isValid) {
                    setIsModalOpen(true);
                  }
                }}
                className="bg-core text-white hover:bg-core-dark"
              >
                Confirmar Tarea
              </Button>
              <ConfirmationModal
                dialogText={dialogText}
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