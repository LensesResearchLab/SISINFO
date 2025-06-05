"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmationModal } from "@/components/shared/confirmation-modal";
import { ROUTES } from "@/app/routes";
import { createGraduatedAssistance } from "../../../../services/assistance.service";
import { addDays } from "date-fns";
import { getPeriods } from "@/app/services/period.service";
import ErrorPage from "@/components/shared/error-page";
import SpinnerPage from "@/components/shared/spinner-page";
import { useQuery } from "@tanstack/react-query";

/**
 * GraduateAssistanceForm Component
 *
 * This form allows professors to create and publish a new *Graduated Assistance* offer. It includes:
 *
 * 🔧 Form Features:
 * - Title, Description, Category, Period, Date Range, and Requirements fields.
 * - Uses Zod for validation and React Hook Form for controlled input handling.
 * - Requirements are managed dynamically with the ability to add and remove badges.
 * - Confirmation modal is shown before submitting the offer.
 *
 * 📤 Submission:
 * - On confirmation, the data is transformed (e.g., date to ISO string, period mapping)
 *   and sent to the backend using `createGraduatedAssistance`.
 *
 * 🧩 Additional Components:
 * - `DateRangePicker`: Custom component for selecting a date range.
 * - `ConfirmationModal`: Modal used to confirm publishing action.
 *
 * 🧪 Validation Schema (Zod):
 * - Validates string lengths, non-empty category and period, valid date range,
 *   and requires at least one requirement.
 *
 * 📌 UX Design:
 * - UI components use ShadCN/Ui standards for consistency.
 * - Modular and mobile-friendly with Tailwind-based responsive layout.
 *
 * 👨‍🏫 Audience:
 * - Used by professors to register new graduate assistance positions.
 */


const thesisSchema = z.object({
  title: z.string().min(5, "El título debe tener al menos 5 caracteres"),
  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres"),
  category: z.string().min(1, "Debe seleccionar una categoría"),
  period: z.string().min(1, "Debe seleccionar un período"),
  startDate: z.date({ required_error: "Debes seleccionar una fecha de inicio" }),
  endDate: z.date({ required_error: "Debes seleccionar una fecha de finalización" }),
  requirements: z
    .array(z.object({ description: z.string() }))
    .min(1, "Debe agregar al menos un requisito"),
});


export default function GraduateAssistanceForm() {
  const form = useForm<z.infer<typeof thesisSchema>>({
    resolver: zodResolver(thesisSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      period: "202510",
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      requirements: [],
    }

  });

  const dialogText = {
    title: "Publicar asistencia",
    description: "¿Estás seguro de que deseas publicar esta asistencia?",
    buttonText: "Publicar asistencia",
    successTitle: "Asistencia Publicada",
    successText: "Tu asistencia ha sido publicada exitosamente",
    url: `${ROUTES.HOME}/${ROUTES.PROFESSOR_ASSISTANCE_LIST}`,
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRequirement, setNewRequirement] = useState("");

  const handleAddRequirement = () => {
    if (!newRequirement.trim()) return;
    form.setValue("requirements", [
      ...form.getValues("requirements"),
      { description: newRequirement },
    ]);
    setNewRequirement("");
  };

  const onSubmit = async (data: z.infer<typeof thesisSchema>) => {
    const payload = {
      ...data,
      period: data.period,
      startDate: data.startDate.toISOString(),
      endDate: data.endDate.toISOString(),
    };
    createGraduatedAssistance(payload)
      .then(() => {
        setIsModalOpen(false);
        console.log("Assistance created");
      })
      .catch((error) => {
        setIsModalOpen(false);
        console.log(error);
      });
  };


  const {
    data: periods,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["periods"],
    queryFn: async () => getPeriods()
  });

  if (isFetching) return <SpinnerPage />
  if (error) return <ErrorPage />

  return (
    <div
      className="max-w-3xl mx-auto p-4 bg-subtable"
    >
      <Card className="border-none w-3xl">
        <CardHeader className="text-core">
          <CardTitle className="text-2xl">
            Nueva oferta de asistencia graduada
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Escribe el título aquí..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea
                        className="h-32 resize-none"
                        placeholder="Describe la asistencia"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Clasificación</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una clasificación" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="IA">
                            Inteligencia Artificial
                          </SelectItem>
                          <SelectItem value="DB">Bases de Datos</SelectItem>
                          <SelectItem value="Web">Desarrollo Web</SelectItem>
                          <SelectItem value="Cyber">Ciberseguridad</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="period"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Periodo</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un período" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {
                            (periods ?? []).map(
                              (period: string) => <SelectItem value={period} key={period}>{period}</SelectItem>
                            )
                          }
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de inicio</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          value={field.value.toISOString().split("T")[0]}
                          onChange={(e) => field.onChange(new Date(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de finalización</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          value={field.value.toISOString().split("T")[0]}
                          onChange={(e) => field.onChange(new Date(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              </div>

              <FormField
                control={form.control}
                name="requirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Requisitos</FormLabel>
                    <div className="flex gap-2">
                      <Input
                        value={newRequirement}
                        onChange={(e) => setNewRequirement(e.target.value)}
                        placeholder="Escribe un requisito..."
                      />
                      <Button type="button" onClick={handleAddRequirement}>
                        Agregar
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {field.value.map((tag, index) => (
                        <Badge
                          key={`${tag}-${index}`}
                          variant="secondary"
                          className="px-3 py-1 rounded-full transition-colors bg-core-soft text-foreground-soft"
                        >
                          {tag.description}
                          <button
                            type="button"
                            onClick={() =>
                              field.onChange(
                                field.value.filter((t) => t !== tag)
                              )
                            }
                            className="ml-1 text-core-highlight"
                          >
                            <X size={14} className="inline-block" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                className="bg-core-highlight"
                onClick={() => setIsModalOpen(true)}
              >
                Publicar asistencia
              </Button>
              <ConfirmationModal
                dialogText={dialogText}
                onConfirm={form.handleSubmit(onSubmit)}
                open={isModalOpen}
                setIsOpen={setIsModalOpen}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
