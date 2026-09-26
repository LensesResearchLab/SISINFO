import { API_ROUTES } from "../routes";
import { CreateTask } from "../types/entities/task.type";

export async function createTask(taskId: string, taskData: CreateTask, file?: File) {
  const formData = new FormData();

  formData.append(
    "taskDto",
    JSON.stringify(taskData)
  );

  if (file) {
    formData.append("file", file);
  }

  const url = `${API_ROUTES.BASE}/${API_ROUTES.PROJECT_APPLICATIONS}/${taskId}/task`;
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

export async function getPendingStandaloneTasksForProfessor(id: string) {
  const response = await fetch(
    API_ROUTES.BASE + "/" + API_ROUTES.TASKS + "/professor/" + id,
  );
  if (!response.ok) throw new Error("Error buscando tareas del profesor.");
  return response.json();
}

export async function getPendingStandaloneTasksForStudent(id: string) {
  const response = await fetch(
    API_ROUTES.BASE + "/" + API_ROUTES.TASKS + "/student/" + id,
  );
  if (!response.ok) throw new Error("Error buscando tareas del estudiante.");
  return response.json();
}

