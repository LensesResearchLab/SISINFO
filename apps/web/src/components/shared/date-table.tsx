"use client"

import { format } from "date-fns"
import { es } from "date-fns/locale"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { ImportantDate } from "@/app/types/entities/Important-date"
import { EditDateDialog } from "../edit-date-dialog"
import { useAuth } from "@/hooks/use-auth"
import { useMemo, useState } from "react"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"


interface DateTableProps {
  title: string
  sectionId: string
  dates: ImportantDate[]
  onUpdateDate: (dateId: string, data: {importantSectionId: string; name: string; date: string;  }) => Promise<void>
}

export function DateTable({sectionId,title, dates, onUpdateDate }: Readonly<DateTableProps>) {
  const { user } = useAuth()
  const [sortConfig, setSortConfig] = useState<{
    key: "name" | "date" | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" })

  const collator = useMemo(
    () => new Intl.Collator("es", { sensitivity: "base" }),
    []
  )

  const sortedDates = useMemo(() => {
    if (!sortConfig.key) return dates

    const sorted = [...dates].sort((a, b) => {
      if (sortConfig.key === "date") {
        const aDate = Date.parse(a.date)
        const bDate = Date.parse(b.date)
        const comparison = (aDate || 0) - (bDate || 0)
        return sortConfig.direction === "asc" ? comparison : -comparison
      }

      const comparison = collator.compare(a.name, b.name)
      return sortConfig.direction === "asc" ? comparison : -comparison
    })

    return sorted
  }, [collator, dates, sortConfig])

  const handleSort = (key: "name" | "date") => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        if (prev.direction === "asc") return { key, direction: "desc" }
        return { key: null, direction: "asc" }
      }
      return { key, direction: "asc" }
    })
  }

  const getAriaSort = (key: "name" | "date") => {
    if (sortConfig.key !== key) return "none" as const
    return sortConfig.direction === "asc" ? "ascending" : "descending"
  }

  const renderSortIcon = (key: "name" | "date") => {
    if (sortConfig.key !== key) return <ArrowUpDown className="h-4 w-4 opacity-50" />
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    )
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort("name")}
                aria-sort={getAriaSort("name")}
              >
                <span className="flex items-center gap-2">
                  Nombre
                  {renderSortIcon("name")}
                </span>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort("date")}
                aria-sort={getAriaSort("date")}
              >
                <span className="flex items-center gap-2">
                  Fecha
                  {renderSortIcon("date")}
                </span>
              </TableHead>
              <TableHead className="w-[60px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No hay fechas definidas
                </TableCell>
              </TableRow>
            ) : (
              sortedDates.map((date) => (
                <TableRow key={date.id}>
                  <TableCell className="font-medium">{date.name}</TableCell>
                  <TableCell>{format(new Date(date.date + "T00:00:00"), "PPP", { locale: es })}</TableCell>
                  <TableCell>
                    {user?.roles?.includes('coordinador') ? (
                      <EditDateDialog date={date} onSave={(data) => onUpdateDate(date.id, { ...data, importantSectionId: sectionId })} />
                    ) : null}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
