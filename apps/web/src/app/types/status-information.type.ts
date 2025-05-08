import { Professor } from "./entities/graduated-assistance.type";
import { Period } from "./entities/period.type";
import { Student } from "./entities/student.type";
import { Project } from "./entities/project.type";

export interface ProjectStatusInformation {
  id: string;
  lastStep: string;
  grade: string;
  student: Student;
  period: Period;
  professor: Professor;
  project: Project;
}
