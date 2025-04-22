import 'reflect-metadata';
import { ThesisApplication } from './thesis-application.entity';
import { Student } from '../../students/entities/student.entity';
import { Thesis } from '../../theses/entities/thesis.entity';
import { ThesisStatusEnum } from '../enums/thesis_status.enum';

describe('ThesisApplication Entity', () => {
  it('should create a ThesisApplication with default and assigned values', () => {
    const mockStudent = new Student();
    const mockThesis = new Thesis();

    const application = new ThesisApplication();
    application.status = ThesisStatusEnum.APPLICANT;
    application.student = mockStudent;
    application.thesis = mockThesis;

    expect(application).toBeInstanceOf(ThesisApplication);
    expect(application.status).toBe(ThesisStatusEnum.APPLICANT);
    expect(application.student).toBe(mockStudent);
    expect(application.thesis).toBe(mockThesis);
  });
});
