 "use client"

import { useForm } from 'react-hook-form'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ConfirmationModal } from '@/components/shared/confirmation-modal';
import { ROUTES } from '@/app/routes'
  
import { postNewThesis } from '@/app/services/thesis.service'
import { getPeriods } from '@/app/services/period.service'
import SpinnerPage from '@/components/shared/spinner-page'
import ErrorPage from '@/components/shared/error-page'
import { useQuery } from '@tanstack/react-query'

/**
 * @file ThesisForm.tsx
 * @description This file defines the form component used by professors to create and publish a new postgraduate thesis project.
 * It includes fields such as title, description, number of students, category, investigation subarea (tags), and academic period.
 * Form validation is handled using `zod` and `react-hook-form`.
 * On submission, the data is sent to the backend via `postNewThesis` service.
 * 
 * @version 1.0
 */


const thesisSchema = z.object({
  title: z.string().min(5, "El título debe tener al menos 5 caracteres"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  students: z.number().min(1, "Debe haber al menos 1 estudiante"),
  category: z.string(),
  startPeriod: z.string(),
  subareaId: z.string().optional()
})
export default function ThesisForm() {
  const { user } = useAuth();
  const form = useForm<z.infer<typeof thesisSchema>>({
    resolver: zodResolver(thesisSchema),
    defaultValues: {
      title: "",
      description: "",
      students: 3,
      category: "",
      startPeriod: "202510",
      subareaId: "",
    },
  });

  const {
    data: periods,
    isFetching: periodsIsFetching,
    error: periodsError,
  } = useQuery({
    queryKey: ["periods"],
    queryFn: async () => getPeriods()
  });

  const {
    data: subareas,
    isFetching: subareasIsFetching,
    error: subareasError,
  } = useQuery({
    queryKey: ["subareas"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subareas`)
      if (!res.ok) throw new Error('Error fetching subareas')
      return res.json()
    }
  })


  const dialogText = {
    title: "Publicar Proyecto",
    description: "¿Estás seguro de que deseas publicar este proyecto?",
    buttonText: "Publicar Proyecto",
    successTitle: "Proyecto Publicado",
    successText: "Tu proyecto ha sido publicado exitosamente",
    url: `${ROUTES.HOME}/${ROUTES.PROFESSOR_POSTGRADUATE_THESIS_LIST}`
  }

  async function onSubmit(values: z.infer<typeof thesisSchema>) {
    try {
      if (!user?.id) {
        throw new Error("User ID not found");
      }

      /* Transform form values to match API  */
      const thesisData = {
        title: values.title,
        description: values.description,
        maxStudents: values.students,
        category: values.category,
        investigationSubarea: (() => {
          const found = (subareas ?? []).find((s: any) => String(s.id) === String(values.subareaId))
          return found ? found.name : ""
        })(),
        isEnded: false
      };

      // Send the data to the API with the user ID and period like: 202510
      await postNewThesis(
        user.id,
        thesisData,
        values.startPeriod.replace("-", "")
      );

    } catch (error) {
      console.error("Error submitting thesis:", error);
    }
  }

  const [isModalOpen, setIsModalOpen] = useState(false)
  if (periodsIsFetching || subareasIsFetching) return <SpinnerPage />
  if (periodsError || subareasError) return <ErrorPage />

  return (
    <div className="min-h-full mx-auto p-4 container max-w-3xl">
      <div className="w-full bg-card shadow-xl rounded-2xl p-8 space-y-2 border border-gray-100">


        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-core-highlight">Nuevo Tema de Tesis</h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title Field */}
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold">Título del Proyecto</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Ej: Desarrollo de un producto de datos para..."
                          className="focus:ring-2 focus:ring-core border-gray-300 rounded-lg text-primary"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Description Field */}
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold">Descripción Detallada</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Describe los objetivos, metodología y alcance del proyecto..."
                          className="min-h-[100px] focus:ring-2 focus:ring-core border-gray-300 rounded-lg text-primary"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Students Field */}
              <FormField
                control={form.control}
                name="students"
                render={({ field }) => (
                  <FormItem className='text-primary'>
                    <FormLabel className="font-semibold">Número de Estudiantes</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="1"
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        className="w-24 focus:ring-2 focus:ring-core border-gray-300 rounded-lg text-primary"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              {/* Category Field */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className='text-primary'>
                    <FormLabel className="font-semibold">Categoría</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="focus:ring-2 focus:ring-core border-gray-300 rounded-lg">
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="desarrollo" className="hover:bg-core-soft">Proyecto aplicado a empresas</SelectItem>
                        <SelectItem value="investigacion" className="hover:bg-core-soft">Investigación</SelectItem>
                        <SelectItem value="analisis" className="hover:bg-core-soft">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              {/* Subarea Field */}
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="subareaId"
                  render={({ field }) => (
                    <FormItem className='text-primary'>
                      <FormLabel className="font-semibold">Subárea de investigación</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="focus:ring-2 focus:ring-core border-gray-300 rounded-lg">
                            <SelectValue placeholder="Selecciona una subárea (opcional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          { (subareas ?? []).map((s: any) => (
                            <SelectItem value={String(s.id)} key={s.id} className="hover:bg-core-soft">{s.name}</SelectItem>
                          )) }
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Tags field removed */}

              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="startPeriod"
                  render={({ field }) => (
                    <FormItem className='text-primary'>
                      <FormLabel className="font-semibold">Periodo de inicio</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="focus:ring-2 focus:ring-core border-gray-300 rounded-lg">
                            <SelectValue placeholder="Selecciona un periodo de inicio" />
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
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-center mt-5">
              <Button
                type="button"
                onClick={async () => {
                  const isValid = await form.trigger()
                  if (isValid) {
                    setIsModalOpen(true)
                  }
                }}
                className="bg-core text-white hover:bg-core-dark"
              >
                Publicar Proyecto
              </Button>
              <ConfirmationModal dialogText={dialogText} onConfirm={async () => { await form.handleSubmit(onSubmit)(); }} open={isModalOpen} setIsOpen={setIsModalOpen} />
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}