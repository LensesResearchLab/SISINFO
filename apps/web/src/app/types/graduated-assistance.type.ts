import { GraduatedAssistanceApplication } from "./graduated-assistance-application.type";

export interface Professor {
    name: string;
    email: string;
  }
  
  export interface Requirement {
    id: string;
    description: string;
  }

export interface GraduatedAssistance {
    id:          string;
    title:       string;
    category:    string;
    description: string;
    startDate:   Date;
    endDate:     Date;
    requirements: Requirement[];
    professor: Professor;
    assistanceApplications?: GraduatedAssistanceApplication[];
}


// TODO: Check if this is used somewhere if not delete (its before backend worked = old)
export interface StatusInformation {
    id: string;
    assistance_id: number;
    start_date: string;
    title: string;
    professor: string;
    student: string;
    studentEmail: string;
    studentCv: string;
    lastStep: string;
  
    inscription_date: Date;
    clasification: string;
  }
  