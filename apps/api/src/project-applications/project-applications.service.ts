import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectApplicationDto } from './dto/create-project-application.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectApplication } from './entities/project-application.entity';
import { ProjectsService } from '../projects/projects.service';
import { StudentsService } from '../students/students.service';
import { Repository } from 'typeorm';
import { PeriodsService } from 'src/periods/periods.service';

@Injectable()
export class ProjectApplicationsService {
  constructor(
    private readonly studentsService: StudentsService,
    private readonly projectsService: ProjectsService,
    private readonly periodsService: PeriodsService,
    @InjectRepository(ProjectApplication)
    private readonly projectApplicationRepository: Repository<ProjectApplication>,
  ) {}

  async create(
    createProjectApplicationDto: CreateProjectApplicationDto,
  ): Promise<ProjectApplication> {
    const { studentId, projectId } = createProjectApplicationDto;
    const result = await this.projectApplicationRepository.manager.transaction(
      async (manager) => {
        const [student, project, period] = await Promise.all([
          this.studentsService.findOne(studentId),
          this.projectsService.findOne(projectId),
          this.periodsService.findCurrentPeriod(),
        ]);
        if (!student) {
          throw new NotFoundException(
            `Estudiante con documento ${studentId} no encontrado`,
          );
        }
        if (!project) {
          throw new NotFoundException(
            `Proyecto con ID ${projectId} no encontrado`,
          );
        }
        if (!period) {
          throw new NotFoundException(`Periodo actual no encontrado`);
        }
        const projectApplication = manager.create(ProjectApplication, {
          ...createProjectApplicationDto,
          project,
          student,
          period,
        });

        return await manager.save(projectApplication);
      },
    );

    return result;
  }

  findAll() {
    return `This action returns all projectApplications`;
  }

  findOne(id: string) {
    return `This action returns a projectApplication with id ${id}`;
  }

  async findByStudent(studentId: string): Promise<ProjectApplication> {
    const period = await this.periodsService.findCurrentPeriod();
    const application = await this.projectApplicationRepository.findOne({
      where: {
        student: { id: studentId },
        period: { id: period.id },
      },
      relations: {
        student: { user: true },
        project: { professor: { user: true } },
        period: true,
      },
    });

    if (!application) {
      throw new NotFoundException(
        `No se encontró una aplicación de proyecto para el estudiante con id ${studentId} en el periodo actual.`,
      );
    }
    return application;
  }

  async getProjectApplicationsReport() {
    const applications = await this.projectApplicationRepository.find({
      where: {
        student: {
          isUndergraduate: true,
        },
      },
      relations: {
        student: {
          user: true,
        },
        project: {
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
      professor_name: app.project.professor.user.name,
      professor_email: app.project.professor.user.email,
      project_title: app.project.title,
      status: app.status,
    }));
  }
}
