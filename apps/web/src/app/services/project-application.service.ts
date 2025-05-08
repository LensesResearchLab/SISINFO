const API_URL = "http://localhost:8000/api/project-applications"

export async function getProjectApplicationsReport() {
    const response = await fetch(`${API_URL}/projects-report`);
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