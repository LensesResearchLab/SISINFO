import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectApplicationDto } from './dto/create-project-application.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectApplication } from './entities/project-application.entity';
import { ProjectsService } from '../projects/projects.service';
import { StudentsService } from '../students/students.service';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectApplicationsService {
  constructor(
    private readonly studentsService: StudentsService,
    private readonly projectsService: ProjectsService,
    @InjectRepository(ProjectApplication)
    private projectApplicationRepository: Repository<ProjectApplication>,
  ) {}

  async create(
    createProjectApplicationDto: CreateProjectApplicationDto,
    projectId: string,
    studentDocument: string,
  ): Promise<ProjectApplication> {
    const result = await this.projectApplicationRepository.manager.transaction(
      async (manager) => {
        const student = await this.studentsService.findOne(studentDocument);
        const project = await this.projectsService.findOne(projectId);

        if (!student || !project) {
          throw new NotFoundException(
            !student
              ? `Estudiante con documento ${studentDocument} no encontrado`
              : `Proyecto con ID ${projectId} no encontrado`,
          );
        }

        const projectApplication = manager.create(ProjectApplication, {
          ...createProjectApplicationDto,
          project,
          student,
        });

        return await manager.save(projectApplication);
      },
    );

    return result;
  }

  findAll() {
    return `This action returns all projectApplications`;
  }

  findOne(id: number) {
    return `This action returns a #${id} projectApplication`;
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
