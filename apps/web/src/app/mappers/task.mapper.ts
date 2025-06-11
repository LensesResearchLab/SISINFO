import { flows } from "../inicio/tareas/flows";
import { Task } from "../types/entities/task.type";

          
export function mapTasksToTaskTable(tasks: Task[]) {
  return tasks.map((task: Task) => {
    const stepNumber =
        typeof task.step === "number" ? task.step : Number(task.step);
    const stepInfo = flows.proyectoPregrado[stepNumber];
    return {
      ...task,
      step: stepNumber,
      title: stepInfo?.title ?? "Sin título",
      description: stepInfo?.description ?? "Sin descripción",
      date: task.date ? new Date(task.date) : new Date(),
    };
  });
}

