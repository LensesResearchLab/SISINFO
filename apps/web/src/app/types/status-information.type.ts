import { Professor } from "./graduated-assistance.type";
import { Period } from "./entities/period.type";
import { Student } from "./entities/student.type";
import { Thesis } from "./entities/thesis.type";

export interface StatusInformation {
  id: string;
  status: string;
  grade: string;
  student: Student;
  period: Period;
  professor: Professor;
  thesis: Thesis;
}
