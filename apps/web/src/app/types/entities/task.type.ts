
import { Coordinator } from "./coordinator.type";
import { Professor } from "./professor.type";
import { Student } from "./student.type";

export interface Task {
  projectActualTask: any;
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