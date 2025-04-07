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
}

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
}
