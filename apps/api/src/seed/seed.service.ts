import { Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';

import { BillboardsService } from 'src/billboards/billboards.service';
import { CreateBillboardDto } from 'src/billboards/dto/create-billboard.dto';
import { PeriodsService } from 'src/periods/periods.service';
import { CreatePeriodDto } from 'src/periods/dto/create-period.dto';
import { TeachingAssistancesService } from 'src/teaching_assistances/teaching_assistances.service';
import { CreateTeachingAssistanceDto } from 'src/teaching_assistances/dto/create-teaching_assistance.dto';
import { SectionsService } from 'src/sections/sections.service';
import { CreateSectionDto } from 'src/sections/dto/create-section.dto';
import { ProfessorsService } from 'src/professors/professors.service';
import { CreateProfessorDto } from 'src/professors/dto/create-professor.dto';
import { CoursesService } from 'src/courses/courses.service';
import { CreateCourseDto } from 'src/courses/dto/create-course.dto';
import { TagsService } from 'src/tags/tags.service';
import { CreateTagDto } from 'src/tags/dto/create-tag.dto';
import { ThesesService } from 'src/theses/theses.service';
import { CreateThesisDto } from 'src/theses/dto/create-thesis.dto';
import { ProjectsService } from 'src/projects/projects.service';
import { CreateProjectDto } from 'src/projects/dto/create-project.dto';
import { RequirementsService } from 'src/requirements/requirements.service';
import { CreateRequirementDto } from 'src/requirements/dto/create-requirement.dto';
import { GraduatedAssistancesService } from 'src/graduated_assistances/graduated_assistances.service';
import { CreateGraduatedAssistanceDto } from 'src/graduated_assistances/dto/create-graduated_assistance.dto';
import { CoordinatorsService } from 'src/coordinators/coordinators.service';
import { CreateCoordinatorDto } from 'src/coordinators/dto/create-coordinator.dto';
import { TasksService } from 'src/tasks/tasks.service';
import { CreateTaskDto } from 'src/tasks/dto/create-task.dto';
import { AlertsProjectService } from 'src/alerts-project/alerts-project.service';
import { CreateAlertProjectDto } from 'src/alerts-project/dto/create-alert-project.dto';
import { AlertsProfessorService } from 'src/alerts-professor/alerts-professor.service';
import { CreateAlertProfessorDto } from 'src/alerts-professor/dto/create-alert-professor.dto';
import { AreasOfInterestService } from 'src/areas_of_interest/areas_of_interest.service';
import { CreateAreasOfInterestDto } from 'src/areas_of_interest/dto/create-areas_of_interest.dto';
import { StudentsService } from 'src/students/students.service';
import { CreateStudentDto } from 'src/students/dto/create-student.dto';

@Injectable()
export class SeedService {
  constructor(
    private readonly billboardService: BillboardsService,
    private readonly periodService: PeriodsService,
    private readonly teachingAssistanceService: TeachingAssistancesService,
    private readonly sectionService: SectionsService,
    private readonly professorService: ProfessorsService,
    private readonly courseService: CoursesService,
    private readonly tagService: TagsService,
    private readonly thesisService: ThesesService,
    private readonly projectService: ProjectsService,
    private readonly requirementService: RequirementsService,
    private readonly graduatedAssistanceService: GraduatedAssistancesService,
    private readonly coordinatorService: CoordinatorsService,
    private readonly taskService: TasksService,
    private readonly alertProjectService: AlertsProjectService,
    private readonly alertProfessorService: AlertsProfessorService,
    private readonly areasOfInterestService: AreasOfInterestService,
    private readonly studentService: StudentsService,
  ) {}

  async seedBillboard() {
    const billboards: CreateBillboardDto[] = Array.from({ length: 10 }).map(
      () => ({
        publicated: faker.datatype.boolean(),
      }),
    );
    const insertPromises: Promise<CreateBillboardDto>[] = [];
    billboards.forEach((billboard) => {
      insertPromises.push(this.billboardService.create(billboard));
    });
    await Promise.all(insertPromises);
    return true;
  }

  async seedPeriod() {
    const periods: CreatePeriodDto[] = Array.from({ length: 10 }).map(() => ({
      period: faker.number.int({ min: 10, max: 20 }).toString(),
      year: faker.number.int({ min: 2022, max: 2026 }),
      semester: faker.number.int({ min: 1, max: 2 }),
    }));
    periods.push({ period: '10', year: 2025, semester: 1 });
    const insertPromises: Promise<CreatePeriodDto>[] = [];
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
    const insertPromises: Promise<CreateTeachingAssistanceDto>[] = [];
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
    const insertPromises: Promise<CreateSectionDto>[] = [];
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
    const insertPromises: Promise<CreateProfessorDto>[] = [];
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
      semester: faker.number.int({ min: 1, max: 2 }),
      departament: faker.lorem.word(),
    }));
    const insertPromises: Promise<CreateCourseDto>[] = [];
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
    const insertPromises: Promise<CreateTagDto>[] = [];
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
    const insertPromises: Promise<CreateThesisDto>[] = [];
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
    const insertPromises: Promise<CreateProjectDto>[] = [];
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
    const insertPromises: Promise<CreateRequirementDto>[] = [];
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
    const requirements = await this.requirementService.findAll();

    const graduatedAssistances: CreateGraduatedAssistanceDto[] = Array.from({
      length: 10,
    }).map(() => {
      const professor =
        professors[Math.floor(Math.random() * professors.length)];
      const student = students[Math.floor(Math.random() * students.length)];
      const period = periods[Math.floor(Math.random() * periods.length)];

      const selectedRequirements = requirements
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 3) + 1)
        .map((req) => req.id);

      return {
        title: faker.lorem.word(),
        category: faker.lorem.word(),
        description: faker.lorem.sentence(),
        assistantId: student.document,
        professorId: professor.document,
        periodId: period.id,
        requirementsId: selectedRequirements,
      };
    });

    const insertPromises = graduatedAssistances.map((graduatedAssistance) =>
      this.graduatedAssistanceService.create(graduatedAssistance),
    );

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
    const insertPromises: Promise<CreateCoordinatorDto>[] = [];
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
    const insertPromises: Promise<CreateTaskDto>[] = [];
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
    const insertPromises: Promise<CreateAlertProjectDto>[] = [];
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
    const insertPromises: Promise<CreateAlertProfessorDto>[] = [];
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
    const insertPromises: Promise<CreateAreasOfInterestDto>[] = [];
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
      semester: faker.number.int({ min: 1, max: 2 }),
      isUndergraduate: faker.datatype.boolean(),
      isTeachingAssistant: faker.datatype.boolean(),
    }));
    const insertPromises: Promise<CreateStudentDto>[] = [];
    students.forEach((student) => {
      insertPromises.push(this.studentService.create(student));
    });
    await Promise.all(insertPromises);
    return true;
  }

  async executeSeed() {
    await this.seedStudent();
    await this.seedBillboard();
    await this.seedPeriod();
    await this.seedTeachingAssistance();
    await this.seedSection();
    await this.seedProfessor();
    await this.seedCourse();
    await this.seedTag();
    await this.seedThesis();
    await this.seedProject();
    await this.seedRequirement();
    await this.seedCoordinator();
    await this.seedTask();
    await this.seedAlertProject();
    await this.seedAlertProfessor();
    await this.seedAreasOfInterest();
    await this.seedGraduatedAssistance();
    return 'SEED_EXECUTED';
  }
}
