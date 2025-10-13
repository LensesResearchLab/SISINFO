"use client"

import { format } from "date-fns"
import { es } from "date-fns/locale"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { ImportantDate } from "@/app/types/entities/Important-date"
import { EditDateDialog } from "../edit-date-dialog"


interface DateTableProps {
  title: string
  sectionId: string
  dates: ImportantDate[]
  onUpdateDate: (dateId: string, data: {importantSectionId: string; name: string; date: string;  }) => Promise<void>
}

export function DateTable({sectionId,title, dates, onUpdateDate }: DateTableProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Fecha</TableHead>
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
              dates.map((date) => (
                <TableRow key={date.id}>
                  <TableCell className="font-medium">{date.name}</TableCell>
                  <TableCell>{format(new Date(date.date + "T00:00:00"), "PPP", { locale: es })}</TableCell>
                  <TableCell>
                    <EditDateDialog date={date} onSave={(data) => onUpdateDate(date.id, { ...data, importantSectionId: sectionId })} />
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
