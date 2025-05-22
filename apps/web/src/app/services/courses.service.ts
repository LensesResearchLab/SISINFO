import { mapCoursesToLeadersRow } from "../mappers/course.mapper"
import { API_ROUTES } from "../routes"
import { Course } from "../types/entities/course.type"



export async function findAllWithMainProfessor() {
  const url = `${API_ROUTES.BASE}/${API_ROUTES.COURSE_LEADERS}`;
  console.log('Requesting:', url)

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    credentials: 'include'
  })

  console.log('Status:', response.status)

  const text = await response.text();
  console.log('Raw response:', text)

  try {
    const courses: Course[] = JSON.parse(text);
    console.log({courses})
    return mapCoursesToLeadersRow(courses)
  } catch (err) {
    console.error('Error parsing JSON:', err)
    return []
  }
}
