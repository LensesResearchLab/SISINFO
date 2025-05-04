import { Student } from "./student.type";
import { Thesis } from './thesis.type';

export interface ThesisApplication {
  id: string;
  status: string;
  grade: string;
  student: Student;
  thesis: Thesis;
}
