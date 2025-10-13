export interface ImportantDate {
  id: string
  name: string
  date: string
}

export interface DateSection {
  id: string
  name: string
  importantDates: ImportantDate[]
}

export type AcademicProcess = "Tesis pregrado" | "Tesis postgrado"

export interface AcademicProcessData {
  process: AcademicProcess
  sections: DateSection[]
}
