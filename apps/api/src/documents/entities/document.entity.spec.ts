import 'reflect-metadata';
import { Document } from './document.entity';
import { Task } from '../../tasks/entities/task.entity';
import { AssistanceApplication } from '../../assistance-applications/entities/assistance-application.entity';
import { Course } from '../../courses/entities/course.entity';

describe('Document Entity', () => {
  it('should create a Document with expected properties and relationships', () => {
    const mockName = 'Document 1';
    const mockFile = Buffer.from('mock file content');

    const mockTask = new Task();
    const mockAssistanceApplication = new AssistanceApplication();
    const mockCourse = new Course();

    const document = new Document();
    document.name = mockName;
    document.file = mockFile;
    document.task = mockTask;
    document.assistanceApplication = mockAssistanceApplication;
    document.course = mockCourse;

    expect(document).toBeInstanceOf(Document);
    expect(document.name).toBe(mockName);
    expect(document.file).toBe(mockFile);
    expect(document.task).toBeInstanceOf(Task);
    expect(document.assistanceApplication).toBeInstanceOf(
      AssistanceApplication,
    );
    expect(document.course).toBeInstanceOf(Course);
  });
});
