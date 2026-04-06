import { API_ROUTES } from "../routes";

const API_URL = `${API_ROUTES.BASE}/project-applications`

export async function getProjectApplicationsReport(period?: string) {
    const url = period 
      ? `${API_URL}/projects-report?period=${encodeURIComponent(period)}`
      : `${API_URL}/projects-report`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch undergraduate projects data for report.");
    }
    return response.json();
  }

export async function updateProjectApplication(
  id: string,
  updateData: object
) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateData),
  });
  if (!response.ok) {
    throw new Error("Failed to update assistance.");
  }
  return response.json();
}

export async function getPendingTasksForStudent(id: string) {
  const url = `${API_URL}/student/tasks/${id}`;
  
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

export async function getPendingTasksForProfessor(id: string) {
  const url = `${API_URL}/professor/tasks/${id}`;
  
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

export async function getPendingTasksForCoordinator() {
  // Also include standalone tasks created via /tasks (e.g., subarea inscriptions)
  const url = `${API_ROUTES.BASE}/tasks`;
  
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