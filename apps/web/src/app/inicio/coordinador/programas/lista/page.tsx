"use client"

import React, { useState, useMemo, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { useProgramsStore } from "./store"
import { Course } from "@/app/types/entities/billboard.type"
import { getBillboard } from "@/app/services/billboard.service"
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
 * Features:
 * - Period selection dropdown
 * - Search input with real-time filtering
 * - Sort toggle (A-Z / Z-A)
 * - Navigation to course details
 *
 * @returns {JSX.Element} Main UI container with search, filter, and DataTable
 */
export default function ProgramsList() {
  const router = useRouter()
  const period = useProgramsStore((state) => state.period)
  const setPeriod = useProgramsStore((state) => state.setPeriod)
  const setIds = useProgramsStore((state) => state.setIds)

  const [periods, setPeriods] = useState<string[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [search, setSearch] = useState("")
  const [sortDesc, setSortDesc] = useState(false)
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
      setPeriods(fetchedPeriods.map(mapPeriodToString))
    }
  }, [fetchedPeriods])

  // Fetch courses when a period is selected
  useEffect(() => {
    if (!period) return
    getBillboard(period)
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

  // Filter and sort courses based on search term
  const filteredCourses = useMemo(() => {
    const term = search.toLowerCase()
    return [...courses]
      .filter((c) => c.name.toLowerCase().includes(term) || c.code.toLowerCase().includes(term))
      .sort((a, b) => {
        if (a.name < b.name) return sortDesc ? 1 : -1
        if (a.name > b.name) return sortDesc ? -1 : 1
        return 0
      })
  }, [courses, search, sortDesc])

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
          <CardTitle className="text-center">Listado de Programas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filter controls */}
          <div className="flex flex-wrap justify-center items-center gap-4">
            {/* Search input */}
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-primary" />
              <input
                type="text"
                className="pl-9 pr-4 py-2 border rounded focus:outline-none text-primary w-full text-center"
                placeholder="Buscar clase o código"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Period selector */}
            <div className="relative w-64">
              <Select onValueChange={setPeriod} value={period}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona periodo" />
                </SelectTrigger>
                <SelectContent>
                  {periods.map((p, i) => (
                    <SelectItem key={i} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort toggle */}
            <Button
              onClick={() => setSortDesc(!sortDesc)}
              className="bg-core text-card hover:bg-core"
            >
              {sortDesc ? "Z - A" : "A - Z"}
            </Button>
          </div>

          {/* Render filtered courses in the reusable DataTable */}
          <DataTable columns={getProgramColumns(handleDetail)} data={filteredCourses} />
        </CardContent>
        <CardFooter className="justify-center text-sm text-muted-foreground">
          {filteredCourses.length === 0 && "No se encontraron resultados para este periodo."}
        </CardFooter>
      </Card>

      {/* Error alert modal */}
      <AlertDialogError onOpenChange={setLoadError} open={loadError} />
    </div>
  )
}
