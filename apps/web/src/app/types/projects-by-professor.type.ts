export type ProjectsStudentTable = {
  [professorIdentifier: string]: ProjectsStudentTableRow[];
};


export type ProjectsStudentTableRow = {
  id: string;
  title: string;
  category: string;
  maxStudents: number;
}