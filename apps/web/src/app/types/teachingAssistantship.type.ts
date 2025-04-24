
import { Section } from './billboard.type';
import { Period } from './period.type';
import { Student } from './student.type';


export interface TeachingAssistantship {
  id: string;
  contractNumber: number;
  student: Student;
  section: Section;
  period: Period;

  grade: number | null;
  gradeDescription: string | null;
}
