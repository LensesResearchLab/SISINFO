export interface Task {
  id: string;
  status: string;
  date: Date;
  step: number;
  title: string;
  description: string;
  student:any;
  professor:any;
}
