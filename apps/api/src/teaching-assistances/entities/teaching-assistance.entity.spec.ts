import 'reflect-metadata';
import { TeachingAssistance } from './teaching-assistance.entity';
import { Student } from '../../students/entities/student.entity';
import { Section } from '../../sections/entities/section.entity';

describe('TeachingAssistance Entity', () => {
  it('should create a TeachingAssistance with expected properties and relationships', () => {
    const mockStudent = new Student();
    const mockSection = new Section();

    const assistance = new TeachingAssistance();
    assistance.task = 'Support lab sessions';
    assistance.status = 'In Progress';
    assistance.periodTypeDescription = 'First semester';
    assistance.finalDate = new Date('2025-07-01');
    assistance.initialDate = new Date('2025-03-01');
    assistance.weeklyHours = 10;
    assistance.description = 'Assisting in lab and grading';
    assistance.grade = 18;
    assistance.student = mockStudent;
    assistance.section = mockSection;

    expect(assistance).toBeInstanceOf(TeachingAssistance);
    expect(assistance.task).toBe('Support lab sessions');
    expect(assistance.status).toBe('In Progress');
    expect(assistance.periodTypeDescription).toBe('First semester');
    expect(assistance.finalDate).toEqual(new Date('2025-07-01'));
    expect(assistance.initialDate).toEqual(new Date('2025-03-01'));
    expect(assistance.weeklyHours).toBe(10);
    expect(assistance.description).toBe('Assisting in lab and grading');
    expect(assistance.grade).toBe(18);
    expect(assistance.student).toBeInstanceOf(Student);
    expect(assistance.section).toBeInstanceOf(Section);
  });
});
