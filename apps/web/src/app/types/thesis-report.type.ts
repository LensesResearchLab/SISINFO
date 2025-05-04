export interface ThesisReport {
  student_code: string;
  student_name: string;
  student_email: string;
  professor_name: string;
  professor_email: string;
  thesis_investigation_subarea: string;
  thesis_title: string;
  status: string;
  thesis_grade: string;
  thesis_period: {
    year: string;
    period: string;
  };
}
