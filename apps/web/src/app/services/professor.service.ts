import { API_ROUTES } from "../routes";
import { Section } from "../types/entities/billboard.type";
import { CreateProject } from "../types/entities/project.type";


export async function getTeachingAssistants(period: string): Promise<Section[]> {
    const url = `${API_ROUTES.BASE}/${API_ROUTES.PROFESSORS}/${API_ROUTES.TEACHING_ASSISTANTS}?period=${encodeURIComponent(period)}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: "include",
    });
  
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Error buscando los monitores: ${response.statusText}`, { cause: errorData });
    }
    return response.json();
}

export async function createUndergraduateProject(bodyData: CreateProject) {
  const url = `${API_ROUTES.BASE}/${API_ROUTES.PROJECTS}`;
  const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyData),
      credentials: 'include'
    });
  
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Error creando los proyectos: ${response.statusText}`, { cause: errorData });
    }
    return response.json();
}
  
