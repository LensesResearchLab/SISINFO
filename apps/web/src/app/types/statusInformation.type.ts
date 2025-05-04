import { Professor } from "./graduated-assistance.type";
import { Period } from "./period.type";
import { Student } from "./student.type";
import { Thesis } from "./thesis.type";

export interface StatusInformation {
  id: string;
  status: string;
  grade: string;
  student: Student;
  period: Period;
  professor: Professor;
  thesis: Thesis;
}
