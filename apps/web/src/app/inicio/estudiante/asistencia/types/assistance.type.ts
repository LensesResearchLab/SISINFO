export interface Professor {
  name: string;
  email: string;
}

export interface Requirement {
  id: string;
  name: string;
  description: string;
}

export interface Assistance {
  id: string;
  title: string;
  clasification: string;
  publication_date: Date;
  end_date: Date;
  start_semester: string;

  description: string;
  requirements: Requirement[];
  professor: Professor;
}

export interface StatusInformation {
  id: string;
  assistance_id: number;
  start_semester: string;
  title: string;
  professor: string;
  student: string;
  studentEmail: string;
  studentCv: string;
  lastStep: string;

  inscription_date: Date;
  clasification: string;
}
