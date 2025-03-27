import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { ProfessorsService } from '../professors/professors.service';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly professorsService: ProfessorsService,
    @InjectRepository(Project) private projectRepository: Repository<Project>,
  ) {}
  async create(createProjectDto: CreateProjectDto, professorDocument: string) {
    const professor = await this.professorsService.findOne(professorDocument);

    if (!professor) {
      throw new NotFoundException(
        `Professor with document ${professorDocument} not found`,
      );
    }
    const project = this.projectRepository.create({
      ...createProjectDto,
      professor: professor,
    });

    await this.projectRepository.save(project);
    return project;
  }

  async findAll() {
    return this.projectRepository.find({
      relations: {
        professor: true,
        areasOfInterest: true,
      },
    });
  }

  async findOne(id: string) {
    return this.projectRepository.findOne({
      where: { id },
    });
  }

  update(id: string, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: string) {
    return `This action removes a #${id} project`;
  }
}
