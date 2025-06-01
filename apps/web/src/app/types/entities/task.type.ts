
import { TaskType } from "@/app/inicio/tareas/flows";
import { Coordinator } from "./coordinator.type";
import { Professor } from "./professor.type";
import { Student } from "./student.type";
import { Document } from './document.type'

export interface Task {
  projectActualTask: Task;
  id: string;
  status: string;
  date: Date;
  step: number;
  title: string;
  description: string;
  student:Student;
  professor:Professor;
  coordinator:Coordinator;
}

export interface CreateTask {
  type?: TaskType,
  approved: boolean,
  comment: string,
  date: Date,
  step?: number,
  document?: Document
}