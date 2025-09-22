import { mapCoursesToLeadersRow } from "../mappers/course.mapper"
import { API_ROUTES } from "../routes"
import { Course } from "../types/entities/course.type"

export async function findProfessorsForCourseInCurrentPeriod(id: string) {
  const url = `${API_ROUTES.BASE}/${API_ROUTES.COURSES}/professors/${encodeURIComponent(id)}`;
  const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    });
  
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Error encontrando los profesores: ${response.statusText}`, { cause: errorData });
    }
    return response.json();
}

export async function findAllWithMainProfessor() {
  const url = `${API_ROUTES.BASE}/${API_ROUTES.COURSE_LEADERS}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    credentials: 'include'
  })

  const text = await response.text();

  try {
    const courses: Course[] = JSON.parse(text);
    return mapCoursesToLeadersRow(courses)
  } catch (err) {
    console.error('Error parsing JSON:', err)
    return []
  }
}

export async function assignProfessorAsCourseLeader(professorId: string, courseId: string) {
  const url = `${API_ROUTES.BASE}/${API_ROUTES.COURSES}/${encodeURIComponent(courseId)}/updateProfessor/${encodeURIComponent(professorId)}`;
  const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
    });
  
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Error asignando como lider: ${response.statusText}`, { cause: errorData });
    }
    return response.json();
}

export async function uploadCourseProgram(courseId: string, file: File) {
  const url = `${API_ROUTES.BASE}/${API_ROUTES.COURSES}/${encodeURIComponent(courseId)}/program`;
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    let errorMsg = `Error subiendo el programa: ${response.statusText}`;
    try {
      const json = JSON.parse(errorText);
      if (json?.message) errorMsg = Array.isArray(json.message) ? json.message.join(', ') : json.message;
    } catch {}
    throw new Error(errorMsg);
  }
  return response.json();
}
  