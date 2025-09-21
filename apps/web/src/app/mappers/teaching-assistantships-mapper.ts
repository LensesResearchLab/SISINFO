import { CreateTeachingAssistance } from '../types/createTeachingAssistance.type';
import { CsvTASRow } from '../types/Csv-TAS-row';
import { TeachingAssistantship } from '../types/entities/teachingAssistantship.type';
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
      studentCode: row["CODIGO"],
      courseCode: row['MATERIA'],
      sectionNumber: +row["SECCION"],
      studentName: row["NOMBRE"]
    }
  )
}

export function mapTeachingAssistantShipToRow(teachingAssistantship: TeachingAssistantship): TeachingAssistantshipRow {
  return {
    studentCode: teachingAssistantship.studentCode, 
    studentName: teachingAssistantship.studentName, 
    professorsName: teachingAssistantship.section.professors.map((professor) => professor.user.name), 
    courseCode: teachingAssistantship.section.course.code, 
    section: teachingAssistantship.section.section
  }
}

