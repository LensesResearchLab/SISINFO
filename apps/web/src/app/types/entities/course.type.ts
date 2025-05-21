import { Billboard, Professor, Section } from "./billboard.type";
import { Student } from "./student.type";
import { Document } from "./document.type";

export interface Course {
  id: string
  code: string;
  departament: string;
  name: string;
  credits: number;
  billboard?: Billboard;
  mainProfessor: Professor;
  sections?: Section[];
  students?: Student[];
  otherStudents?: Student[];
  program?: Document;
  partialGrades?: Document;
  finalGrades?: Document;
}