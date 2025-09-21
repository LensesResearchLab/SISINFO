
import { Section } from './billboard.type';
import { Period } from './period.type';



export interface TeachingAssistantship {
  studentCode: string;
  studentName: string;
  id: string;
  section: Section;
  period: Period;
  grade: number | null;
  gradeDescription: string | null;
}
