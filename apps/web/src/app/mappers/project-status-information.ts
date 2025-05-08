import { ProjectApplication } from "../types/entities/project-application.type";
import { ProjectStatusInformation } from "../types/status-information.type";

export async function ProjectApplicationToProjectStatusInformation(
  projectApplication: ProjectApplication
): Promise<ProjectStatusInformation> {
  return {
    id: projectApplication.id,
    project: projectApplication.project,
    period: projectApplication.period,
    professor: projectApplication.project.professor,
    student: projectApplication.student,
    grade: projectApplication.grade,
    lastStep: projectApplication.status,
  };
}