import { Thesis } from "../types/entities/thesis.type";
import { ThesesStudentTable } from "../types/theses-by-professor.type";

export function mapThesesToStudentTable(
  theses: Thesis[],
  category: string,
): ThesesStudentTable {
  return theses.reduce((acc, thesis) => {
    if (category === "professor") {
      const identifier = `${thesis.professor!.user.name} - ${thesis.professor!.user.email}`;
      if (!acc[identifier]) {
        acc[identifier] = [];
      }
      acc[identifier].push(thesis);
    } else {
      if (!acc[thesis.investigationSubarea]) {
        acc[thesis.investigationSubarea] = [];
      }
      acc[thesis.investigationSubarea].push(thesis);
    }
    return acc;
  }, {} as ThesesStudentTable);
}