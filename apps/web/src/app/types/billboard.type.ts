import { Period } from "./period.type"
import { Student } from "./student.type"
export interface Billboard {
    id?: string;
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
    sections: Section[];
    credits: number;
    mainProfessor: Professor;
    program: string
}
export interface Professor {
    id: string;
    user:User;
}
export interface User{
    document:string;
    email:string;
    name:string;
}
export interface Section {
    id: string;
    NRC: number;
    section: number;
    professors:Professor[];
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