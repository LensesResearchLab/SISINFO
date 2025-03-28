import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { ProfessorsService } from '../professors/professors.service';
import { PeriodsService } from '../periods/periods.service';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly periodsService: PeriodsService,
    private readonly professorsService: ProfessorsService,
    @InjectRepository(Project) private projectRepository: Repository<Project>,
  ) {}
  async create(
    createProjectDto: CreateProjectDto,
    professorDocument: string,
    periodId: string,
  ) {
    const professor = await this.professorsService.findOne(professorDocument);
    const period = await this.periodsService.findOne(periodId);

    if (!professor) {
      throw new NotFoundException(
        `Professor with document ${professorDocument} not found`,
      );
    }
    if (!period) {
      throw new NotFoundException(`Period with id ${periodId} not found`);
    }
    const project = this.projectRepository.create({
      ...createProjectDto,
      professor: professor,
      period: period,
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

  async findByProfessor(professorDocument: string) {
    const period = await this.periodsService.findCurrentPeriod();
    const projects = await this.projectRepository.find({
      where: { professor: { document: professorDocument }, period },
    });
    console.log(professorDocument, period);
    if (!projects) {
      throw new NotFoundException(
        `Projects with professor document ${professorDocument} not found in period ${period.period}`,
      );
    }
    return projects;
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
