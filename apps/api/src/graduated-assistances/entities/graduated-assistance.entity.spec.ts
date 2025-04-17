import 'reflect-metadata';
import { GraduatedAssistance } from './graduated-assistance.entity';
import { Requirement } from '../../requirements/entities/requirement.entity';
import { Student } from '../../students/entities/student.entity';
import { Professor } from '../../professors/entities/professor.entity';
import { Period } from '../../periods/entities/period.entity';
import { AssistanceApplication } from '../../assistance-applications/entities/assistance-application.entity';

describe('GraduatedAssistance Entity', () => {
  it('should create a Assistantship with expected properties and relationships', () => {
    const mockTitle = 'Research Assistantship';
    const mockCategory = 'Research';
    const mockDescription = 'Assisting in research projects';
    const mockStartDate = new Date('2025-01-01');
    const mockEndDate = new Date('2025-12-31');

    const mockRequirement1 = new Requirement();
    const mockRequirement2 = new Requirement();
    const mockStudent = new Student();
    const mockProfessor = new Professor();
    const mockPeriod = new Period();
    const mockAssistanceApplication1 = new AssistanceApplication();
    const mockAssistanceApplication2 = new AssistanceApplication();

    const graduatedAssistance = new GraduatedAssistance();
    graduatedAssistance.title = mockTitle;
    graduatedAssistance.category = mockCategory;
    graduatedAssistance.description = mockDescription;
    graduatedAssistance.startDate = mockStartDate;
    graduatedAssistance.endDate = mockEndDate;
    graduatedAssistance.requirements = [mockRequirement1, mockRequirement2];
    graduatedAssistance.assistant = mockStudent;
    graduatedAssistance.professor = mockProfessor;
    graduatedAssistance.period = mockPeriod;
    graduatedAssistance.assistanceApplications = [
      mockAssistanceApplication1,
      mockAssistanceApplication2,
    ];

    expect(graduatedAssistance).toBeInstanceOf(GraduatedAssistance);
    expect(graduatedAssistance.title).toBe(mockTitle);
    expect(graduatedAssistance.category).toBe(mockCategory);
    expect(graduatedAssistance.description).toBe(mockDescription);
    expect(graduatedAssistance.startDate).toBe(mockStartDate);
    expect(graduatedAssistance.endDate).toBe(mockEndDate);
    expect(graduatedAssistance.requirements).toHaveLength(2);
    expect(graduatedAssistance.requirements[0]).toBeInstanceOf(Requirement);
    expect(graduatedAssistance.requirements[1]).toBeInstanceOf(Requirement);
    expect(graduatedAssistance.assistant).toBeInstanceOf(Student);
    expect(graduatedAssistance.professor).toBeInstanceOf(Professor);
    expect(graduatedAssistance.period).toBeInstanceOf(Period);
    expect(graduatedAssistance.assistanceApplications).toHaveLength(2);
    expect(graduatedAssistance.assistanceApplications[0]).toBeInstanceOf(
      AssistanceApplication,
    );
    expect(graduatedAssistance.assistanceApplications[1]).toBeInstanceOf(AssistanceApplication);
  });
});
