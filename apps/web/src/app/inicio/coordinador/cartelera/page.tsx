"use client"
import React, { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { UploadFiles } from "../../../../components/shared/upload-files"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Download, Search } from "lucide-react"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Course } from "@/app/types/billboard.type"
import { createBillboard, getBillboard } from "@/app/services/billboard.service"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Period } from "@/app/types/period.type"
import { getPeriodsWMap } from "@/app/services/period.service"
import { mapPeriodToString } from "@/app/mappers/period.mapper"

/**
 * Main component that renders the board upload and listing.
 * The grid is divided into three rows:
 * 1. Two cards for selecting the academic period and downloading templates.
 * 2. A file upload area.
 * 3. The loaded board table with accordion functionality.
 */
export default function UploadBillboard() {
  const headers = ["NRC", "code", "name", "departament", "credits", "section", "period", "professors"]
  const [csvData, setCsvData] = useState<any[]>([])
  const [coursesData, setCoursesData] = useState<Course[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState<string | undefined>()
  const [periods, setPeriods] = useState<string[]>([])

  useEffect(() => {
    getPeriodsWMap()
      .then((data) => {
        setPeriods(data.map(mapPeriodToString))
      })
      .catch((error) => {
        console.error("Error fetching periods:", error)
      })
  }, [])

  const convertToCSV = (headers: string[], data: any[]) => {
    const csv = [headers.join(",")]
    data.slice(0, 3).forEach((row) => {
      const rowData = headers.map((header) => row[header] || "")
      csv.push(rowData.join(","))
    })
    return csv.join("\n")
  }

  const csvContent = useMemo(() => convertToCSV(headers, csvData), [csvData])

  const handleDownload = () => {
    const encodedUri = encodeURI(`data:text/csv;charset=utf-8,${csvContent}`)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "plantilla.csv")
    link.style.display = "none"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleUploadCsv = (data: any) => {
    setCsvData(data)
    createBillboard(data)
  }

  const handlePeriodChange = (value: string) => {
    setSelectedPeriod(value)
    getBillboard(value)
      .then((data) => {
        setCoursesData(data.courses)
      })
  }
  return (
    <div className="grid grid-rows-3 w-full h-full gap-4 p-4">
      <div className="grid grid-cols-2 row-span-1 gap-4 h-4">
        <Card className="border-none">
          <CardHeader>
            <CardTitle className="text-[var(--core)]">Periodo académico</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Select onValueChange={handlePeriodChange} defaultValue="Selecciona un periodo">
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una clasificación" />
              </SelectTrigger>
              <SelectContent>
                {periods.map((period, idx) => (
                  <SelectItem key={`${period}-${idx}`} value={`${period}`}>
                    {`${period}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
          <CardFooter>Selecciona el periodo para ver la cartelera</CardFooter>
        </Card>
        {/* Templates Card */}
        <Card className="border-none">
          <CardHeader>
            <CardTitle className="text-[var(--core)]">Plantillas</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button
              onClick={handleDownload}
              className="bg-[var(--core)] text-[var(--card)] hover:bg-[var(--core)]"
            >
              <Download />
              Descargar plantilla
            </Button>
          </CardContent>
          <CardFooter>Descarga la plantilla de cartelera</CardFooter>
        </Card>
      </div>


      <div className="row-span-3">
        <UploadFiles title="Cargar cartelera" onFileProcessed={handleUploadCsv}   />
      </div>

      <div className="row-span-3">
        <UploadedBillboard classesData={coursesData} />
      </div>
    </div>
  )
}

/**
 * UploadedBillboard Component

 *
 * Renders a table that displays the loaded board data using a Card container.
 * Implements an accordion-style layout for expanding class details.
 * The component uses global CSS variables for colors:
 *  - `var(--core)` for backgrounds (e.g., header)
 *  - `var(--card)` for text on dark backgrounds.
 */
export function UploadedBillboard({
  classesData = [] as Course[],
}: {
  classesData: Course[]
}) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortDesc, setSortDesc] = useState(false)
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({})
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10
  const toggleRow = (idx: number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }))
  }

  const filteredClasses = useMemo(() => {
    if (!Array.isArray(classesData)) return []
    let result = classesData.filter((c) => {
      const lowerSearch = searchTerm.toLowerCase()
      const matchClassName = c.name.toLowerCase().includes(lowerSearch)
      const matchCode = c.code.toLowerCase().includes(lowerSearch)
      return matchClassName || matchCode
    })

    result = result.sort((a, b) => {
      if (a.name < b.name) return sortDesc ? 1 : -1
      if (a.name > b.name) return sortDesc ? -1 : 1
      return 0
    })
    return result
  }, [searchTerm, sortDesc, classesData])

  const totalPages = Math.ceil(filteredClasses.length / rowsPerPage)
  const displayedClasses = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage
    return filteredClasses.slice(startIndex, startIndex + rowsPerPage)
  }, [filteredClasses, currentPage, rowsPerPage])

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, sortDesc])

  return (
    <div className="min-h-full min-w-full">
      <div className="bg-card rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-primary text-center">Loaded Board</h2>
        <div className="flex items-center gap-2 mb-6 justify-center">
          <div className="relative w-[300px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-primary" />
            <input
              type="text"
              className="pl-9 pr-4 py-2 border rounded focus:outline-none text-primary w-full text-center"
              placeholder="Search for a class or professor"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => setSortDesc(!sortDesc)} className="bg-[var(--core)] text-[var(--card)] hover:bg-[var(--core)]">
            {sortDesc ? "Z - A" : "A - Z"}
          </Button>
        </div>

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
              {displayedClasses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-primary">
                    No results found.
                  </TableCell>
                </TableRow>
              ) : (
                displayedClasses.map((clase, idx) => (
                  <React.Fragment key={idx}>
                    <TableRow
                      className={`border-b border-gray-200 cursor-pointer ${expandedRows[idx] ? "text-primary" : ""}`}
                      onClick={() => toggleRow(idx)}
                    >
                      {/* Celdas centradas en el body */}
                      <TableCell className="py-3 p-2 font-semibold text-primary">{clase.name}</TableCell>
                      <TableCell className="py-3 p-2 text-primary">{clase.code}</TableCell>
                      <TableCell className="py-3 p-2 text-primary">{clase.sections.length}</TableCell>
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
                    {expandedRows[idx] && (
                      <TableRow className="text-primary">
                        <TableCell colSpan={5} className="p-0">
                          <div className="p-4">
                            <Table className="w-full table-fixed">
                              <TableHeader className="text-primary">
                                <TableRow>
                                  {/* En la tabla interna también removemos el centramiento en los headers */}
                                  <TableHead className="py-2 text-primary font-semibold">Profesores</TableHead>
                                  <TableHead className="py-2 text-primary font-semibold">Section</TableHead>
                                  <TableHead className="py-2 text-primary font-semibold">NRC</TableHead>
                                  <TableHead className="py-2 text-primary font-semibold">Ciclo</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {clase.sections.length > 0 ? (
                                  clase.sections.map((section, pidx) => (
                                    <TableRow key={`${idx}-${pidx}`} className="border-b border-gray-200">
                                      {/* Celdas de la tabla interna centradas */}
                                      <TableCell className="py-2 text-primary">
                                        {section.professors.length > 0
                                          ? section.professors.map((prof) => prof.user.name).join(", ")
                                          : "No professors assigned"}
                                      </TableCell>
                                      <TableCell className="py-2 text-primary">{section.section}</TableCell>
                                      <TableCell className="py-2 text-primary">{section.NRC}</TableCell>
                                      <TableCell className="py-2 text-primary">{section.period.period}</TableCell>
                                    </TableRow>
                                  ))
                                ) : (
                                  <TableRow>
                                    <TableCell colSpan={4} className= "py-2 text-primary">
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
          <Button size="sm" onClick={handlePrevPage} disabled={currentPage === 1}>Previo</Button>
          <span className="self-center text-primary">
            Página {currentPage} de {totalPages}
          </span>
          <Button size="sm" onClick={handleNextPage} disabled={currentPage === totalPages || totalPages === 0}>Siguiente</Button>
        </div>
      </div>
    </div>
  )
}
