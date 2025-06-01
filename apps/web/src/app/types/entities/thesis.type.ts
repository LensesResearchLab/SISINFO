
import { Professor } from "./graduated-assistance.type";
import { Period } from "./period.type";
import { Student } from "./student.type";
import { ThesisApplication } from "./thesis-application.type";

export interface Thesis {
  id?: string;
  title: string;
  description: string;
  investigationSubarea: string;
  isEnded: boolean;
  thesisApplications?: ThesisApplication[];
  period?: Period;
  professor?: Professor;
  tags?: string[];
  students?: Student[];
  category?: string;
}


