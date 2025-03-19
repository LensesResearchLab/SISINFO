import { Injectable } from '@nestjs/common';

import { AlertProfessorService } from 'src/alert-professor/alert-professor.service';
import { AlertProjectService } from 'src/alert-project/alert-project.service';
import { AreasOfInterestService } from 'src/areas_of_interest/areas_of_interest.service';
import { BillboardService } from 'src/billboard/billboard.service';
import { CoordinatorService } from 'src/coordinator/coordinator.service';
import { CourseService } from 'src/course/course.service';
import { GraduatedAssistanceService } from 'src/graduated_assistance/graduated_assistance.service';
import { PeriodService } from 'src/period/period.service';
import { ProfessorService } from 'src/professor/professor.service';
import { ProjectService } from 'src/project/project.service';
import { RequirementService } from 'src/requirement/requirement.service';
import { SectionService } from 'src/section/section.service';
import { TagService } from 'src/tag/tag.service';
import { TaskService } from 'src/task/task.service';
import { TeachingAssistanceService } from 'src/teaching_assistance/teaching_assistance.service';
import { ThesisService } from 'src/thesis/thesis.service';
import { StudentService } from 'src/student/student.service';
import { faker } from '@faker-js/faker';

import { CreateStudentDto } from 'src/student/dto/create-student.dto';
import { Student } from 'src/student/entities/student.entity';
import { AreasOfInterest } from 'src/areas_of_interest/entities/areas_of_interest.entity';
import { CreateAreasOfInterestDto } from 'src/areas_of_interest/dto/create-areas_of_interest.dto';
import { CreateAlertProfessorDto } from 'src/alert-professor/dto/create-alert-professor.dto';
import { AlertProfessor } from 'src/alert-professor/entities/alert-professor.entity';
import { CreateAlertProjectDto } from 'src/alert-project/dto/create-alert-project.dto';
import { AlertProject } from 'src/alert-project/entities/alert-project.entity';
import { Task } from 'src/task/entities/task.entity';
import { CreateTaskDto } from 'src/task/dto/create-task.dto';
import { Coordinator } from 'src/coordinator/entities/coordinator.entity';
import { CreateCoordinatorDto } from 'src/coordinator/dto/create-coordinator.dto';
import { CreateGraduatedAssistanceDto } from 'src/graduated_assistance/dto/create-graduated_assistance.dto';
import { GraduatedAssistance } from 'src/graduated_assistance/entities/graduated_assistance.entity';
import { CreateRequirementDto } from 'src/requirement/dto/create-requirement.dto';
import { Requirement } from 'src/requirement/entities/requirement.entity';
import { CreateProjectDto } from 'src/project/dto/create-project.dto';
import { Project } from 'src/project/entities/project.entity';
import { Thesis } from 'src/thesis/entities/thesis.entity';
import { CreateThesisDto } from 'src/thesis/dto/create-thesis.dto';
import { CreateTagDto } from 'src/tag/dto/create-tag.dto';
import { Tag } from 'src/tag/entities/tag.entity';
import { CreateCourseDto } from 'src/course/dto/create-course.dto';
import { Course } from 'src/course/entities/course.entity';
import { CreateProfessorDto } from 'src/professor/dto/create-professor.dto';
import { Professor } from 'src/professor/entities/professor.entity';
import { Section } from 'src/section/entities/section.entity';
import { CreateSectionDto } from 'src/section/dto/create-section.dto';
import { CreateTeachingAssistanceDto } from 'src/teaching_assistance/dto/create-teaching_assistance.dto';
import { TeachingAssistance } from 'src/teaching_assistance/entities/teaching_assistance.entity';
import { CreatePeriodDto } from 'src/period/dto/create-period.dto';
import { Period } from 'src/period/entities/period.entity';
import { Billboard } from 'src/billboard/entities/billboard.entity';
import { CreateBillboardDto } from 'src/billboard/dto/create-billboard.dto';

@Injectable()
export class SeedService {
  constructor(
    private readonly billboardService: BillboardService,
    private readonly periodService: PeriodService,
    private readonly teachingAssistanceService: TeachingAssistanceService,
    private readonly sectionService: SectionService,
    private readonly professorService: ProfessorService,
    private readonly courseService: CourseService,
    private readonly tagService: TagService,
    private readonly thesisService: ThesisService,
    private readonly projectService: ProjectService,
    private readonly requirementService: RequirementService,
    private readonly graduatedAssistanceService: GraduatedAssistanceService,
    private readonly coordinatorService: CoordinatorService,
    private readonly taskService: TaskService,
    private readonly alertProjectService: AlertProjectService,
    private readonly alertProfessorService: AlertProfessorService,
    private readonly areasOfInterestService: AreasOfInterestService,
    private readonly studentService: StudentService,
  ) {}

  async seedBillboard() {
    const billboards: CreateBillboardDto[] = Array.from({ length: 10 }).map(
      () => ({
        publicated: faker.datatype.boolean(),
      }),
    );
    const insertPromises: Promise<Billboard>[] = [];
    billboards.forEach((billboard) => {
      insertPromises.push(this.billboardService.create(billboard));
    });
    await Promise.all(insertPromises);
    return true;
  }

  async seedPeriod() {
    const periods: CreatePeriodDto[] = Array.from({ length: 10 }).map(() => ({
      period: faker.lorem.word(),
      year: faker.number.int({ min: 2000, max: 2022 }),
      semester: faker.number.int({ min: 1, max: 8 }),
    }));
    const insertPromises: Promise<Period>[] = [];
    periods.forEach((period) => {
      insertPromises.push(this.periodService.create(period));
    });
    await Promise.all(insertPromises);
    return true;
  }

  async seedTeachingAssistance() {
    const teachingAssistances: CreateTeachingAssistanceDto[] = Array.from({
      length: 10,
    }).map(() => ({
      title: faker.lorem.word(),
      clasification: faker.lorem.word(),
      description: faker.lorem.sentence(),
      name: faker.person.fullName(),
      status: faker.lorem.word(),
      task: faker.lorem.word(),
      period_type_description: faker.lorem.sentence(),
      grade: faker.number.int({ min: 1, max: 10 }),
      initial_date: faker.date.recent(),
      final_date: faker.date.recent(),
      weekly_hours: faker.number.int({ min: 1, max: 12 }),
    }));
    const insertPromises: Promise<TeachingAssistance>[] = [];
    teachingAssistances.forEach((teachingAssistance) => {
      insertPromises.push(
        this.teachingAssistanceService.create(teachingAssistance),
      );
    });
    await Promise.all(insertPromises);
    return true;
  }

  async seedSection() {
    const sections: CreateSectionDto[] = Array.from({ length: 10 }).map(() => ({
      NRC: faker.number.int({ min: 10000, max: 99999 }),
      section: faker.number.int({ min: 1, max: 100 }),
    }));
    const insertPromises: Promise<Section>[] = [];
    sections.forEach((section) => {
      insertPromises.push(this.sectionService.create(section));
    });
    await Promise.all(insertPromises);
    return true;
  }

  async seedProfessor() {
    const professors: CreateProfessorDto[] = Array.from({ length: 10 }).map(
      () => ({
        document: faker.string.uuid(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
      }),
    );
    const insertPromises: Promise<Professor>[] = [];
    professors.forEach((professor) => {
      insertPromises.push(this.professorService.create(professor));
    });
    await Promise.all(insertPromises);
    return true;
  }

  async seedCourse() {
    const courses: CreateCourseDto[] = Array.from({ length: 10 }).map(() => ({
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
      code: faker.lorem.word(),
      credits: faker.number.int({ min: 1, max: 10 }),
      hours: faker.number.int({ min: 1, max: 10 }),
      semester: faker.number.int({ min: 1, max: 8 }),
      departament: faker.lorem.word(),
    }));
    const insertPromises: Promise<Course>[] = [];
    courses.forEach((course) => {
      insertPromises.push(this.courseService.create(course));
    });
    await Promise.all(insertPromises);
    return true;
  }

  async seedTag() {
    const tags: CreateTagDto[] = Array.from({ length: 10 }).map(() => ({
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
    }));
    const insertPromises: Promise<Tag>[] = [];
    tags.forEach((tag) => {
      insertPromises.push(this.tagService.create(tag));
    });
    await Promise.all(insertPromises);
    return true;
  }

  async seedThesis() {
    const theses: CreateThesisDto[] = Array.from({ length: 10 }).map(() => ({
      title: faker.lorem.word(),
      description: faker.lorem.sentence(),
      status: faker.lorem.word(),
      category: faker.lorem.word(),
      investigation_subarea: faker.lorem.word(),
    }));
    const insertPromises: Promise<Thesis>[] = [];
    theses.forEach((thesis) => {
      insertPromises.push(this.thesisService.create(thesis));
    });
    await Promise.all(insertPromises);
    return true;
  }

  async seedProject() {
    const projects: CreateProjectDto[] = Array.from({ length: 10 }).map(() => ({
      title: faker.lorem.word(),
      description: faker.lorem.sentence(),
      status: faker.lorem.word(),
      category: faker.lorem.word(),
      max_students: faker.number.int({ min: 1, max: 10 }),
    }));
    const insertPromises: Promise<Project>[] = [];
    projects.forEach((project) => {
      insertPromises.push(this.projectService.create(project));
    });
    await Promise.all(insertPromises);
    return true;
  }

  async seedRequirement() {
    const graduated_assistances =
      await this.graduatedAssistanceService.findAll();
    const grad_assistance =
      graduated_assistances[
        Math.floor(Math.random() * graduated_assistances.length)
      ];
    const requirements: CreateRequirementDto[] = Array.from({ length: 10 }).map(
      () => ({
        name: faker.lorem.word(),
        description: faker.lorem.sentence(),
        assistance: grad_assistance,
      }),
    );
    const insertPromises: Promise<Requirement>[] = [];
    requirements.forEach((requirement) => {
      insertPromises.push(this.requirementService.create(requirement));
    });
    await Promise.all(insertPromises);
    return true;
  }

  async seedGraduatedAssistance() {
    const professors = await this.professorService.findAll();
    const students = await this.studentService.findAll();
    const periods = await this.periodService.findAll();

    const graduatedAssistances: Partial<GraduatedAssistance>[] = Array.from({
      length: 10,
    }).map(() => {
      const professor =
        professors[Math.floor(Math.random() * professors.length)];
      const student = students[Math.floor(Math.random() * students.length)];
      const period = periods[Math.floor(Math.random() * periods.length)];
      return {
        title: faker.lorem.word(),
        clasification: faker.lorem.word(),
        description: faker.lorem.sentence(),
        assistant: student,
        professor: professor,
        period: period,
      };
    });

    const insertPromises: Promise<GraduatedAssistance>[] = [];
    graduatedAssistances.forEach((graduatedAssistance) => {
      insertPromises.push(
        this.graduatedAssistanceService.create(
          graduatedAssistance as CreateGraduatedAssistanceDto,
        ),
      );
    });
    await Promise.all(insertPromises);
    return true;
  }

  async seedCoordinator() {
    const coordinators: CreateCoordinatorDto[] = Array.from({ length: 10 }).map(
      () => ({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        document: faker.string.uuid(),
      }),
    );
    const insertPromises: Promise<Coordinator>[] = [];
    coordinators.forEach((coordinator) => {
      insertPromises.push(this.coordinatorService.create(coordinator));
    });
    await Promise.all(insertPromises);
    return true;
  }

  async seedTask() {
    const taskList: CreateTaskDto[] = Array.from({ length: 10 }).map(
      () => ({}),
    );
    const insertPromises: Promise<Task>[] = [];
    taskList.forEach((task) => {
      insertPromises.push(this.taskService.create(task));
    });
    await Promise.all(insertPromises);
    return true;
  }

  async seedAlertProject() {
    const projectAlerts: CreateAlertProjectDto[] = Array.from({
      length: 10,
    }).map(() => ({}));
    const insertPromises: Promise<AlertProject>[] = [];
    projectAlerts.forEach((alert) => {
      insertPromises.push(this.alertProjectService.create(alert));
    });
    await Promise.all(insertPromises);
    return true;
  }

  async seedAlertProfessor() {
    const professorAlerts: CreateAlertProfessorDto[] = Array.from({
      length: 10,
    }).map(() => ({}));
    const insertPromises: Promise<AlertProfessor>[] = [];
    professorAlerts.forEach((alert) => {
      insertPromises.push(this.alertProfessorService.create(alert));
    });
    await Promise.all(insertPromises);
    return true;
  }

  async seedAreasOfInterest() {
    const areasOfInterest: CreateAreasOfInterestDto[] = Array.from({
      length: 10,
    }).map(() => ({
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
    }));
    const insertPromises: Promise<AreasOfInterest>[] = [];
    areasOfInterest.forEach((areasOfInterest) => {
      insertPromises.push(this.areasOfInterestService.create(areasOfInterest));
    });
    await Promise.all(insertPromises);
    return true;
  }

  async seedStudent() {
    const students: CreateStudentDto[] = Array.from({ length: 10 }).map(() => ({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      code: faker.string.uuid(),
      password: faker.internet.password(),
      document: faker.string.uuid(),
      semester: faker.number.int({ min: 1, max: 8 }),
      isUndergraduate: faker.datatype.boolean(),
      isTeachingAssistant: faker.datatype.boolean(),
    }));
    const insertPromises: Promise<Student>[] = [];
    students.forEach((student) => {
      insertPromises.push(this.studentService.create(student));
    });
    await Promise.all(insertPromises);
    return true;
  }

  async executeSeed() {
    await this.seedBillboard();
    await this.seedPeriod();
    await this.seedTeachingAssistance();
    await this.seedSection();
    await this.seedProfessor();
    await this.seedCourse();
    await this.seedTag();
    await this.seedThesis();
    await this.seedProject();
    await this.seedGraduatedAssistance();
    await this.seedRequirement();
    await this.seedCoordinator();
    await this.seedTask();
    await this.seedAlertProject();
    await this.seedAlertProfessor();
    await this.seedAreasOfInterest();
    await this.seedStudent();
    return 'SEED_EXECUTED';
  }
}
