import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectApplicationDto } from './dto/create-project-application.dto';
import { UpdateProjectApplicationDto } from './dto/update-project-application.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectApplication } from './entities/project-application.entity';
import { ProjectsService } from '../projects/projects.service';
import { StudentsService } from '../students/students.service';

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
    return this.projectApplicationRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const student = await this.studentsService.findOne(studentDocument);
        const project = await this.projectsService.findOne(projectId);

        if (!student || !project) {
          throw new NotFoundException(
            !student
              ? `Student with document ${studentDocument} not found`
              : `Project with ID ${projectId} not found`,
          );
        }

        const projectApplication = this.projectApplicationRepository.create({
          ...createProjectApplicationDto,
          project,
          student,
        });

        return transactionalEntityManager.save(projectApplication);
      },
    );
  }

  findAll() {
    return `This action returns all projectApplications`;
  }

  findOne(id: number) {
    return `This action returns a #${id} projectApplication`;
  }

  update(id: number, updateProjectApplicationDto: UpdateProjectApplicationDto) {
    return `This action updates a #${id} projectApplication`;
  }

  remove(id: number) {
    return `This action removes a #${id} projectApplication`;
  }
}
