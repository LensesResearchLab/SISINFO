import 'reflect-metadata';
import { AssistanceApplication } from './assistance-application.entity';
import { AssistanceStatusEnum } from '../enums/assistance_status.enum';
import { Student } from '../../students/entities/student.entity';
import { GraduatedAssistance } from '../../graduated-assistances/entities/graduated-assistance.entity';
import { Document } from '../../documents/entities/document.entity';

describe('AssistanceApplication Entity', () => {
  it('should create an AssistanceApplication with expected properties', () => {
    const mockStatus = AssistanceStatusEnum.ACEPTADO;
    const mockStudent = new Student();
    const mockGraduatedAssistance = new GraduatedAssistance();
    const mockDocument = new Document();

    const application = new AssistanceApplication();
    application.status = mockStatus;
    application.student = mockStudent;
    application.graduatedAssistance = mockGraduatedAssistance;
    application.document = mockDocument;

    expect(application).toBeInstanceOf(AssistanceApplication);
    expect(application.status).toBe(mockStatus);
    expect(application.student).toBeInstanceOf(Student);
    expect(application.graduatedAssistance).toBeInstanceOf(GraduatedAssistance);
    expect(application.document).toBeInstanceOf(Document);
  });
});
