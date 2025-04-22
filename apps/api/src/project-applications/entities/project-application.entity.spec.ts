import 'reflect-metadata';
import { ProjectApplication } from './project-application.entity';
import { ProjecStatusEnum } from '../enums/project_status.enum';
import { Student } from '../../students/entities/student.entity';
import { Project } from '../../projects/entities/project.entity';

describe('ProjectApplication Entity', () => {
  it('should create a ProjectApplication with expected properties and relationships', () => {
    const mockStatus = ProjecStatusEnum.APPLICANT;
    const mockMotivation = 'I work at Google';
    const mockWasContacted = false;

    const mockStudent = new Student();
    const mockProject = new Project();

    const projectApplication = new ProjectApplication();
    projectApplication.status = mockStatus;
    projectApplication.motivation = mockMotivation;
    projectApplication.wasContacted = mockWasContacted;
    projectApplication.student = mockStudent;
    projectApplication.project = mockProject;

    expect(projectApplication).toBeInstanceOf(ProjectApplication);
    expect(projectApplication.status).toBe(mockStatus);
    expect(projectApplication.motivation).toBe(mockMotivation);
    expect(projectApplication.wasContacted).toBe(mockWasContacted);
    expect(projectApplication.student).toBeInstanceOf(Student);
    expect(projectApplication.project).toBeInstanceOf(Project);
  });
});
