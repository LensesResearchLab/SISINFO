import { Period } from "./period.type"
import { TeachingAssistantship } from "./teachingAssistantship.type";
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
    teachingAssistances: TeachingAssistantship[];
    course: Course,
    period: Period,
}
