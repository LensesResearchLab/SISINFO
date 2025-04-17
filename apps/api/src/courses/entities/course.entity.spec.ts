import 'reflect-metadata';
import { Course } from './course.entity';
import { Billboard } from '../../billboards/entities/billboard.entity';
import { Professor } from '../../professors/entities/professor.entity';
import { Section } from '../../sections/entities/section.entity';
import { Student } from '../../students/entities/student.entity';
import { Document } from '../../documents/entities/document.entity';

describe('Course Entity', () => {
  it('should create a Course with expected properties', () => {
    const mockCode = '3710';
    const mockDepartament = 'Systems and computing engineering';
    const mockName = 'Web';
    const mockCredits = 3;

    const mockBillboard = new Billboard();
    const mockProfessor = new Professor();
    const mockSection1 = new Section();
    const mockSection2 = new Section();
    const mockStudent1 = new Student();
    const mockStudent2 = new Student();
    const mockDocument = new Document();

    const course = new Course();
    course.code = mockCode;
    course.departament = mockDepartament;
    course.name = mockName;
    course.credits = mockCredits;
    course.billboard = mockBillboard;
    course.mainProfessor = mockProfessor;
    course.sections = [mockSection1, mockSection2];
    course.students = [mockStudent1, mockStudent2];
    course.otherStudents = [mockStudent1];
    course.program = mockDocument;

    expect(course).toBeInstanceOf(Course);
    expect(course.code).toBe(mockCode);
    expect(course.departament).toBe(mockDepartament);
    expect(course.name).toBe(mockName);
    expect(course.credits).toBe(mockCredits);
    expect(course.billboard).toBeInstanceOf(Billboard);
    expect(course.mainProfessor).toBeInstanceOf(Professor);
    expect(course.sections).toHaveLength(2);
    expect(course.sections[0]).toBeInstanceOf(Section);
    expect(course.sections[1]).toBeInstanceOf(Section);
    expect(course.students).toHaveLength(2);
    expect(course.students[0]).toBeInstanceOf(Student);
    expect(course.students[1]).toBeInstanceOf(Student);
    expect(course.otherStudents).toHaveLength(1);
    expect(course.otherStudents[0]).toBeInstanceOf(Student);
    expect(course.program).toBeInstanceOf(Document);
  });
});
