import 'reflect-metadata';
import { TeachingAssistance } from './teaching-assistance.entity';
import { Student } from '../../students/entities/student.entity';
import { Section } from '../../sections/entities/section.entity';
import { Period } from '../../periods/entities/period.entity';

describe('TeachingAssistance Entity', () => {
  it('should create a TeachingAssistance with expected properties and relationships', () => {
    const mockStudent = new Student();
    const mockSection = new Section();
    const mockPeriod = new Period();

    const assistance = new TeachingAssistance();
    assistance.contractNumber = 123456;
    assistance.grade = 18;
    assistance.gradeDescription = 'Excellent performance';
    assistance.student = mockStudent;
    assistance.section = mockSection;
    assistance.period = mockPeriod;

    expect(assistance).toBeInstanceOf(TeachingAssistance);
    expect(assistance.contractNumber).toBe(123456);
    expect(assistance.grade).toBe(18);
    expect(assistance.gradeDescription).toBe('Excellent performance');
    expect(assistance.student).toBeInstanceOf(Student);
    expect(assistance.section).toBeInstanceOf(Section);
    expect(assistance.period).toBeInstanceOf(Period);
  });
});
