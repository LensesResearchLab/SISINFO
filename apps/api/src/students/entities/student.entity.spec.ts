import 'reflect-metadata';
import { Student } from './student.entity';
import { User } from '../../users/entities/user.entity';
import { Course } from '../../courses/entities/course.entity';
import { Thesis } from '../../theses/entities/thesis.entity';
import { Project } from '../../projects/entities/project.entity';
import { ThesisApplication } from '../../thesis-applications/entities/thesis-application.entity';
import { ProjectApplication } from '../../project-applications/entities/project-application.entity';
import { AssistanceApplication } from '../../assistance-applications/entities/assistance-application.entity';
import { TeachingAssistance } from '../../teaching-assistances/entities/teaching-assistance.entity';
import { Task } from '../../tasks/entities/task.entity';
import { GraduatedAssistance } from '../../graduated-assistances/entities/graduated-assistance.entity';

describe('Student Entity', () => {
  it('should create a Student with expected properties and relationships', () => {
    const mockCode = '202210720';
    const mockIsUndergraduate = true;

    const mockUser = new User();
    const mockCourse = new Course();
    const mockThesis = new Thesis();
    const mockProject = new Project();
    const mockThesisApplication = new ThesisApplication();
    const mockProjectApplication = new ProjectApplication();
    const mockAssistance = new GraduatedAssistance();
    const mockTeachingAssistance = new TeachingAssistance();
    const mockTask = new Task();
    const mockAssistanceApplication = new AssistanceApplication();

    const student = new Student();
    student.code = mockCode;
    student.isUndergraduate = mockIsUndergraduate;
    student.user = mockUser;
    student.courses = [mockCourse];
    student.otherCourses = [mockCourse];
    student.thesis1 = mockThesis;
    student.thesis2 = mockThesis;
    student.project = mockProject;
    student.thesisApplication = mockThesisApplication;
    student.projectApplication = mockProjectApplication;
    student.assistance = mockAssistance;
    student.teachingAssistances = [mockTeachingAssistance];
    student.tasks = [mockTask];
    student.assistanceApplications = [mockAssistanceApplication];

    expect(student).toBeInstanceOf(Student);
    expect(student.code).toBe(mockCode);
    expect(student.isUndergraduate).toBe(mockIsUndergraduate);
    expect(student.courses).toHaveLength(1);
    expect(student.courses[0]).toBeInstanceOf(Course);
    expect(student.otherCourses).toHaveLength(1);
    expect(student.otherCourses[0]).toBeInstanceOf(Course);
    expect(student.thesis1).toBeInstanceOf(Thesis);
    expect(student.thesis2).toBeInstanceOf(Thesis);
    expect(student.project).toBeInstanceOf(Project);
    expect(student.thesisApplication).toBeInstanceOf(ThesisApplication);
    expect(student.projectApplication).toBeInstanceOf(ProjectApplication);
    expect(student.assistance).toBeInstanceOf(GraduatedAssistance);
    expect(student.teachingAssistances).toHaveLength(1);
    expect(student.teachingAssistances[0]).toBeInstanceOf(TeachingAssistance);
    expect(student.tasks).toHaveLength(1);
    expect(student.tasks[0]).toBeInstanceOf(Task);
    expect(student.assistanceApplications).toHaveLength(1);
    expect(student.assistanceApplications[0]).toBeInstanceOf(
      AssistanceApplication,
    );
  });
});
