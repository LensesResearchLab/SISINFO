"use client"

import React, { useState, useMemo, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, MoreHorizontal } from "lucide-react"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { useProgramsStore } from "./store"
import { Course } from "@/app/types/billboard.type"
import { getBillboard } from "@/app/services/billboard.service"
import { getPeriodsWMap } from "@/app/services/period.service"
import { mapPeriodToString } from "@/app/mappers/period.mapper"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"

export default function ProgramsList() {
  const router = useRouter()
  const { period, setPeriod, ids, setIds } = useProgramsStore()
  const [periods, setPeriods] = useState<string[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [search, setSearch] = useState("")
  const [sortDesc, setSortDesc] = useState(false)
  const [expanded, setExpanded] = useState<Record<number, boolean>>({})
  const [page, setPage] = useState(1)
  const perPage = 10

  const { data: fetchedPeriods } = useQuery({
    queryKey: ["periods"],
    queryFn: getPeriodsWMap,
    staleTime: 1000 * 60 * 5,
  })

  useEffect(() => {
    if (fetchedPeriods) {
      setPeriods(fetchedPeriods.map(mapPeriodToString))
    }
  }, [fetchedPeriods])

  useEffect(() => {
    if (!period) return
    getBillboard(period)
      .then(data => {
        setCourses(data.courses)
        setIds(data.courses.map((c: { id: string }) => c.id))
        setPage(1)
      })
      .catch(console.error)
  }, [period, setIds])

  const filtered = useMemo(() => {
    const term = search.toLowerCase()
    return courses
      .filter(c => c.name.toLowerCase().includes(term) || c.code.toLowerCase().includes(term))
      .sort((a, b) => {
        if (a.name < b.name) return sortDesc ? 1 : -1
        if (a.name > b.name) return sortDesc ? -1 : 1
        return 0
      })
  }, [courses, search, sortDesc])

  const totalPages = Math.ceil(filtered.length / perPage)
  const visible = useMemo(() => {
    const start = (page - 1) * perPage
    return filtered.slice(start, start + perPage)
  }, [filtered, page])

  const toggle = (i: number) => setExpanded(prev => ({ ...prev, [i]: !prev[i] }))
  const handleDetail = (id: string) =>{ 
    const currentPath=window.location.pathname;
    router.push(`${currentPath}/${id}`)}

  return (
    <div className="min-w-full mx-auto p-4">
      <Card className="bg-card border-none">
        <CardHeader>
          <CardTitle className="text-center">Listado de Programas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap justify-center items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-primary" />
              <input
                type="text"
                className="pl-9 pr-4 py-2 border rounded focus:outline-none text-primary w-full text-center"
                placeholder="Buscar clase o código"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="relative w-64">
              <Select onValueChange={setPeriod} value={period}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona periodo" />
                </SelectTrigger>
                <SelectContent>
                  {periods.map((p, i) => <SelectItem key={i} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setSortDesc(!sortDesc)} className="bg-[var(--core)] text-[var(--card)] hover:bg-[var(--core)]">
              {sortDesc ? "Z - A" : "A - Z"}
            </Button>
          </div>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader className="bg-[var(--core)]">
                <TableRow>
                  <TableHead className="text-[var(--card)] py-2 px-3">Clase</TableHead>
                  <TableHead className="text-[var(--card)] py-2 px-3">Código</TableHead>
                  <TableHead className="text-[var(--card)] py-2 px-3">Estado</TableHead>
                  <TableHead className="text-[var(--card)] py-2 px-3">Profesor</TableHead>
                  <TableHead className="text-[var(--card)] py-2 px-3">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((c, idx) => (
                  <React.Fragment key={c.id}>
                    <TableRow className="border-b cursor-pointer" onClick={() => toggle(idx)}>
                      <TableCell className="py-2 px-3 font-semibold text-primary">{c.name}</TableCell>
                      <TableCell className="py-2 px-3 text-primary">{c.code}</TableCell>
                      <TableCell className="py-2 px-3 text-primary">{c.program ? 'Cargado' : 'Pendiente'}</TableCell>
                      <TableCell className="py-2 px-3 text-primary">{c.mainProfessor.user.name!=null ? c.mainProfessor.user.name : "No professor asigned"}</TableCell>
                      <TableCell className="py-2 px-3">
                        <Button variant="ghost" size="icon" onClick={e => { e.stopPropagation(); handleDetail(c.id); }}>
                          <MoreHorizontal className="w-4 h-4 text-primary" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button size="sm" onClick={() => setPage(p => Math.max(p-1,1))} disabled={page===1}>Anterior</Button>
          <span className="self-center">Página {page} de {totalPages}</span>
          <Button size="sm" onClick={() => setPage(p => Math.min(p+1,totalPages))} disabled={page===totalPages}>Siguiente</Button>
        </CardFooter>
      </Card>
    </div>
  )
}