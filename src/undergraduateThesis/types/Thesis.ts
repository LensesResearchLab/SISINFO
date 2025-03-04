export interface Thesis {
  id: number;
  title: string;
  description: string;
  email: string;
  category: string;
  semester: string;
  students: string;
  areas_of_interest: string[];
  professor: string;
}

export interface StatusInformation {
  semester: string
  projectTitle: string
  advisor: string
  student: string
  studentEmail: string
  grade: string
  lastStep: string
}