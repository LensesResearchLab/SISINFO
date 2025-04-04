import { Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { promises as fs } from 'fs';
import * as path from 'path';
import { BillboardsService } from '../billboards/billboards.service';
import { CreateBillboardDto } from '../billboards/dto/create-billboard.dto';
import { PeriodsService } from '../periods/periods.service';
import { CreatePeriodDto } from '../periods/dto/create-period.dto';
import { TeachingAssistancesService } from '../teaching-assistances/teaching-assistances.service';
import { CreateTeachingAssistanceDto } from '../teaching-assistances/dto/create-teaching_assistance.dto';
import { SectionsService } from '../sections/sections.service';
import { CreateSectionDto } from '../sections/dto/create-section.dto';
import { ProfessorsService } from '../professors/professors.service';
import { CreateProfessorDto } from '../professors/dto/create-professor.dto';
import { CoursesService } from '../courses/courses.service';
import { CreateCourseDto } from '../courses/dto/create-course.dto';
import { TagsService } from '../tags/tags.service';
import { CreateTagDto } from '../tags/dto/create-tag.dto';
import { ThesesService } from '../theses/theses.service';
import { ProjectsService } from '../projects/projects.service';
import { RequirementsService } from '../requirements/requirements.service';
import { CreateRequirementDto } from '../requirements/dto/create-requirement.dto';
import { GraduatedAssistancesService } from '../graduated-assistances/graduated-assistances.service';
import { CreateGraduatedAssistanceDto } from '../graduated-assistances/dto/create-graduated_assistance.dto';
import { CoordinatorsService } from '../coordinators/coordinators.service';
import { CreateCoordinatorDto } from '../coordinators/dto/create-coordinator.dto';
import { TasksService } from '../tasks/tasks.service';
import { CreateTaskDto } from '../tasks/dto/create-task.dto';
import { AreasOfInterestService } from '../areas-of-interest/areas-of-interest.service';
import { CreateAreasOfInterestDto } from '../areas-of-interest/dto/create-areas-of-interest.dto';
import { StudentsService } from '../students/students.service';
import { CreateStudentDto } from '../students/dto/create-student.dto';
import { samplePeriods } from './sample-data/periods.sample';
import { Thesis } from '../theses/entities/thesis.entity';
import { Project } from '../projects/entities/project.entity';
import { sampleRequirements } from './sample-data/requirements.sample';
import { sampleTags } from './sample-data/tags.sample';
import { sampleAreasOfInterest } from './sample-data/areas-of-interest.sample';
import { ProjectApplication } from '../project-applications/entities/project-application.entity';
import { ProjectApplicationsService } from '../project-applications/project-applications.service';
import { ThesisApplicationsService } from '../thesis-applications/thesis-applications.service';
import { AssistanceApplicationsService } from '../assistance-applications/assistance-applications.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { CreateAdministratorDto } from '../administrators/dto/create-administrator.dto';
import { Readable } from 'stream';

@Injectable()
export class SeedService {
  constructor(
    private readonly billboardsService: BillboardsService,
    private readonly periodsService: PeriodsService,
    private readonly teachingAssistancesService: TeachingAssistancesService,
    private readonly sectionsService: SectionsService,
    private readonly professorsService: ProfessorsService,
    private readonly coursesService: CoursesService,
    private readonly tagsService: TagsService,
    private readonly thesesService: ThesesService,
    private readonly projectApplicationsService: ProjectApplicationsService,
    private readonly projectsService: ProjectsService,
    private readonly thesisApplicationsService: ThesisApplicationsService,
    private readonly requirementsService: RequirementsService,
    private readonly graduatedAssistancesService: GraduatedAssistancesService,
    private readonly graduatedAssistanceApplicationsService: AssistanceApplicationsService,
    private readonly coordinatorsService: CoordinatorsService,
    private readonly tasksService: TasksService,
    private readonly areasOfInterestService: AreasOfInterestService,
    private readonly studentsService: StudentsService,
    private readonly usersService: UsersService,
  ) {}

  STUDENTS_NUMBER = 10;
  PROFESSORS_NUMBER = 10;
  COORDINATORS_NUMBER = 3;
  TOTAL_USERS =
    this.STUDENTS_NUMBER + this.PROFESSORS_NUMBER + this.COORDINATORS_NUMBER;
  MAX_THESIS_PER_PROFESSOR = 3;
  MAX_PROJECTS_PER_PROFESSOR = 3;
  GRADUATED_ASSISTANCE_APPLICATIONS_NUMBER = 2;

  async seedBillboard() {
    const billboards: CreateBillboardDto[] = Array.from({ length: 10 }).map(
      () => ({
        publicated: faker.datatype.boolean(),
      }),
    );
    const insertPromises: Promise<CreateBillboardDto>[] = [];
    billboards.forEach((billboard) => {
      insertPromises.push(this.billboardsService.create(billboard));
    });
    await Promise.all(insertPromises);
    return true;
  }

  async seedPeriods() {
    const periods: CreatePeriodDto[] = samplePeriods;
    const insertPromises: Promise<CreatePeriodDto>[] = [];
    periods.forEach((period) => {
      insertPromises.push(this.periodsService.create(period));
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
      status: faker.lorem.word(),
      task: faker.lorem.word(),
      periodTypeDescription: faker.lorem.sentence(),
      grade: faker.number.int({ min: 1, max: 10 }),
      initialDate: faker.date.recent(),
      finalDate: faker.date.recent(),
      weeklyHours: faker.number.int({ min: 1, max: 12 }),
    }));
    const insertPromises: Promise<CreateTeachingAssistanceDto>[] = [];
    teachingAssistances.forEach((teachingAssistance) => {
      insertPromises.push(
        this.teachingAssistancesService.create(teachingAssistance),
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
      insertPromises.push(this.sectionsService.create(section));
    });
    await Promise.all(insertPromises);
    return true;
  }

  async seedProfessors() {
    const professors: CreateProfessorDto[] = Array(this.PROFESSORS_NUMBER)
      .fill(null)
      .map((_, idx) => ({
        document: `Document ${idx}`,
        isActive: faker.datatype.boolean(),
      }));
    const insertPromises: Promise<CreateProfessorDto>[] = [];
    professors.forEach((professor) => {
      insertPromises.push(this.professorsService.create(professor));
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
      insertPromises.push(this.coursesService.create(course));
    });
    await Promise.all(insertPromises);
    return true;
  }

  async seedTags() {
    const tags: CreateTagDto[] = sampleTags;
    const insertPromises: Promise<CreateTagDto>[] = [];
    tags.forEach((tag) => {
      insertPromises.push(this.tagsService.create(tag));
    });
    await Promise.all(insertPromises);
    return true;
  }

  async seedTheses() {
    const insertPromises: Promise<Thesis>[] = [];
    for (let i = 0; i < this.PROFESSORS_NUMBER; i++) {
      for (
        let cnt = 0;
        cnt < this.PROFESSORS_NUMBER % (this.MAX_THESIS_PER_PROFESSOR + 1);
        cnt++
      ) {
        insertPromises.push(
          this.thesesService.create(
            {
              title: faker.lorem.word(),
              description: faker.lorem.sentence(),
              isEnded: faker.datatype.boolean(),
              investigationSubarea: faker.lorem.word(),
            },
            `Document ${i}`,
          ),
        );
      }
    }
    await Promise.all(insertPromises);
    return true;
  }

  async seedProjectApplications() {
    const students = await this.studentsService.findAll();
    const projects = await this.projectsService.findAll();
    const insertPromises: Promise<ProjectApplication>[] = [];
    for (const student of students) {
      const randomProject =
        projects[Math.floor(Math.random() * projects.length)];
      insertPromises.push(
        this.projectApplicationsService.create(
          {
            motivation: faker.lorem.sentence(),
            wasContacted: faker.datatype.boolean(),
          },
          randomProject.id,
          student.document,
        ),
      );
    }
    await Promise.all(insertPromises);
    return true;
  }

  async seedProjects() {
    const categories = ['Investigación', 'Proyecto aplicado a empresas'];
    const periods = await this.periodsService.findAll();
    const insertPromises: Promise<Project>[] = [];
    for (let i = 0; i < this.PROFESSORS_NUMBER; i++) {
      for (
        let cnt = 0;
        cnt <
        this.MAX_PROJECTS_PER_PROFESSOR -
          (i % this.MAX_PROJECTS_PER_PROFESSOR) +
          1;
        cnt++
      ) {
        insertPromises.push(
          this.projectsService.create(
            {
              title: faker.lorem.word(),
              description: faker.lorem.sentence(),
              isEnded: faker.datatype.boolean(),
              maxStudents: faker.number.int({ min: 1, max: 10 }),
              category:
                categories[Math.floor(Math.random() * categories.length)],
            },
            `Document ${i}`,
            periods[Math.floor(Math.random() * periods.length)].id,
          ),
        );
      }
    }
    await Promise.all(insertPromises);
    return true;
  }

  async seedThesisApplications() {
    const students = await this.studentsService.findAll();
    const theses = await this.thesesService.findAll();
    const insertPromises: Promise<ProjectApplication>[] = [];
    for (const student of students) {
      const randomThesis = theses[Math.floor(Math.random() * theses.length)];
      insertPromises.push(
        this.projectApplicationsService.create(
          {
            motivation: faker.lorem.sentence(),
            wasContacted: faker.datatype.boolean(),
          },
          randomThesis.id,
          student.document,
        ),
      );
    }

    return true;
  }

  async seedRequirements() {
    const requirements: CreateRequirementDto[] = sampleRequirements;
    const insertPromises: Promise<CreateRequirementDto>[] = [];
    requirements.forEach((requirement) => {
      insertPromises.push(this.requirementsService.create(requirement));
    });
    await Promise.all(insertPromises);
    return true;
  }

  async seedGraduatedAssistances() {
    const periods = await this.periodsService.findAll();
    const professors = await this.professorsService.findAll();
    const requirements = await this.requirementsService.findAll();
    const randomRequirements = requirements
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 3) + 1)
      .map((req) => req.id);
    const randomPeriod = periods[Math.floor(Math.random() * periods.length)];
    const graduatedAssistances: CreateGraduatedAssistanceDto[] = Array.from({
      length: 10,
    }).map(() => {
      return {
        title: faker.lorem.word(),
        category: faker.lorem.word(),
        description: faker.lorem.sentence(),
        period: randomPeriod,
        requirements: randomRequirements,
        startDate: faker.date.recent(),
        endDate: faker.date.recent(),
      };
    });
    const insertPromises = graduatedAssistances.map((graduatedAssistance) => {
      const randomProfessor =
        professors[Math.floor(Math.random() * professors.length)];
      return this.graduatedAssistancesService.create(
        graduatedAssistance,
        randomProfessor.document,
      );
    });

    await Promise.all(insertPromises);
    return true;
  }

  async seedGraduatedAssistanceApplications() {
    const students = await this.studentsService.findAll();
    const graduatedAssistances =
      await this.graduatedAssistancesService.findAll();

    const filePath = path.join(__dirname, 'sample-data', 'HV_SAMPLE.PDF');

    try {
      const fileBuffer = await fs.readFile(filePath);

      const file: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'HV_SAMPLE.PDF',
        encoding: '7bit',
        mimetype: 'application/pdf',
        size: fileBuffer.length,
        buffer: fileBuffer,
        stream: Readable.from(fileBuffer),
        destination: '',
        filename: '',
        path: '',
      };

      for (let i = 0; i < this.GRADUATED_ASSISTANCE_APPLICATIONS_NUMBER; i++) {
        const randomStudent =
          students[Math.floor(Math.random() * students.length)];
        const randomGraduatedAssistance =
          graduatedAssistances[
            Math.floor(Math.random() * graduatedAssistances.length)
          ];

        await this.graduatedAssistanceApplicationsService.create(
          {},
          randomStudent.document,
          randomGraduatedAssistance.id,
          file,
        );
      }

      return true;
    } catch (error) {
      console.error('Error al leer el archivo:', error);
      return false;
    }
  }

  async seedCoordinator() {
    const coordinators: CreateCoordinatorDto[] = Array(this.COORDINATORS_NUMBER)
      .fill(null)
      .map((_, idx) => ({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        document: `Document ${this.PROFESSORS_NUMBER + this.STUDENTS_NUMBER + idx}`,
        isActive: faker.datatype.boolean(),
      }));
    const insertPromises: Promise<CreateCoordinatorDto>[] = [];
    coordinators.forEach((coordinator) => {
      insertPromises.push(this.coordinatorsService.create(coordinator));
    });
    await Promise.all(insertPromises);
    return true;
  }

  async seedTask() {
    const taskList: CreateTaskDto[] = Array.from({ length: 10 }).map(() => ({
      completed: faker.datatype.boolean(),
    }));
    const insertPromises: Promise<CreateTaskDto>[] = [];
    taskList.forEach((task) => {
      insertPromises.push(this.tasksService.create(task));
    });
    await Promise.all(insertPromises);
    return true;
  }

  async seedAreasOfInterest() {
    const areasOfInterest: CreateAreasOfInterestDto[] = sampleAreasOfInterest;
    const insertPromises: Promise<CreateAreasOfInterestDto>[] = [];
    areasOfInterest.forEach((areasOfInterest) => {
      insertPromises.push(this.areasOfInterestService.create(areasOfInterest));
    });
    await Promise.all(insertPromises);
    return true;
  }

  async seedUsers() {
    const users: CreateUserDto[] = Array(this.TOTAL_USERS)
      .fill(null)
      .map((_, idx) => ({
        document: `Document ${idx}`,
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      }));

    const insertPromises: Promise<User>[] = [];
    users.forEach((user) => {
      insertPromises.push(this.usersService.create(user));
    });
    await Promise.all(insertPromises);
    return true;
  }

  async seedAdmin() {
    const adminRaw = {
      document: 'admin',
      name: 'admin',
      email: 'admin@admin.com',
      password: 'admin',
    };
    const admin = await this.usersService.create(adminRaw);
    await this.usersService.assignRole<CreateStudentDto>(admin, 'student', {
      code: 'admin',
      isActive: true,
      isUndergraduate: true,
      document: 'admin',
    });
    await this.usersService.assignRole<CreateCoordinatorDto>(
      admin,
      'coordinator',
      {
        isActive: true,
        document: 'admin',
      },
    );
    await this.usersService.assignRole<CreateProfessorDto>(admin, 'professor', {
      isActive: true,
      document: 'admin',
    });
    await this.usersService.assignRole<CreateAdministratorDto>(
      admin,
      'administrator',
      {
        isActive: true,
      },
    );
    return true;
  }

  async seedStudents() {
    const students: CreateStudentDto[] = Array(this.STUDENTS_NUMBER)
      .fill(null)
      .map((_, idx) => ({
        document: `Document ${this.PROFESSORS_NUMBER + idx}`,
        code: faker.string.uuid(),
        semester: faker.number.int({ min: 1, max: 2 }),
        isUndergraduate: faker.datatype.boolean(),
        isTeachingAssistant: faker.datatype.boolean(),
        isActive: faker.datatype.boolean(),
      }));

    const insertPromises: Promise<CreateStudentDto>[] = [];
    students.forEach((student) => {
      insertPromises.push(this.studentsService.create(student));
    });
    await Promise.all(insertPromises);
    return true;
  }

  async executeSeedStatic() {
    await this.seedPeriods();
    await this.seedRequirements();
    await this.seedTags();
    await this.seedAreasOfInterest();
    return 'SEED_EXECUTED';
  }

  async executeSeedUsers() {
    await this.seedUsers();
    await this.seedProfessors();
    await this.seedStudents();
    await this.seedCoordinator();
    await this.seedAdmin();
    return 'SEED_EXECUTED';
  }

  async executeSeedGraduatedAssistance() {
    await this.seedGraduatedAssistances();
    await this.seedGraduatedAssistanceApplications();
    return 'SEED_EXECUTED';
  }

  async executeSeedProjects() {
    await this.seedProjects();
    await this.seedProjectApplications();
    return 'SEED_EXECUTED';
  }

  async executeSeedThesis() {
    await this.seedTheses();
    //await this.seedThesisApplications();
    return 'SEED_EXECUTED';
  }

  async executeSeedCourses() {
    await this.seedCourse();
    await this.seedBillboard();
    await this.seedSection();
    return 'SEED_EXECUTED';
  }

  async executeTaskAndTas() {
    await this.seedTeachingAssistance();
    await this.seedTask();
    return 'SEED_EXECUTED';
  }
}
