"use client"

import { useForm, FormProvider } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"

import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import SpinnerPage from "@/components/shared/spinner-page"
import ErrorPage from "@/components/shared/error-page"
import { ConfirmationModal } from "@/components/shared/confirmation-modal"

import { TitleField } from "@/components/form-fields/TitleField"
import { DescriptionField } from "@/components/form-fields/DescriptionField"
import { StudentsField } from "@/components/form-fields/StudentsField"
import { CategoryField } from "@/components/form-fields/CategoryField"
import { TagsField } from "@/components/form-fields/TagsField"
import { LastPeriodField } from "@/components/form-fields/LastPeriodField"

import { ROUTES } from "@/app/routes"
import { getPeriods } from "@/app/services/period.service"
import { createUndergraduateProject } from "@/app/services/professor.service"
import { CreateProject } from "@/app/types/entities/project.type"

const thesisSchema = z.object({
  title: z.string().min(5, "El título debe tener al menos 5 caracteres"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  students: z.number().min(1, "Debe haber al menos 1 estudiante"),
  category: z.string(),
  tags: z.array(z.string()).min(1, "Debe agregar al menos un tag"),
  lastPeriod: z.string(),
})

export default function ProjectsForm() {
  const form = useForm<z.infer<typeof thesisSchema>>({
    resolver: zodResolver(thesisSchema),
    defaultValues: {
      title: "",
      description: "",
      students: 3,
      category: "",
      tags: [],
      lastPeriod: "202510",
    },
  })

  const dialogText = {
    title: "Publicar Proyecto",
    description: "¿Estás seguro de que deseas publicar este proyecto?",
    buttonText: "Publicar Proyecto",
    successTitle: "Proyecto Publicado",
    successText: "Tu proyecto ha sido publicado exitosamente",
    url: `${ROUTES.HOME}/${ROUTES.PROFESSOR_UNDERGRADUATE_THESIS_LIST}`,
  }

  async function onSubmit(values: z.infer<typeof thesisSchema>) {
    const bodyProject: CreateProject = {
      title: values.title,
      description: values.description,
      maxStudents: values.students,
      category: values.category,
      areasOfInterest: values.tags,
      period: values.lastPeriod,
    }
    createUndergraduateProject(bodyProject)
  }

  const { data: periods, isFetching, error } = useQuery({
    queryKey: ["periods"],
    queryFn: () => getPeriods(),
  })

  const [isModalOpen, setIsModalOpen] = useState(false)

  if (isFetching) return <SpinnerPage />
  if (error) return <ErrorPage />

  return (
    <div className="min-h-full mx-auto p-4 container max-w-3xl">
      <div className="w-full bg-card shadow-xl rounded-2xl p-8 space-y-2 border border-gray-100">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-core-highlight">
            Nuevo tema de proyecto de grado
          </h1>
        </div>

        <FormProvider {...form}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <TitleField />
                </div>
                <div className="md:col-span-2">
                  <DescriptionField />
                </div>
                <StudentsField />
                <CategoryField />
                <div className="md:col-span-2">
                  <TagsField />
                </div>
                <LastPeriodField periods={periods ?? []} />
              </div>

              <div className="flex justify-center mt-5">
                <Button
                  type="button"
                  onClick={async () => {
                    const isValid = await form.trigger()
                    if (isValid) setIsModalOpen(true)
                  }}
                  className="bg-core text-white hover:bg-core-dark"
                >
                  Publicar Proyecto
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
        </FormProvider>
      </div>
    </div>
  )
}
