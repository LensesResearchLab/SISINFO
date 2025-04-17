import 'reflect-metadata';
import { Section } from './section.entity';
import { TeachingAssistance } from '../../teaching-assistances/entities/teaching-assistance.entity';
import { Period } from '../../periods/entities/period.entity';
import { Course } from '../../courses/entities/course.entity';
import { Professor } from '../../professors/entities/professor.entity';

describe('Section Entity', () => {
  it('should create a Section with expected properties and relationships', () => {
    const mockNRC = 'NRC123';
    const mockSection = 'Section A';

    const mockTeachingAssistance1 = new TeachingAssistance();
    const mockTeachingAssistance2 = new TeachingAssistance();
    const mockPeriod = new Period();
    const mockCourse = new Course();
    const mockProfessor1 = new Professor();
    const mockProfessor2 = new Professor();

    const section = new Section();
    section.NRC = mockNRC;
    section.section = mockSection;
    section.teaching_assistances = [
      mockTeachingAssistance1,
      mockTeachingAssistance2,
    ];
    section.period = mockPeriod;
    section.course = mockCourse;
    section.professors = [mockProfessor1, mockProfessor2];
    section.supportProfessors = [mockProfessor1];

    expect(section).toBeInstanceOf(Section);
    expect(section.NRC).toBe(mockNRC);
    expect(section.section).toBe(mockSection);
    expect(section.teaching_assistances).toHaveLength(2);
    expect(section.teaching_assistances[0]).toBeInstanceOf(TeachingAssistance);
    expect(section.teaching_assistances[1]).toBeInstanceOf(TeachingAssistance);
    expect(section.period).toBeInstanceOf(Period);
    expect(section.course).toBeInstanceOf(Course);
    expect(section.professors).toHaveLength(2);
    expect(section.professors[0]).toBeInstanceOf(Professor);
    expect(section.professors[1]).toBeInstanceOf(Professor);
    expect(section.supportProfessors).toHaveLength(1);
    expect(section.supportProfessors[0]).toBeInstanceOf(Professor);
  });
});
