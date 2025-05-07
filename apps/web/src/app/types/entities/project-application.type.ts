import { Project } from "./project.type";
import { Student } from "./student.type";

export interface ProjectApplication {
  status: string;
  motivation: string;
  wasContacted: boolean;
  student?: Student;
  project?: Project;
}