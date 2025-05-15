import { Professor } from "./graduated-assistance.type";
import { Period } from "./period.type";
import { ProjectApplication } from "./project-application.type";
import { Student } from "./student.type";

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  maxStudents: number;
  isEnded?: boolean;
  projectApplications?: ProjectApplication[];
  areasOfInterest?: AreasOfInterest[];
  professor?: Professor;
  period?: Period;
  students?: Student[];
}
export interface createProject {
  title: string;
  description: string;
  category: string;
  maxStudents: number;
  areasOfInterest: string[];
  period?: string;
}
export interface AreasOfInterest {
  description: string
}