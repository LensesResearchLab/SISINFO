import { GraduatedAssistanceApplication } from "./graduated-assistance-application.type";

export interface Professor {
  user: {
    document: string;
    name: string;
    email: string;
  };
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
  status: string;
  student: {
    isUndergraduate: boolean;
    code: string;
    user: {
      document: string;
      name: string;
      email: string;
    }
  };
  graduatedAssistance: {
    id: string;
    title: string;
    category: string;
    description: string;
    startDate: string;
    endDate: string;
    professor: {
      user: {
        document: string;
        name: string;
        email: string;
      };
    };
  };
}
