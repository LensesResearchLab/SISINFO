"use client"

import React, { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { UploadFiles } from "../../../../components/shared/upload-files" // Ensure UploadFiles supports 'title' prop
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Download, Search } from "lucide-react"
import { DatePicker } from "@/components/shared/datepicker"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"

/**
 * Data structure for each class.
 * Each class includes an array of professors to demonstrate nested rows.
 */
interface ClassData {
  name: string // Class name (e.g., "Móviles")
  code: string // Class code (e.g., "ISIS2510")
  sections: number // Number of sections available
  credits: number // Number of credits
  professors: {
    name: string // Professor's name
    nrc: string // NRC or section identifier
    cycle: string // Cycle or duration (e.g., "16 weeks")
    section:string
  }[]
}

/** Example data for demonstration */
const classesData: ClassData[] = [
  {
    name: "Móviles",
    code: "ISIS2510",
    sections: 3,
    credits: 4,
    professors: [
      { name: "Camilo Escobar Velásquez", nrc: "213213", cycle: "16 weeks", section:"3" },
      { name: "Mario Linares", nrc: "213219", cycle: "16 weeks", section:"2" },
    ],
  },
  {
    name: "Web",
    code: "ISIS3510",
    sections: 2,
    credits: 3,
    professors: [{ name: "Juan Pérez", nrc: "213220", cycle: "16 weeks", section:"2" }],
  },
  {
    name: "Arquitectura de Software",
    code: "ISIS4010",
    sections: 4,
    credits: 3,
    professors: [
      { name: "Ana Gómez", nrc: "213221", cycle: "16 weeks", section:"3" },
      { name: "Carlos Rodríguez", nrc: "213222", cycle: "16 weeks", section:"4" },
      { name: "Laura Martínez", nrc: "213223", cycle: "16 weeks", section:"1" },
    ],
  },
]

/**
 * Main component that renders the board upload and listing.
 * The grid is divided into three rows:
 * 1. Two cards for selecting the academic period and downloading templates.
 * 2. A file upload area.
 * 3. The loaded board table with accordion functionality.
 */
export default function UploadBillboard() {
  return (
    <div className="grid grid-rows-3 w-full h-full gap-4 p-4">
      {/* Row 1: Cards for Academic Period and Templates */}
      <div className="grid grid-cols-2 row-span-1 gap-4 h-4">
        {/* Academic Period Card */}
        <Card className="border-none">
          <CardHeader>
            <CardTitle className="text-[var(--core)]">Periodo académico</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <DatePicker />
          </CardContent>
          <CardFooter>Selecciona el periodo para ver/cargar la cartelera</CardFooter>
        </Card>
        {/* Templates Card */}
        <Card className="border-none">
          <CardHeader>
            <CardTitle className="text-[var(--core)]">Plantillas</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button>
              <Download />
            </Button>
          </CardContent>
          <CardFooter>Descarga la plantilla de cartelera</CardFooter>
        </Card>
      </div>
      {/* Row 2: File Upload */}
      <div className="row-span-3">
        <UploadFiles title="Cargar cartelera" />
      </div>
      {/* Row 3: Loaded Board Table with Accordion */}
      <div className="row-span-3">
        <UploadedBillboard />
      </div>
    </div>
  )
}

/**
 * CarteleraCargada Component
 *
 * Renders a table that displays the loaded board data using a Card container.
 * Implements an accordion-style layout for expanding class details.
 * The component uses global CSS variables for colors:
 *  - `var(--core)` for backgrounds (e.g., header)
 *  - `var(--card)` for text on dark backgrounds.
 */
export function UploadedBillboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortDesc, setSortDesc] = useState(false)
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({})

  // Toggle row expansion
  const toggleRow = (idx: number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }))
  }

  // Filter and sort class data based on search term and sort order.
  const filteredClasses = useMemo(() => {
    let result = classesData.filter((c) => {
      const lowerSearch = searchTerm.toLowerCase()
      const matchClassName = c.name.toLowerCase().includes(lowerSearch)
      const matchCode = c.code.toLowerCase().includes(lowerSearch)
      const matchProfessor = c.professors.some((p) => p.name.toLowerCase().includes(lowerSearch))
      return matchClassName || matchCode || matchProfessor
    })

    result = result.sort((a, b) => {
      if (a.name < b.name) return sortDesc ? 1 : -1
      if (a.name > b.name) return sortDesc ? -1 : 1
      return 0
    })

    return result
  }, [searchTerm, sortDesc])

  return (
    <div className="min-h-full min-w-full">
      <div className="bg-card rounded-lg shadow-lg p-6">
        {/* Header */}
        <h2 className="text-2xl font-bold mb-4 text-primary">Loaded Board</h2>
        {/* Search bar and sort button */}
        <div className="flex items-center gap-2 mb-6">
          <div className="relative w-[300px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-primary" />
            <input
              type="text"
              className="pl-9 pr-4 py-2 border rounded focus:outline-none text-primary"
              placeholder="Search for a class or professor"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            onClick={() => setSortDesc(!sortDesc)}
            className="bg-[var(--core)] text-[var(--card)] hover:bg-[var(--core)]"
          >
            {sortDesc ? "Z - A" : "A - Z"}
          </Button>
        </div>

        {/* Table with Accordion Style */}
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader className="bg-[var(--core)]">
              <TableRow>
                <TableHead className="text-[var(--card)] font-bold py-3 p-2">Clase</TableHead>
                <TableHead className="text-[var(--card)] font-bold py-3 p-2">Código</TableHead>
                <TableHead className="text-[var(--card)] font-bold py-3 p-2">Secciones</TableHead>
                <TableHead className="text-[var(--card)] font-bold py-3 p-2">Créditos</TableHead>
                <TableHead className="text-[var(--card)] font-bold py-3 p-2">Detalles</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClasses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-primary">
                    No results found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredClasses.map((clase, idx) => (
                  <React.Fragment key={idx}>
                    {/* Main row for each class (clickable to expand) */}
                    <TableRow
                      className={`border-b border-gray-200 ${expandedRows[idx] ? "text-primary" : ""}`}
                      onClick={() => toggleRow(idx)}
                    >
                      <TableCell className="py-3 p-2 font-semibold text-primary cursor-pointer">{clase.name}</TableCell>
                      <TableCell className="py-3 p-2 text-primary">{clase.code}</TableCell>
                      <TableCell className="py-3 p-2 text-primary">{clase.sections}</TableCell>
                      <TableCell className="py-3 p-2 text-primary">{clase.credits}</TableCell>
                      <TableCell className="py-3 p-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleRow(idx)
                          }}
                        >
                          <Search className="w-4 h-4 text-primary" />
                        </Button>
                      </TableCell>
                    </TableRow>

                    {/* Expanded accordion content - only visible when row is expanded */}
                    {expandedRows[idx] && (
                      <TableRow className="text-primary">
                        <TableCell colSpan={5} className="p-0">
                          <div className="p-4">
                            <Table>
                              <TableHeader className="text-primary">
                                <TableRow>
                                  <TableHead className="py-2 text-primary font-semibold">Profesor</TableHead>
                                  <TableHead className="py-2 text-primary font-semibold">NRC</TableHead>
                                  <TableHead className="py-2 text-primary font-semibold">Sección</TableHead>
                                  <TableHead className="py-2 text-primary font-semibold">Ciclo</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {clase.professors.length > 0 ? (
                                  clase.professors.map((prof, pidx) => (
                                    <TableRow key={`${idx}-${pidx}`} className="border-b border-gray-200">
                                      <TableCell className="py-2 text-primary">{prof.name}</TableCell>
                                      <TableCell>{prof.section}</TableCell>
                                      <TableCell className="py-2 text-primary">{prof.nrc}</TableCell>
                                      <TableCell className="py-2 text-primary">{prof.cycle}</TableCell>
                                    </TableRow>
                                  ))
                                ) : (
                                  <TableRow>
                                    <TableCell colSpan={3} className="text-center py-2 text-primary">
                                      Profesores no asignados
                                    </TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button size="sm">Previo</Button>
          <Button size="sm">Siguiente</Button>
        </div>
      </div>
    </div>
  )
}

