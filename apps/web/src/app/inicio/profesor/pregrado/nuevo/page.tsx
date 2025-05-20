/**
 * @module ThesisForm
 * @description
 * Formulario para que el profesor registre un nuevo proyecto de tesis de pregrado.
 * Permite ingresar título, descripción, número máximo de estudiantes, categoría, etiquetas y período.
 * Al enviarlo, se guarda en el backend asociado al ID del profesor autenticado.
 *
 * @returns {JSX.Element} El formulario renderizado para crear un nuevo proyecto de tesis.
 *
 * @remarks
 * Este formulario utiliza `react-hook-form` y validación con Zod. Incluye un modal de confirmación antes de guardar.
 * El ID del usuario se obtiene con `getUserInfo` y se usa para asociar el proyecto al profesor.
 *
 * @see {@link createUndergraduateProject} para registrar el proyecto
 * @see {@link getUserInfo} para obtener el ID del usuario autenticado
 */
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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ConfirmationModal } from '@/components/shared/confirmation-modal';
import { ROUTES } from '@/app/routes'
import { useEffect, useState } from 'react'
import { CategoryTag } from '@/components/shared/category-tag'
import { createProject } from '@/app/types/entities/project.type'
import { createUndergraduateProject } from '@/app/services/professor.service'
import { getUserInfo } from '@/app/auth/auth-service'


const thesisSchema = z.object({
  title: z.string().min(5, "El título debe tener al menos 5 caracteres"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  students: z.number().min(1, "Debe haber al menos 1 estudiante"),
  category: z.string(),
  tags: z.array(z.string()).min(1, "Debe agregar al menos un tag"),
  lastPeriod: z.string()
})

export default function ThesisForm() {
  const form = useForm<z.infer<typeof thesisSchema>>({
    resolver: zodResolver(thesisSchema),
    defaultValues: {
      title: "",
      description: "",
      students: 3,
      category: "",
      tags: [],
      lastPeriod: "2025-10",
    },
  })


  const dialogText = {
    title: "Publicar Proyecto",
    description: "¿Estás seguro de que deseas publicar este proyecto?",
    buttonText: "Publicar Proyecto",
    successTitle: "Proyecto Publicado",
    successText: "Tu proyecto ha sido publicado exitosamente",
    url: `${ROUTES.HOME}/${ROUTES.PROFESSOR_UNDERGRADUATE_THESIS_LIST}`
  }

  async function onSubmit(values: z.infer<typeof thesisSchema>) {
    let bodyProject: createProject = {
      title: values.title,
      description: values.description,
      maxStudents: values.students,
      category: values.category,
      areasOfInterest: values.tags,
      period: values.lastPeriod
    };

    let userId ="";

    await getUserInfo().then((data)=>{
      userId = data.user?.id;
    })

    createUndergraduateProject(bodyProject, userId);
    
  }

  const [isModalOpen, setIsModalOpen] = useState(false)

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

              {/* Tags Field */}
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem className='text-primary'>
                      <FormLabel className="font-semibold">Etiquetas</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Select
                            value=""
                            onValueChange={(value) => {
                              if (value && !field.value.includes(value)) {
                                field.onChange([...field.value, value])
                              }
                            }}
                          >
                            <SelectTrigger className="focus:ring-2 focus:ring-core border-gray-300 rounded-lg">
                              <SelectValue placeholder="Agregar etiqueta..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Inteligencia artificial">Inteligencia artificial</SelectItem>
                              <SelectItem value="Bases de datos">Bases de datos</SelectItem>
                              <SelectItem value="Desarrollo web">Desarrollo web</SelectItem>
                              <SelectItem value="Ciberseguridad">Ciberseguridad</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {field.value.map((tag) => (
                              <CategoryTag 
                                key={tag}
                                tag={tag}
                                onClic={() => {
                                  field.onChange(field.value.filter((t) => t !== tag))
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Last Period Field */}
              <FormField
                control={form.control}
                name="lastPeriod"
                render={({ field }) => (
                  <FormItem className='text-primary'>
                    <FormLabel className="font-semibold">Último Periodo</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="focus:ring-2 focus:ring-core border-gray-300 rounded-lg">
                          <SelectValue placeholder="Selecciona un periodo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="202510">2025-10</SelectItem>
                        <SelectItem value="202520">2025-20</SelectItem>
                        <SelectItem value="202610">2026-10</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
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
              <ConfirmationModal dialogText={dialogText} onConfirm={form.handleSubmit(onSubmit)} open={isModalOpen} setIsOpen={setIsModalOpen} />
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}