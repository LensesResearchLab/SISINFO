import { API_ROUTES } from "../routes";
import { Section } from "../types/billboard.type";

export async function getTeachingAssistants(period: string): Promise<Section[]> {
    const url = `${API_ROUTES.BASE}/${API_ROUTES.PROFESSORS}/PROFESSOR1/${API_ROUTES.TEACHING_ASSISTANTS}?period=${encodeURIComponent(period)}`;
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
  