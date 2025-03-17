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
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { ConfirmationModal } from '@/components/shared/confirmation-modal';
import { ROUTES } from '@/app/routes'
import { useState } from 'react'


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

  function onSubmit(values: z.infer<typeof thesisSchema>) {
    alert(JSON.stringify(values, null, 2))
  }

  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="min-h-full mx-auto p-4 container max-w-3xl">
      <div className="w-full bg-white shadow-xl rounded-2xl p-8 space-y-2 border border-gray-100">


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
                      <FormLabel className="text-gray-700 font-semibold">Título del Proyecto</FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          placeholder="Ej: Desarrollo de un producto de datos para..."
                          className="focus:ring-2 focus:ring-core border-gray-300 rounded-lg"
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
                      <FormLabel className="text-gray-700 font-semibold">Descripción Detallada</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Describe los objetivos, metodología y alcance del proyecto..."
                          className="min-h-[100px] focus:ring-2 focus:ring-core border-gray-300 rounded-lg"
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
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold">Número de Estudiantes</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="1"
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        className="w-24 focus:ring-2 focus:ring-core border-gray-300 rounded-lg"
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
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold">Categoría</FormLabel>
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
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold">Etiquetas</FormLabel>
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
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="bg-core-soft text-core hover:text-white hover:bg-core px-3 py-1 rounded-full transition-colors"
                              >
                                {tag}
                                <button
                                  type="button"
                                  onClick={() => field.onChange(field.value.filter(t => t !== tag))}
                                  className="ml-1 hover:text-core-highlight"
                                >
                                  <X size={14} className="inline-block" />
                                </button>
                              </Badge>
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
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold">Último Periodo</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="focus:ring-2 focus:ring-core border-gray-300 rounded-lg">
                          <SelectValue placeholder="Selecciona un periodo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="2025-10">2025-10</SelectItem>
                        <SelectItem value="2025-20">2025-20</SelectItem>
                        <SelectItem value="2026-10">2026-10</SelectItem>
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