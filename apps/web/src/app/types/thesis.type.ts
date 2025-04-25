import { Period } from "./period.type";
import { Student } from "./student.type";

export interface Thesis {
  id: number;
  title: string;
  description: string;
  investigationSubarea: string[];
  isEnded: boolean;
  thesisApplications: ThesisApplication[];
  period: Period;
  professor: Professor;
  tags: string[];
}

export interface ThesisApplication {
  id: string;
  status: string;
  grade: string;
}

export interface Professor {
  document: string;
  isActive: boolean;
  user: {
    document: string;
    name: string;
    email: string;
  };
}

export interface StatusInformation {
  id: string;
  status: string;
  grade: string;
  student: Student;
  period: Period;
  professor: Professor;
  thesis: Thesis;
}

/*
export interface StudentDetail {
  id: string;
  name: string;
  status: string;
  date: string;
}

export interface StatusInformation {
  semester: string;
  projectTitle: string;
  advisor: string;
  student: string;
  studentEmail: string;
  grade: string;
  lastStep: string;
} */

export interface ThesisReport {
  student_code: string;
  student_name: string;
  student_email: string;
  professor_name: string;
  professor_email: string;
  thesis_investigation_subarea: string;
  thesis_title: string;
  status: string;
  thesis_grade: string;
  thesis_period: {
    year: string;
    period: string;
  };
}
