import { Period } from "./period.type";
import { Professor } from "./professor.type";
import { Project } from "./project.type";
import { Student } from "./student.type";

export interface ProjectApplication {
  id: string;
  status: string;
  motivation: string;
  wasContacted: boolean;
  grade: string;
  student: Student;
  project: Project;
  period: Period;
  professor: Professor;
}

export interface CreateProjectApplication {
  motivation: string;
  wasContacted: boolean;
  projectId: string;
}