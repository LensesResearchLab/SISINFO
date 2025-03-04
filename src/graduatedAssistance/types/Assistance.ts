export interface Assistance{
    id: number;
    name: string;
    clasification: string;
    publication_date: Date;
    end_date: Date;
    start_semester: string;

    // For detailed info:
    description:string;
    requisites: string[];
    professor: string;
    email: string;

  }

export interface StatusInformation {
  id: number;
  assistance_id: number;
  start_semester: string;
  name: string;
  professor: string;
  student: string;
  studentEmail: string;
  studentCv: string;
  lastStep: string;

  // For all applied list
  inscription_date: Date;
  clasification: string;
}




