"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SpinnerPage from "./shared/spinner-page"
import { DateTable } from "./shared/date-table"
import { findByAcademicProcessAndPeriod, updateImportantDate } from "@/app/services/dates.service"




export default function ImportantDatesManager({ selectedPeriod }: { selectedPeriod: string }) {
  const queryClient = useQueryClient()

  

  const {
    data: pregradoSections,
    isFetching: isFetchingPregrado,
    error: pregradoError,
  } = useQuery({
    queryKey: ["student-dates", "PREGRADO", selectedPeriod],
    queryFn: () => findByAcademicProcessAndPeriod("Tesis pregrado",selectedPeriod),
  })

  const {
    data: posgradoSections,
    isFetching: isFetchingPosgrado,
    error: posgradoError,
  } = useQuery({
    queryKey: ["student-dates", "POSGRADO", selectedPeriod],
    queryFn: () => findByAcademicProcessAndPeriod("Tesis postgrado"),
  })

  const updateMutation = useMutation({
    mutationFn: ({
      dateId,
      data,
    }: {
      dateId: string
      data: { importantSectionId: string; name: string; date: string }
    }) => updateImportantDate(dateId, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["student-dates", "PREGRADO"] })
      await queryClient.invalidateQueries({ queryKey: ["student-dates", "POSGRADO"] })
     
    },
    onError: () => {
      
    },
  })

  const handleUpdateDate = async (dateId: string, data: { importantSectionId: string; name: string; date: string }) => {
    await updateMutation.mutateAsync({ dateId, data })
  }

  if (isFetchingPregrado || isFetchingPosgrado) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <SpinnerPage  />
      </div>
    )
  }

  if (pregradoError || posgradoError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-destructive">No se pudieron cargar las fechas importantes</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-6xl p-4">
      <div className="space-y-6 rounded-xl bg-card p-6 shadow-lg">
        <div>
          <h1 className="text-balance text-2xl font-bold text-foreground">Fechas Importantes</h1>
          <p className="text-pretty text-muted-foreground mt-1">
            Gestiona las fechas importantes del proceso de proyecto de grado para pregrado y posgrado.
          </p>
        </div>

        <Tabs defaultValue="pregrado" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pregrado">Tesis Pregrado</TabsTrigger>
            <TabsTrigger value="posgrado">Tesis Posgrado</TabsTrigger>
          </TabsList>

          <TabsContent value="pregrado" className="space-y-4 mt-6">
            {(
              pregradoSections?.map((section) => (
                <DateTable
                  key={section.id}
                  sectionId={section.id}
                  title={section.name}
                  dates={section.importantDates}
                  onUpdateDate={handleUpdateDate}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="posgrado" className="space-y-4 mt-6">
            {posgradoSections?.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No se han definido fechas para Tesis Posgrado</p>
            ) : (
              posgradoSections?.map((section) => (
                <DateTable
                  key={section.id}
                  sectionId={section.id}
                  title={section.name}
                  dates={section.importantDates}
                  onUpdateDate={handleUpdateDate}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
