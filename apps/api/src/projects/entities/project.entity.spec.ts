import 'reflect-metadata';
import { Project } from './project.entity';
import { ProjectApplication } from '../../project-applications/entities/project-application.entity';
import { AreasOfInterest } from '../../areas-of-interest/entities/areas-of-interest.entity';
import { Period } from '../../periods/entities/period.entity';
import { Professor } from '../../professors/entities/professor.entity';
import { Student } from '../../students/entities/student.entity';

describe('Project Entity', () => {
  it('should create a Project with expected properties and relationships', () => {
    const mockTitle = 'Project A';
    const mockDescription = 'Description of Project A';
    const mockCategory = 'Category A';
    const mockMaxStudents = 5;
    const mockIsEnded = false;

    const mockProjectApplication1 = new ProjectApplication();
    const mockProjectApplication2 = new ProjectApplication();
    const mockAreasOfInterest1 = new AreasOfInterest();
    const mockAreasOfInterest2 = new AreasOfInterest();
    const mockProfessor = new Professor();
    const mockPeriod = new Period();
    const mockStudent1 = new Student();
    const mockStudent2 = new Student();

    const project = new Project();
    project.title = mockTitle;
    project.description = mockDescription;
    project.category = mockCategory;
    project.maxStudents = mockMaxStudents;
    project.isEnded = mockIsEnded;
    project.projectApplications = [
      mockProjectApplication1,
      mockProjectApplication2,
    ];
    project.areasOfInterest = [mockAreasOfInterest1, mockAreasOfInterest2];
    project.professor = mockProfessor;
    project.period = mockPeriod;
    project.students = [mockStudent1, mockStudent2];

    expect(project).toBeInstanceOf(Project);
    expect(project.title).toBe(mockTitle);
    expect(project.description).toBe(mockDescription);
    expect(project.category).toBe(mockCategory);
    expect(project.maxStudents).toBe(mockMaxStudents);
    expect(project.isEnded).toBe(mockIsEnded);
    expect(project.projectApplications).toHaveLength(2);
    expect(project.projectApplications[0]).toBeInstanceOf(ProjectApplication);
    expect(project.projectApplications[1]).toBeInstanceOf(ProjectApplication);
    expect(project.areasOfInterest).toHaveLength(2);
    expect(project.areasOfInterest[0]).toBeInstanceOf(AreasOfInterest);
    expect(project.areasOfInterest[1]).toBeInstanceOf(AreasOfInterest);
    expect(project.professor).toBeInstanceOf(Professor);
    expect(project.period).toBeInstanceOf(Period);
    expect(project.students).toHaveLength(2);
    expect(project.students[0]).toBeInstanceOf(Student);
    expect(project.students[1]).toBeInstanceOf(Student);
  });
});
