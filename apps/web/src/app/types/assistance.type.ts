export interface Professor {
  name: string;
  email: string;
}

export interface Requirement {
  id: string;
  name: string;
}

export interface Assistance {
  id: string;
  title: string;
  description: string;
  category: string;
  start_date: String; //TODO: check this from backend
  end_date: String;

  requirements: Requirement[];
  professor: Professor;
}

// TODO: Where this comes from?
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
