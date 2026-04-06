import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateThesisApplicationDto } from './dto/create-thesis-application.dto';
import { ThesisApplication } from './entities/thesis-application.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../students/entities/student.entity';
import { Thesis } from '../theses/entities/thesis.entity';
import { User } from '../users/entities/user.entity';
import { deletePasswordFromUser } from '../common/utils/deletePasswordFromUser';
import { ThesisStatusEnum } from './enums/thesis_status.enum';
import { PeriodsService } from '../periods/periods.service';
import { TasksService } from '../tasks/tasks.service';
import { TaskType } from '../tasks/enums/taskType';
import { ProfilesService } from '../profiles/profiles.service';

@Injectable()
export class ThesisApplicationsService {
  constructor(
    @InjectRepository(ThesisApplication)
    private readonly thesisApplicationRepository: Repository<ThesisApplication>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Thesis)
    private readonly thesisRepository: Repository<Thesis>,
    private readonly periodsService: PeriodsService,
    private readonly tasksService: TasksService,
    private readonly profilesService: ProfilesService,
  ) {}

  async create(
    createThesisApplicationDto: CreateThesisApplicationDto,
    studentId: string,
  ): Promise<ThesisApplication> {
    const { thesisId, ...rest } = createThesisApplicationDto;

    const student = await this.studentRepository.findOne({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException(
        `Student with studentId ${studentId} not found`,
      );
    }

    const thesis = await this.thesisRepository.findOne({
      where: { id: thesisId },
    });

    if (!thesis) {
      throw new NotFoundException(`Thesis with ID ${thesisId} not found`);
    }

    /* Add application date */
    const applicationDate = new Date();

    const thesisApplication = this.thesisApplicationRepository.create({
      ...rest,
      student,
      thesis,
      applicationDate,
    });

    const savedApplication =
      await this.thesisApplicationRepository.save(thesisApplication);
    student.thesisApplication = savedApplication;
    await this.studentRepository.save(student);

    // Create a task for the coordinator/director of the subarea (if exists)
    try {
      const subareaName = thesis.investigationSubarea || '';
      const profiles = await this.profilesService.findAll();
      const match = profiles.find(
        (p) => p.name?.toLowerCase?.() === subareaName.toLowerCase(),
      );
      if (match && match.coordinator && match.coordinator.id) {
        await this.tasksService.create(TaskType.SEND_APPROVE, {
          flow: 'inscripcionSubarea',
          step: 0,
          comment: '',
          coordinatorId: match.coordinator.id,
          studentId: student.id,
        });
      }
    } catch (e) {
      console.error('Error creando tarea de subarea:', e);
    }

    return savedApplication;
  }

  findAll() {
    return `This action returns all thesisApplications`;
  }

  async findOne(studentId: string) {
    const application = await this.thesisApplicationRepository.findOne({
      where: {
        student: { id: studentId },
      },
      relations: {
        student: {
          user: true,
        },
        thesis: {
          period: true,
          professor: {
            user: true,
          },
          tags: true,
        },
      },
    });

    if (!application) {
      throw new NotFoundException(
        `Thesis application with doc ${studentId} not found`,
      );
    }

    if (application.student?.user) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = application.student.user;
      application.student.user = userWithoutPassword as unknown as User;
    }

    if (application.thesis?.professor?.user) {
      application.thesis.professor.user = deletePasswordFromUser(
        application.thesis.professor.user,
      );
    }

    return application;
  }

  async findAllApplicantsByThesisId(thesisId: string) {
    const applications = await this.thesisApplicationRepository.find({
      relations: {
        student: {
          user: true,
        },
        thesis: {
          period: true,
          professor: {
            user: true,
          },
          tags: true,
        },
      },
      where: {
        thesis: {
          id: thesisId,
        },
      },
    });

    if (!applications) {
      throw new NotFoundException(
        `Thesis applications with id ${thesisId} not found`,
      );
    }

    /* Dont return passwords */
    applications.forEach((app) => {
      if (app.student?.user) {
        app.student.user = deletePasswordFromUser(app.student.user);
      }
      if (app.thesis?.professor?.user) {
        app.thesis.professor.user = deletePasswordFromUser(
          app.thesis.professor.user,
        );
      }
    });

    return applications;
  }

  async getThesisApplicationsReport(periodStr?: string) {
    const whereClause: any = {
      student: {
        isUndergraduate: false,
      },
    };

    // Si se especifica periodo, filtrar por él
    if (periodStr) {
      const period = await this.periodsService.findOneByPeriodAndYearString(periodStr);
      if (!period) {
        throw new NotFoundException(`No se encontró el periodo: ${periodStr}`);
      }
      whereClause.thesis = {
        period: {
          id: period.id,
        },
      };
    }

    const applications = await this.thesisApplicationRepository.find({
      where: whereClause,
      relations: {
        student: {
          user: true,
        },
        thesis: {
          period: true,
          professor: {
            user: true,
          },
        },
      },
    });

    return applications.map((app) => ({
      student_code: app.student.code,
      student_name: app.student.user.name,
      student_email: app.student.user.email,
      professor_name: app.thesis.professor.user.name,
      professor_email: app.thesis.professor.user.email,
      thesis_investigation_subarea: app.thesis.investigationSubarea,
      thesis_title: app.thesis.title,
      status: app.status,
      thesis_grade: app.grade,
      thesis_period: app.thesis.period,
    }));
  }

  /* Update status when accepted or rejected to thesis */
  async updateStatus(applicationId: string, status: ThesisStatusEnum) {
    const application = await this.thesisApplicationRepository.findOne({
      where: { id: applicationId },
    });
    if (!application) {
      throw new NotFoundException(
        `Thesis application with id ${applicationId} not found`,
      );
    }
    application.status = status;
    await this.thesisApplicationRepository.save(application);
    return application;
  }
}
