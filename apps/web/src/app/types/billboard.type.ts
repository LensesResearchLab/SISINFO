import { Period } from "./period.type"
import { Student } from "./student.type"
export interface Billboard {
    id:string;
    NRC: string;
    code: string;
    name: string;
    departament: string;
    credits: number;
    section: string;
    period: string;
    professors: string[];
    publicated: boolean;
  }
  
export interface Course {
    id: string;
    name: string;
    code: string;
    section: Section[];
    credits: number;
    professors: Professor[];
}
export interface Professor {
    id: string;
    name: string;
    email: string
    nrc: string;
    cycle: string;
    section: Section;
}
export interface Section {
    id: string;
    NRC: number;
    section: number;
    teaching_assistance: TeachingAssistance;
    period: Period,
}
export interface TeachingAssistance {
    id: string;
    task: string;
    status: string;
    periodTypeDescription: string;
    finalDate: Date;
    initialDate: Date;
    weeklyHours: number;
    description: string;
    grade: number;
    student: Student;
}