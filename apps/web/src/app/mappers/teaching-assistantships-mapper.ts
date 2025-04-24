import { CreateTeachingAssistance } from '../types/createTeachingAssistance.type';
import { CsvTASRow } from '../types/Csv-TAS-row';
import { TeachingAssistantship } from '../types/teachingAssistantship.type';
import { TeachingAssistantshipRow } from '../types/teachingAssistantshipRow.type';
export function mapTeachingAssistantshipsToCoordinatorTable(
  teachingAssistantships: TeachingAssistantship[],
): TeachingAssistantshipRow[] {
  return teachingAssistantships.map(mapTeachingAssistantShipToRow)
}

export function mapCswRowTwoCreateTeachingAssistance(rows: CsvTASRow[]){
  return rows.map(csvRowToCreateTeachingAssistance);
}

function csvRowToCreateTeachingAssistance(row: CsvTASRow):CreateTeachingAssistance {
  return (
    {
      contractNumber: +row["NUM. CONT."],
      studentCode: row["CÓDIGO"],
      courseCode: row['MATERIA'],
      sectionNumber: +row["SECCIÓN"]
    }
  )
}

export function mapTeachingAssistantShipToRow(teachingAssistantship: TeachingAssistantship): TeachingAssistantshipRow {
  return {
    studentCode: teachingAssistantship.student.code, 
    contratNumber: teachingAssistantship.contractNumber, 
    studentName: teachingAssistantship.student.user.name, 
    professorsName: teachingAssistantship.section.professors.map((professor) => professor.user.name), 
    courseCode: teachingAssistantship.section.course.code, 
    section: teachingAssistantship.section.section
  }
}

