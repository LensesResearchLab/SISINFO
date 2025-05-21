import { mapCoursesToLeadersRow } from "../mappers/course.mapper"
import { API_ROUTES } from "../routes"
import { Course } from "../types/entities/course.type"



export async function findAllWithMainProfessor() {
  const response = await fetch(`${API_ROUTES.BASE}/${API_ROUTES.COURSE_LEADERS}`)
  const courses: Course[] = await response.json()
  return mapCoursesToLeadersRow(courses)
}

