import 'reflect-metadata';
import { Task } from './task.entity';
import { Document } from '../../documents/entities/document.entity';
import { ImportantDate } from '../../important-dates/entities/important-date.entity';
import { Professor } from '../../professors/entities/professor.entity';
import { Student } from '../../students/entities/student.entity';
import { ProjectApplication } from '../../project-applications/entities/project-application.entity';
import { TaskType } from '../enums/taskType';

describe('Task Entity', () => {
  it('should create a Task with expected properties and relationships', () => {
    const mockDocument = new Document();
    const mockImportantDate = new ImportantDate();
    const mockProfessor = new Professor();
    const mockStudent = new Student();
    const mockProjectApplication = new ProjectApplication();

    const task = new Task();
    task.type = TaskType.SEND_APPROVE;
    task.comment = 'This is a comment';
    task.approved = true;
    task.flow = 'approval-flow';
    task.document = mockDocument;
    task.date = mockImportantDate;
    task.professor = mockProfessor;
    task.student = mockStudent;
    task.projectPreviousTasks = mockProjectApplication;
    task.projectActualTask = mockProjectApplication;

    expect(task).toBeInstanceOf(Task);
    expect(task.type).toBe(TaskType.SEND_APPROVE);
    expect(task.comment).toBe('This is a comment');
    expect(task.approved).toBe(true);
    expect(task.flow).toBe('approval-flow');
    expect(task.document).toBe(mockDocument);
    expect(task.date).toBe(mockImportantDate);
    expect(task.professor).toBe(mockProfessor);
    expect(task.student).toBe(mockStudent);
    expect(task.projectPreviousTasks).toBe(mockProjectApplication);
    expect(task.projectActualTask).toBe(mockProjectApplication);
  });
});
