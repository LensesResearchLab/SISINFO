import { GraduatedAssistanceApplication } from "./graduated-assistance-application.type";
import { Student } from "./student.type";
import { User } from "./user.type";

export interface Professor {
  user: User;
}

export interface Requirement {
  id: string;
  description: string;
}

export interface GraduatedAssistance {
  id: string;
  title: string;
  category: string;
  description: string;
  startDate: Date;
  endDate: Date;
  requirements: Requirement[];
  professor: Professor;
  assistanceApplications?: GraduatedAssistanceApplication[];
}

export interface StatusInformation {
  id: string;
  document: { name: string };
  status: string;
  student: Student;
  graduatedAssistance: GraduatedAssistance;
}
