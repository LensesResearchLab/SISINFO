import { flows } from "../inicio/tareas/flows";
import { Task } from "../types/entities/task.type";

export function mapTasksToTaskTable(tasks: Task[]) {
  return tasks.map((task: Task) => {
    const stepNumber = typeof task.step === "number" ? task.step : Number(task.step);
    const stepInfo = flows[task.flow ?? "proyectoPregrado"]?.[stepNumber] ?? flows.proyectoPregrado[stepNumber];
    const assignmentMatch = task.flow === "asignacionCurso"
      ? task.comment?.match(/materia\s+(.+?)(?:\s+asignada|\s+como profesor)/i)
      : null;
    const assignedCourse = assignmentMatch?.[1];
    return {
      ...task,
      step: stepNumber,
      title: assignedCourse ? `Materia ${assignedCourse} asignada` : stepInfo?.title ?? "Sin título",
      description: assignedCourse ? `Se te asignó la materia ${assignedCourse} como profesor líder.` : stepInfo?.description ?? "Sin descripción",
      date: task.date ? new Date(task.date) : new Date(),
    };
  });
}
