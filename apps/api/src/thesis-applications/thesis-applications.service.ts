import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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
import { Professor } from '../professors/entities/professor.entity';

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
    @InjectRepository(Professor)
    private readonly professorRepository: Repository<Professor>,
  ) {}

  async create(
    createThesisApplicationDto: CreateThesisApplicationDto,
    studentId: string,
  ): Promise<ThesisApplication> {
    const {
      thesisId,
      profileId,
      advisorId,
      coordinatorId: _coordinatorId,
      ...rest
    } = createThesisApplicationDto;

    const student = await this.studentRepository.findOne({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException(
        `Student with studentId ${studentId} not found`,
      );
    }

    if (profileId && !advisorId) {
      throw new ConflictException('La solicitud debe tener un asesor de tesis.');
    }

    const existingApplication = await this.thesisApplicationRepository.findOne({
      where: { student: { id: studentId } },
    });
    if (existingApplication) {
      throw new ConflictException('El estudiante ya tiene una solicitud de tesis activa.');
    }

    const thesis = thesisId
      ? await this.thesisRepository.findOne({ where: { id: thesisId } })
      : null;
    if (thesisId && !thesis) {
      throw new NotFoundException('Thesis with ID ' + thesisId + ' not found');
    }

    const profile = profileId
      ? await this.profilesService.findOne(profileId)
      : null;
    const advisor = advisorId
      ? await this.professorRepository.findOne({ where: { id: advisorId } })
      : null;
    if (advisorId && !advisor) {
      throw new NotFoundException('Advisor with ID ' + advisorId + ' not found');
    }

    /* Add application date */
    const applicationDate = new Date();

    const thesisApplication = this.thesisApplicationRepository.create({
      ...rest,
      student,
      thesis: thesis ?? undefined,
      profile: profile ?? undefined,
      advisor: advisor ?? undefined,
      applicationDate,
    });

    const savedApplication =
      await this.thesisApplicationRepository.save(thesisApplication);
    student.thesisApplication = savedApplication;
    await this.studentRepository.save(student);

    if (profile) {
      savedApplication.status = ThesisStatusEnum.SUBAREA_PENDING_ADVISOR;
      await this.thesisApplicationRepository.save(savedApplication);

      if (advisor) {
        await this.tasksService.create(TaskType.SEND_APPROVE, {
          flow: 'inscripcionSubarea',
          step: 0,
          comment: '',
          professorId: advisor.id,
          studentId: student.id,
          thesisApplicationId: savedApplication.id,
        });
      } else if (profile.coordinator?.id) {
        await this.tasksService.create(TaskType.SEND_APPROVE, {
          flow: 'inscripcionSubarea',
          step: 1,
          comment: '',
          professorId: profile.coordinator.id,
          studentId: student.id,
          thesisApplicationId: savedApplication.id,
        });
      }
    }

    return savedApplication;
  }

  async createMasterStage(
    dto: CreateThesisApplicationDto,
    studentId: string,
  ): Promise<ThesisApplication> {
    const stage = dto.currentStage;
    if (stage !== 'tesis1' && stage !== 'tesis2') {
      throw new ConflictException('La etapa de maestría no es válida.');
    }

    const application = await this.thesisApplicationRepository.findOne({
      where: { student: { id: studentId } },
      relations: ['student', 'profile', 'advisor'],
    });
    if (!application) {
      throw new ConflictException('Primero debe aprobarse la inscripción a la subárea.');
    }
    if (stage === 'tesis1' && application.status !== ThesisStatusEnum.SUBAREA_APPROVED) {
      throw new ConflictException('La inscripción a la subárea aún no está aprobada.');
    }
    if (stage === 'tesis2' && application.status !== ThesisStatusEnum.THESIS1_APPROVED) {
      throw new ConflictException('Tesis 1 aún no está aprobada.');
    }
    if (!dto.stageTitle || !dto.stageDescription) {
      throw new ConflictException('El título y la descripción son obligatorios.');
    }

    application.currentStage = stage;
    application.stageTitle = dto.stageTitle;
    application.stageDescription = dto.stageDescription;
    application.status = stage === 'tesis1'
      ? ThesisStatusEnum.THESIS1_PENDING_ADVISOR
      : ThesisStatusEnum.THESIS2_PENDING_ADVISOR;
    const saved = await this.thesisApplicationRepository.save(application);

    await this.tasksService.create(TaskType.SEND_APPROVE, {
      flow: stage,
      step: 0,
      comment: '',
      professorId: application.advisor?.id,
      studentId,
      thesisApplicationId: saved.id,
    });
    return saved;
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
        profile: {
          coordinator: {
            user: true,
          },
        },
        advisor: {
          user: true,
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
