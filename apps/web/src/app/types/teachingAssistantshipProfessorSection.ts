export type TeachingAssistantshipProfessorSection = {
  [courseName: string]: ProfessorTA[];
};


export type ProfessorTA = {
    id: string,
    code: string;
    name: string;
    grade: number | null;
    gradeDescription: string | null;
  }