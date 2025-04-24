import { API_ROUTES } from "../routes"
import { CreateTeachingAssistance } from "../types/createTeachingAssistance.type"

const API = `${API_ROUTES.BASE}/${API_ROUTES.TEACHING_ASSISTANTS}`
export async function uploadTeachingAssistantsFile(teachingAssistantList: CreateTeachingAssistance[], period: string) {
  const response = await fetch(API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      period,
      assistants: teachingAssistantList
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Error uploading teaching assistants: ${response.statusText}`, { cause: errorData });
  }

  return response.json();
}

export async function getTeachingAssistants(period: string) {
    const url = `${API}?period=${encodeURIComponent(period)}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Error buscando los monitores: ${response.statusText}`, { cause: errorData });
    }
    return response.json();
  }
  
