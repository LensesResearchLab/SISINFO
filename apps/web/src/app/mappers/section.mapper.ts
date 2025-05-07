import { Section } from "../types/entities/billboard.type";
import { TeachingAssistantshipProfessorSection } from "../types/teachingAssistantshipProfessorSection";

export function mapSectionsToProfessorTable(
  sections: Section[],
): TeachingAssistantshipProfessorSection {
  return sections.reduce((acc, section) => {
    const courseName = `${section.NRC} - ${section.course.code} - ${section.course.name}`;

    const assistants = section.teachingAssistances.map((ta) => ({
      id: ta.id,
      code: ta.student.code,
      name: ta.student.user.name,
      grade: ta.grade,
      gradeDescription: ta.gradeDescription,
    }));

    acc[courseName] = assistants;
    return acc;
  }, {} as TeachingAssistantshipProfessorSection);
}

export function mapSectionsToProfessorSection(
  section: Section
): TeachingAssistantshipProfessorSection {
  const courseName = `${section.NRC} - ${section.course.code} - ${section.course.name}`;

  const assistants = section.teachingAssistances.map((ta) => ({
    id: ta.id,
    code: ta.student.code,
    name: ta.student.user.name,
    grade: ta.grade,
    gradeDescription: ta.gradeDescription,
  }));

  return {
    [courseName]: assistants,
  };
}