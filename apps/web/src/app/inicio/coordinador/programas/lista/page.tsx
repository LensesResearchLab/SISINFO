"use client"

import React, { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useProgramsStore } from "./store"
import { Course } from "@/app/types/entities/billboard.type"
import { getBillboardWithUploadedProgram } from "@/app/services/billboard.service"
import { getPeriodsWMap } from "@/app/services/period.service"
import { mapPeriodToString } from "@/app/mappers/period.mapper"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { AlertDialogError } from "@/components/shared/alert-dialog-error"
import { DataTable } from "@/components/data-table"
import { getProgramColumns } from "./ProgramColumns" // Import custom columns

/**
 * ProgramsList Component
 *
 * Displays a list of courses for the selected academic period.
 * Integrates the reusable DataTable component for filtering, pagination, and sorting.
 * Includes global state for selected period and loaded course IDs.
 *
 * @returns {JSX.Element} Main UI container with DataTable only
 */
export default function ProgramsList() {
  const router = useRouter()
  const period = useProgramsStore((state) => state.period)
  const setPeriod = useProgramsStore((state) => state.setPeriod)
  const setIds = useProgramsStore((state) => state.setIds)

  const [periods, setPeriods] = useState<string[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loadError, setLoadError] = useState(false)

  // Fetch list of periods using React Query
  const { data: fetchedPeriods } = useQuery({
    queryKey: ["periods"],
    queryFn: getPeriodsWMap,
    staleTime: 1000 * 60 * 5,
  })

  // Set periods when they are fetched
  useEffect(() => {
    if (fetchedPeriods) {
      const mappedPeriods = fetchedPeriods.map(mapPeriodToString);
      setPeriods(mappedPeriods);
      
      // Seleccionar automáticamente el último período disponible (el más reciente)
      if (mappedPeriods.length > 0 && !period) {
        const stored = typeof window !== "undefined" ? localStorage.getItem("current_period") : null;
        const lastPeriod = mappedPeriods[mappedPeriods.length - 1];
        if (stored && mappedPeriods.includes(stored)) setPeriod(stored);
        else setPeriod(lastPeriod);
      }
    }
  }, [fetchedPeriods, period, setPeriod])

  // Fetch courses when a period is selected
  useEffect(() => {
    if (!period) return
    getBillboardWithUploadedProgram(period)
      .then((data) => {
        setCourses(data.courses)
        setIds(data.courses.map((c: { id: string }) => c.id))
        setLoadError(false)
      })
      .catch(() => {
        setLoadError(true)
        setCourses([])
        setIds([])
      })
  }, [period, setIds])

  /**
   * Handles routing to the detailed view of a selected course
   *
   * @param {string} id - Course ID
   */
  const handleDetail = (id: string) => {
    const currentPath = window.location.pathname
    router.push(`${currentPath}/${id}`)
  }

  return (
    <div className="min-w-full mx-auto p-4">
      <Card className="bg-card border-none">
        <CardHeader>
          <CardTitle className="text-center text-core">Listado de Programas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
            <div className="w-full sm:w-72">
              <select
                id="period-select"
                value={period ?? ""}
                onChange={(e) => setPeriod(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-core"
              >
                <option value="" disabled>Seleccione un periodo</option>
                {periods.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <DataTable
            columns={getProgramColumns(handleDetail)}
            data={courses}
          />
        </CardContent>
      </Card>

      {/* Error alert modal */}
      <AlertDialogError onOpenChange={setLoadError} open={loadError} />
    </div>
  )
}
