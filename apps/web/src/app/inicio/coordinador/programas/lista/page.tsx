"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useProgramsStore } from "./store"
import { Course } from "@/app/types/entities/billboard.type"
import { getBillboardWithUploadedProgram } from "@/app/services/billboard.service"
import { getCourseWithDocument } from "@/app/services/billboard.service"
import { getPeriodsWMap } from "@/app/services/period.service"
import { mapPeriodToString } from "@/app/mappers/period.mapper"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { AlertDialogError } from "@/components/shared/alert-dialog-error"
import { DataTable } from "@/components/data-table"
import { getProgramColumns } from "./ProgramColumns" // Import custom columns
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"

function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob); const link = document.createElement("a");
  link.href = url; link.download = name; link.click(); URL.revokeObjectURL(url);
}

function crc32(data: Uint8Array) {
  let crc = 0xffffffff;
  for (const byte of data) { crc ^= byte; for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0); }
  return (crc ^ 0xffffffff) >>> 0;
}

async function createZip(files: { name: string; data: Uint8Array }[]) {
  const encoder = new TextEncoder(); const parts: Uint8Array[] = []; const central: Uint8Array[] = []; let offset = 0;
  for (const file of files) {
    const name = encoder.encode(file.name); const header = new ArrayBuffer(30 + name.length); const view = new DataView(header);
    view.setUint32(0, 0x04034b50, true); view.setUint16(4, 20, true); view.setUint16(8, 0, true); view.setUint32(14, crc32(file.data), true); view.setUint32(18, file.data.length, true); view.setUint32(22, file.data.length, true); view.setUint16(26, name.length, true); new Uint8Array(header, 30).set(name);
    const local = new Uint8Array(header); parts.push(local, file.data);
    const entry = new ArrayBuffer(46 + name.length); const ev = new DataView(entry); ev.setUint32(0, 0x02014b50, true); ev.setUint16(4, 20, true); ev.setUint16(6, 20, true); ev.setUint32(16, crc32(file.data), true); ev.setUint32(20, file.data.length, true); ev.setUint32(24, file.data.length, true); ev.setUint16(28, name.length, true); ev.setUint32(42, offset, true); new Uint8Array(entry, 46).set(name); central.push(new Uint8Array(entry)); offset += local.length + file.data.length;
  }
  const centralSize = central.reduce((n, x) => n + x.length, 0); const end = new ArrayBuffer(22); const endView = new DataView(end); endView.setUint32(0, 0x06054b50, true); endView.setUint16(8, files.length, true); endView.setUint16(10, files.length, true); endView.setUint32(12, centralSize, true); endView.setUint32(16, offset, true);
  return new Blob([...parts, ...central, new Uint8Array(end)], { type: "application/zip" });
}

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
  const [program, setProgram] = useState("")
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([])
  const visibleCourses = useMemo(() => program ? courses.filter((course) => String(typeof course.program === "string" ? course.program : (course.program as any)?.name).toUpperCase().includes(program)) : courses, [courses, program])

  const downloadProgram = async (course: Course) => {
    const full = await getCourseWithDocument(course.id) as any;
    const rawFile = full?.program?.file;
    const data = Array.isArray(rawFile?.data) ? rawFile.data : Array.isArray(rawFile) ? rawFile : typeof rawFile === "string" ? Array.from(atob(rawFile), (char) => char.charCodeAt(0)) : undefined;
    if (data) downloadBlob(new Blob([new Uint8Array(data)], { type: "application/pdf" }), `${course.code}.pdf`);
  };
  const downloadSelected = async () => {
    const files = [];
    for (const course of selectedCourses) { const full = await getCourseWithDocument(course.id) as any; const rawFile = full?.program?.file; const data = Array.isArray(rawFile?.data) ? rawFile.data : Array.isArray(rawFile) ? rawFile : typeof rawFile === "string" ? Array.from(atob(rawFile), (char) => char.charCodeAt(0)) : undefined; if (data) files.push({ name: `${course.code}.pdf`, data: new Uint8Array(data) }); }
    if (files.length) downloadBlob(await createZip(files), "listado de programas.zip");
  };

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
          <DataTable
            columns={[
              { id: "select", header: ({ table }: any) => <input type="checkbox" checked={table.getIsAllPageRowsSelected()} onChange={table.getToggleAllPageRowsSelectedHandler()} />, cell: ({ row }: any) => <input type="checkbox" checked={row.getIsSelected()} onChange={row.getToggleSelectedHandler()} />, enableSorting: false },
              ...getProgramColumns(handleDetail, (course) => void downloadProgram(course)),
            ] as ColumnDef<Course>[]}
            data={visibleCourses}
            enableRowSelection
            onSelectedRowsChange={setSelectedCourses}
            toolbar={
              <div className="flex items-center gap-2">
                <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
                  Periodo
                  <select
                    id="period-select"
                    value={period ?? ""}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="h-9 w-28 rounded-md border border-gray-300 px-2 text-sm font-normal text-foreground focus:outline-none focus:ring-2 focus:ring-core"
                  >
                    <option value="" disabled>Seleccione</option>
                    {periods.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </label>
                <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
                  Programa
                  <select
                    value={program}
                    onChange={(e) => setProgram(e.target.value)}
                    className="h-9 w-28 rounded-md border border-gray-300 px-2 text-sm font-normal text-foreground focus:outline-none focus:ring-2 focus:ring-core"
                  >
                    <option value="">Todos</option>
                    <option value="ISIS">ISIS</option>
                    <option value="MINE">MINE</option>
                    <option value="MESI">MESI</option>
                  </select>
                </label>
              </div>
            }
          />
          {selectedCourses.length > 0 && (
            <div className="flex justify-end">
              <Button onClick={() => void downloadSelected()}><Download className="mr-2 h-4 w-4" />Descargar</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error alert modal */}
      <AlertDialogError onOpenChange={setLoadError} open={loadError} />
    </div>
  )
}
