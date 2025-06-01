import { Project } from "../types/entities/project.type";
import { ProjectsStudentTableRow , ProjectsStudentTable } from "../types/projects-by-professor.type";

export function mapProjectsToStudentTable(
  projects: Project[],
  category: string,
): ProjectsStudentTable {
  return projects.reduce((acc, project) => {
    const mappedProject: ProjectsStudentTableRow = {
      id: project.id,
      title: project.title,
      category: project.category,
      maxStudents: project.maxStudents,
    };

    if (category === "professor") {
      const identifier = `${project.professor!.user.name} - ${project.professor!.user.email}`;
      if (!acc[identifier]) {
        acc[identifier] = [];
      }
      acc[identifier].push(mappedProject);
    } else {
      const identifiers = project.areasOfInterest?.map(area => area.description) ?? [];
      identifiers.forEach(identifier => {
        if (!acc[identifier]) {
          acc[identifier] = [];
        }
        acc[identifier].push(mappedProject);
      });
    }
    return acc;
  }, {} as ProjectsStudentTable);
}