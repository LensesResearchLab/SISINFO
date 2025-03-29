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

import { addDays, format } from "date-fns";

import DateRangePicker from "@/components/shared/datepicker-range"
import { mapStringtoPeriod } from "@/app/mappers/period.mapper";

const thesisSchema = z.object({
  title: z.string().min(5, "El título debe tener al menos 5 caracteres"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  category: z.string().min(1, "Debe seleccionar una categoría"),
  period: z.string().min(1, "Debe seleccionar un período"),
  dateRange: z.object({
    from: z.date({ required_error: "Debes seleccionar una fecha de inicio" }),
    to: z.date({ required_error: "Debes seleccionar una fecha de finalización" }),
  }),
  requirements: z.array(z.object({ description: z.string() })).min(1, "Debe agregar al menos un requisito"),
});

export default function GraduateAssistanceForm() {
  const form = useForm<z.infer<typeof thesisSchema>>({
    resolver: zodResolver(thesisSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      period: "2025-10",
      dateRange: {
        from: new Date(),
        to: addDays(new Date(), 1),
      },
      requirements: [],
    },
  });

  const dialogText = {
    title: "Publicar Proyecto",
    description: "¿Estás seguro de que deseas publicar este proyecto?",
    buttonText: "Publicar Proyecto",
    successTitle: "Proyecto Publicado",
    successText: "Tu proyecto ha sido publicado exitosamente",
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
      period:mapStringtoPeriod(data.period),
      startDate: data.dateRange.from.toISOString(),
      endDate: data.dateRange.to.toISOString(),
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

  return (
    <div
      className="max-w-3xl mx-auto p-4"
      style={{ backgroundColor: "var(--subtable)" }}
    >
      <Card className="border-none w-3xl">
        <CardHeader style={{ color: "var(--core)" }}>
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
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una clasificación" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="IA">
                            Inteligencia Artificial
                          </SelectItem>
                          <SelectItem value="DB">
                            Bases de Datos
                          </SelectItem>
                          <SelectItem value="Web">
                            Desarrollo Web
                          </SelectItem>
                          <SelectItem value="Cyber">
                            Ciberseguridad
                          </SelectItem>
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
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un período" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="2025-10">2025-10</SelectItem>
                          <SelectItem value="2026-01">2026-01</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="dateRange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rango de fechas</FormLabel>
                    <FormControl>
                      <DateRangePicker value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage>{form.formState.errors.dateRange?.from?.message || form.formState.errors.dateRange?.to?.message}</FormMessage>
                  </FormItem>
                )}
              />

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
                          className="px-3 py-1 rounded-full transition-colors"
                          style={{ backgroundColor: "var(--core-soft)", color: "var(--foreground-soft)" }}
                        >
                          {tag.description}
                          <button
                            type="button"
                            onClick={() =>
                              field.onChange(field.value.filter((t) => t !== tag))
                            }
                            className="ml-1"
                            style={{ color: "var(--core-highlight)" }}
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
                onClick={() => setIsModalOpen(true)}
                style={{ backgroundColor: "var(--core-highlight)" }}
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
