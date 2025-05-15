import { API_ROUTES } from "../routes";

export async function createTask(projectId: string, taskData: any, file?: File) {
  const formData = new FormData();

  formData.append(
    "taskDto",
    new Blob([JSON.stringify(taskData)], { type: "application/json" })
  );

  if (file) {
    formData.append("file", file);
  }

  const url = `${API_ROUTES.BASE}/${API_ROUTES.PROJECT_APPLICATIONS}/${projectId}/task`;
  const response = await fetch(url, {
    method: "POST",
    body: formData,
    credentials: "include"
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Error creando los proyectos: ${response.statusText}`, {
      cause: errorData,
    });
  }

  return response.json();
}


export async function getTask(id:string) {
  const url = `${API_ROUTES.BASE}/${API_ROUTES.TASKS}/${id}`;
  const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Error obteniendo la tarea: ${response.statusText}`, { cause: errorData });
    }
    return response.json(); 
}

