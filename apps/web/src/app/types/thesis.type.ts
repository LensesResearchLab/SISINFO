export interface Thesis {
  id: number;
  title: string;
  description: string;
  email: string;
  category: string;
  semester: string;
  students: StudentDetail[];
  areas_of_interest: string[];
  professor: string;
}

export interface StudentDetail {
id: string
name: string
status: string
date: string
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