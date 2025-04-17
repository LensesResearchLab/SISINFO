import 'reflect-metadata';
import { Task } from './task.entity';
import { Document } from '../../documents/entities/document.entity';
import { ImportantDate } from '../../important-dates/entities/important-date.entity';
import { Professor } from '../../professors/entities/professor.entity';
import { Coordinator } from '../../coordinators/entities/coordinator.entity';
import { Student } from '../../students/entities/student.entity';

describe('Task Entity', () => {
  it('should create a Task with expected properties and relationships', () => {
    const mockDocument = new Document();
    const mockImportantDate = new ImportantDate();
    const mockProfessor = new Professor();
    const mockCoordinator = new Coordinator();
    const mockStudent = new Student();

    const task = new Task();
    task.completed = true;
    task.document = mockDocument;
    task.date = mockImportantDate;
    task.professor = mockProfessor;
    task.coordinator = mockCoordinator;
    task.student = mockStudent;

    expect(task).toBeInstanceOf(Task);
    expect(task.completed).toBe(true);
    expect(task.document).toBeInstanceOf(Document);
    expect(task.date).toBeInstanceOf(ImportantDate);
    expect(task.professor).toBeInstanceOf(Professor);
    expect(task.coordinator).toBeInstanceOf(Coordinator);
    expect(task.student).toBeInstanceOf(Student);
  });
});
