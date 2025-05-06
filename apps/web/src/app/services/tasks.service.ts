import { API_ROUTES } from "../routes";

const API = `${API_ROUTES.BASE}/${API_ROUTES.TASKS}`

export async function getPendingTasksForStudent(id: string) {
    const url = `${API}/student/${id}/pending}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Error buscando las tareas: ${response.statusText}`, { cause: errorData });
    }
    return response.json();
  }