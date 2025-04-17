import 'reflect-metadata';
import { Thesis } from './thesis.entity';
import { Student } from '../../students/entities/student.entity';
import { Period } from '../../periods/entities/period.entity';
import { Professor } from '../../professors/entities/professor.entity';
import { Tag } from '../../tags/entities/tag.entity';
import { ThesisApplication } from '../../thesis-applications/entities/thesis-application.entity';

describe('Thesis Entity', () => {
  it('should create a Thesis with expected properties and relationships', () => {
    const mockStudent1 = new Student();
    const mockStudent2 = new Student();
    const mockPeriod = new Period();
    const mockProfessor = new Professor();
    const mockTag1 = new Tag();
    const mockTag2 = new Tag();
    const mockThesisApp1 = new ThesisApplication();
    const mockThesisApp2 = new ThesisApplication();

    const thesis = new Thesis();
    thesis.title = 'Senecare remake';
    thesis.description = 'We need to create senecare again.';
    thesis.investigationSubarea = 'Software';
    thesis.isEnded = false;
    thesis.studentThesis1 = mockStudent1;
    thesis.studentThesis2 = mockStudent2;
    thesis.period = mockPeriod;
    thesis.professor = mockProfessor;
    thesis.tags = [mockTag1, mockTag2];
    thesis.thesisApplications = [mockThesisApp1, mockThesisApp2];

    expect(thesis).toBeInstanceOf(Thesis);
    expect(thesis.title).toBe('Senecare remake');
    expect(thesis.description).toBe('We need to create senecare again.');
    expect(thesis.investigationSubarea).toBe('Software');
    expect(thesis.isEnded).toBe(false);
    expect(thesis.studentThesis1).toBe(mockStudent1);
    expect(thesis.studentThesis2).toBe(mockStudent2);
    expect(thesis.period).toBe(mockPeriod);
    expect(thesis.professor).toBe(mockProfessor);
    expect(thesis.tags).toContain(mockTag1);
    expect(thesis.tags).toContain(mockTag2);
    expect(thesis.thesisApplications.length).toBe(2);
    expect(thesis.thesisApplications[0]).toBeInstanceOf(ThesisApplication);
  });
});
