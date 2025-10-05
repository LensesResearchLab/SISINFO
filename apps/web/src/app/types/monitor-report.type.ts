export interface MonitorReport {
  id: string;
  studentCode: number;
  studentName: string;
  courseCode: string;
  courseName: string;
  section: string;
  nrc: string;
  professorName: string;
  professorEmail: string;
  grade: number | string;
  gradeDescription: string;
}
