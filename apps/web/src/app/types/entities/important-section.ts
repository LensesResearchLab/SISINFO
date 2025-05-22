import { ImportantDate } from "./Important-date";
import { Period } from "./period.type";


export interface ImportantSection {
  id: string;
  name: string;
  academicProcess: string;
  period: Period;
  importantDates: ImportantDate[]
}