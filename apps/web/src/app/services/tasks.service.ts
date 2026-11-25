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
    const backendMessage = Array.isArray(errorData?.message)
      ? errorData.message.join(', ')
      : errorData?.message;
    throw new Error(backendMessage || `Error creando la tarea: ${response.statusText}`, {
      cause: errorData,
    });
  }

  return response.json();
}


export async function getTask(id:string) {
  const url = `${API_ROUTES.BASE}/${API_ROUTES.TASKS}/${id}`;
  const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
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
    { credentials: "include" },
  );
  if (!response.ok) throw new Error("Error buscando tareas del profesor.");
  return response.json();
}

export async function getPendingStandaloneTasksForStudent(id: string) {
  const response = await fetch(
    API_ROUTES.BASE + "/" + API_ROUTES.TASKS + "/student/" + id,
    { credentials: "include" },
  );
  if (!response.ok) throw new Error("Error buscando tareas del estudiante.");
  return response.json();
}

/** Keeps one visible item per pending activity, even when the same task is
 * returned by both the project-flow and generic task endpoints. */
export function deduplicatePendingTasks<T extends Record<string, any>>(tasks: T[]): T[] {
  const validTasks = tasks.filter((task) =>
    !(task.flow === 'proyectoPregrado' && !task.projectActualTask?.id && !task.projectApplicationId)
  );
  return validTasks.filter((task, index, source) => {
    const applicationId = task.projectActualTask?.id ?? task.projectPreviousTasks?.id ?? task.projectApplicationId ?? '';
    const key = applicationId ? [task.flow ?? '', task.type ?? '', task.step ?? '', applicationId].join('|') : `task:${task.id}`;
    return index === source.findIndex((candidate) => {
      const candidateApplicationId = candidate.projectActualTask?.id ?? candidate.projectPreviousTasks?.id ?? candidate.projectApplicationId ?? '';
      const candidateKey = candidateApplicationId ? [candidate.flow ?? '', candidate.type ?? '', candidate.step ?? '', candidateApplicationId].join('|') : `task:${candidate.id}`;
      return candidateKey === key;
    });
  });
}

