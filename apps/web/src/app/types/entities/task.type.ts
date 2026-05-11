
import { TaskType } from "@/app/inicio/tareas/flows";
import { Coordinator } from "./coordinator.type";
import { Professor } from "./professor.type";
import { Student } from "./student.type";
import { Document } from './document.type'
import { ProjectApplication } from './project-application.type'

export interface Task {
  projectActualTask?: ProjectApplication | null;
  id: string;
  type: TaskType;
  status: string;
  date: Date;
  step: number;
  title: string;
  description: string;
  comment: string;
  approved: boolean;
  student:Student;
  professor:Professor;
  coordinator:Coordinator;
  document?: Document;
  grade?: string;
}

export interface CreateTask {
  type?: TaskType,
  approved: boolean,
  comment: string,
  date: Date,
  step?: number,
  document?: Document,
  grade?: string
}