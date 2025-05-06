import { Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { promises as fs } from 'fs';
import * as path from 'path';

import { BillboardsService } from '../billboards/billboards.service';
import { PeriodsService } from '../periods/periods.service';
import { CreatePeriodDto } from '../periods/dto/create-period.dto';
import { TeachingAssistancesService } from '../teaching-assistances/teaching-assistances.service';
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
import { CreateGraduatedAssistanceDto } from '../graduated-assistances/dto/create-graduated-assistance.dto';
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
import { DocumentsService } from '../documents/documents.service';
import { sampleUser } from './sample-data/user.sample';
import { sampleStudent } from './sample-data/student.sample';
import { sampleProfessor } from './sample-data/professor.sample copy';
import { sampleCourse } from './sample-data/course.sample';
import { sampleSection } from './sample-data/section.sample';
import { Professor } from '../professors/entities/professor.entity';
import { Section } from '../sections/entities/section.entity';
import { ImportantDatesService } from '../important-dates/important-dates.service';
import { ImportantDate } from '../important-dates/entities/important-date.entity';
import { CreateImportantDateDto } from '../important-dates/dto/create-important-date.dto';
import { TaskType } from 'src/tasks/enums/taskType';
import { TaskState } from 'src/tasks/enums/taskState';

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
    private readonly documentsService: DocumentsService,
    private readonly usersService: UsersService,
    private readonly importantDatesService: ImportantDatesService,
  ) {}

  STUDENTS_NUMBER = 10;
  PROFESSORS_NUMBER = 10;
  COORDINATORS_NUMBER = 3;
  TOTAL_USERS =
    this.STUDENTS_NUMBER + this.PROFESSORS_NUMBER + this.COORDINATORS_NUMBER;
  MAX_THESIS_PER_PROFESSOR = 3;
  MAX_PROJECTS_PER_PROFESSOR = 3;
  GRADUATED_ASSISTANCE_APPLICATIONS_NUMBER = 2;

  async seedSampleTASEntities() {
    const period =
      await this.periodsService.findOneByPeriodAndYearString('202510');
    if (!period) {
      return 'SEED_FAILED';
    }

    for (const user of sampleUser) {
      const userWithPassword = {
        ...user,
        password: user.password || faker.internet.password({ length: 20 }),
      };
      await this.usersService.create(userWithPassword);
    }
    for (const student of sampleStudent) {
      await this.studentsService.create(student);
    }
    const professors: Professor[] = [];
    for (const professor of sampleProfessor) {
      professors.push(await this.professorsService.create(professor));
    }
    const sections: Section[] = [];

    for (const section of sampleSection) {
      sections.push(
        await this.sectionsService.createSimple(
          section,
          [],
          professors,
          period,
        ),
      );
    }
    for (let i = 0; i < sampleCourse.length; i++) {
      await this.coursesService.create(sampleCourse[i], sections[i]);
    }
  }

  async seedBillboard() {
    const filePath = path.join(
      process.cwd(),
      'src',
      'seed',
      'sample-data',
      'HV_SAMPLE.pdf',
    );
    const buffer = await fs.readFile(filePath);

    const professors = await this.professorsService.findAll();
    const professorsChosen = professors
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    const professorsNames = professorsChosen.map(
      (professor) => professor.user.name,
    );
    const periods = await this.periodsService.findAll();
    const dtos: CreateSectionDto[] = Array.from({ length: 6 }).map(() => ({
      publicated: faker.datatype.boolean(),
      NRC: faker.string.numeric(5),
      code: faker.lorem.word(),
      name: faker.lorem.words(2),
      departament: faker.lorem.word(),
      credits: faker.number.int({ min: 1, max: 10 }),
      section: String(faker.helpers.arrayElement([1, 2, 3])),
      period: `${faker.helpers.arrayElement(periods).year}${faker.helpers.arrayElement(['10', '20'])}`,
      professors: professorsNames.join(
        `|${faker.helpers.arrayElement(['(01)', '(02)'])}`,
      ),
    }));

    await this.billboardsService.create(dtos);

    const courses = await this.coursesService.findAll();
    for (const course of courses) {
      const programDoc = await this.documentsService.create({
        name: 'HV_SAMPLE.pdf',
        file: buffer,
      });
      const profs = await this.professorsService.findAll();
      const professorChosen = faker.helpers.arrayElement(profs);
      await this.coursesService.updateMainProfessor(course.id, professorChosen);
      await this.coursesService.updateProgram(course.id, programDoc);
    }

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

  async seedProfessors() {
    const professorsData = Array.from({ length: this.PROFESSORS_NUMBER }).map(
      () => {
        const professor: CreateProfessorDto = {
          id: '',
          isActive: faker.datatype.boolean(),
        };
        const user: CreateUserDto = {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password: faker.internet.password({ length: 20 }),
        };
        return { professor, user };
      },
    );

    const insertPromises = professorsData.map(async ({ professor, user }) => {
      const createdUser = await this.usersService.create(user);
      professor.id = createdUser.id;
      await this.professorsService.addRole(createdUser, {
        isActive: professor.isActive,
        id: createdUser.id,
      });
      return await this.professorsService.create(professor);
    });
    await Promise.all(insertPromises);
    return true;
  }

  async seedCourse() {
    const sections = await this.sectionsService.findAll();
    const section = sections[Math.floor(Math.random() * sections.length)];
    const courses: CreateCourseDto[] = Array.from({ length: 4 }).map(() => ({
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
      insertPromises.push(this.coursesService.create(course, section));
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
    const users = await this.usersService.findAll();
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
            users[i].id,
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
          student.user.id,
        ),
      );
    }
    await Promise.all(insertPromises);
    return true;
  }

  async seedProjects() {
    const categories = ['Investigación', 'Proyecto aplicado a empresas'];
    const periods = await this.periodsService.findAll();
    const users = await this.usersService.findAll();
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
            users[i].id,
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
          student.user.id,
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
        randomProfessor.user.id,
      );
    });

    await Promise.all(insertPromises);
    return true;
  }

  async seedGraduatedAssistanceApplications() {
    const students = await this.studentsService.findAll();
    const graduatedAssistances =
      await this.graduatedAssistancesService.findAll();

    const filePath = path.join(__dirname, 'sample-data', 'HV_SAMPLE.pdf');

    try {
      const fileBuffer = await fs.readFile(filePath);

      const file: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'HV_SAMPLE.pdf',
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
          randomStudent.user.id,
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
    const insertPromises: Promise<void>[] = [];

    for (let i = 0; i < this.COORDINATORS_NUMBER; i++) {
      const userDto: CreateUserDto = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 20 }),
      };
      const createdUser = await this.usersService.create(userDto);

      const coordinatorDto: CreateCoordinatorDto = {
        id: createdUser.id,
        office: faker.lorem.word(),
        extension: faker.string.numeric(5),
        isActive: faker.datatype.boolean(),
        photo:
          'https://sistemasproyectos.uniandes.edu.co/informe-actividades/wp-content/uploads/2015/12/jp.fernandez29.jpg',
      };

      insertPromises.push(
        this.coordinatorsService.addRole(createdUser, coordinatorDto),
      );
    }
    await Promise.all(insertPromises);
    return true;
  }

  async seedTasks(): Promise<void> {
    // 1. Carga los IDs ya existentes
    const students   = await this.studentsService.findAll();     // [{ id, ... }]
    const professors = await this.professorsService.findAll();

    const types  = Object.values(TaskType)  as TaskType[];
    const states = Object.values(TaskState) as TaskState[];

    // 2. Vamos a crear las tareas *secuencialmente* para poder referir previousTaskId
    const createdTasks: { id: string }[] = [];

    for (let i = 0; i < 10; i++) {
      const dto: CreateTaskDto & { previousTaskId?: string } = {
        type: faker.helpers.arrayElement(types),
        state: faker.helpers.arrayElement(states),
        studentId:     faker.helpers.arrayElement(students).document,
        professorId:   faker.helpers.arrayElement(professors).document,
        payload: {
          note: faker.lorem.sentence(),
          answeredYes: faker.datatype.boolean(),
        },
      };
      if (createdTasks.length > 0) {
        dto.previousTaskId = faker.helpers.arrayElement(createdTasks).id;
      }

      // Crea la tarea y guarda su ID
      const created = await this.tasksService.create(dto);
      createdTasks.push({ id: created.id });
    }
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
      .map(() => ({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 20 }),
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
      name: 'admin',
      email: 'admin@admin.com',
      password: 'admin',
    };
    const admin = await this.usersService.create(adminRaw);
    await this.usersService.assignRole<CreateStudentDto>(admin, 'student', {
      code: 'admin',
      isActive: true,
      isUndergraduate: true,
      id: admin.id,
    });
    await this.usersService.assignRole<CreateCoordinatorDto>(
      admin,
      'coordinator',
      {
        isActive: true,
        id: admin.id,
        office: 'admin',
        extension: 'admin',
        photo:
          'https://sistemasproyectos.uniandes.edu.co/informe-actividades/wp-content/uploads/2015/12/jp.fernandez29.jpg',
      },
    );
    await this.usersService.assignRole<CreateProfessorDto>(admin, 'professor', {
      isActive: true,
      id: admin.id,
    });
    await this.usersService.assignRole<CreateAdministratorDto>(
      admin,
      'administrator',
      {
        id: admin.id,
        isActive: true,
      },
    );
    return true;
  }

  async seedStudents() {
    const insertPromises: Promise<void>[] = [];

    for (let i = 0; i < this.STUDENTS_NUMBER; i++) {
      const userDto: CreateUserDto = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 20 }),
      };
      const createdUser = await this.usersService.create(userDto);

      const studentDto: CreateStudentDto = {
        id: createdUser.id,
        code: faker.string.uuid(),
        isUndergraduate: faker.datatype.boolean(),
        isActive: faker.datatype.boolean(),
      };

      insertPromises.push(
        this.studentsService.addRole(createdUser, studentDto),
      );
    }

    await Promise.all(insertPromises);
    return true;
  }

  async seedImportantDates() {
    const periods = await this.periodsService.findAll();
    const insertPromises: Promise<ImportantDate>[] = [];
    const importantDates: CreateImportantDateDto[] = Array.from({
      length: 10,
    }).map(() => ({
      description: faker.lorem.sentence(),
      date: faker.date.future(),
      sectionTitle: faker.lorem.word(),
      type: faker.helpers.arrayElement(['type1', 'type2', 'type3']),
      period: periods[Math.floor(Math.random() * periods.length)].id,
    }));

    importantDates.forEach((importantDate) => {
      insertPromises.push(this.importantDatesService.create(importantDate));
    });

    await Promise.all(insertPromises);
    return true;
  }

  async executeSeedStatic() {
    await this.seedPeriods();
    await this.seedRequirements();
    await this.seedTags();
    await this.seedAreasOfInterest();
    await this.seedImportantDates();

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
    await this.seedBillboard();
    return 'SEED_EXECUTED';
  }

  async executeTaskAndTas() {
    await this.seedTasks();
    await this.seedSampleTASEntities();
    return 'SEED_EXECUTED';
  }

  async executeAll() {
    await this.executeSeedStatic();
    await this.executeSeedUsers();
    await this.executeSeedGraduatedAssistance();
    await this.executeSeedProjects();
    await this.executeSeedThesis();
    await this.executeSeedCourses();
    await this.executeTaskAndTas();
    return 'SEED_EXECUTED';
  }
}
