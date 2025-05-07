import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { ProfessorsService } from '../professors/professors.service';
import { PeriodsService } from '../periods/periods.service';
import { Student } from 'src/students/entities/student.entity';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly periodsService: PeriodsService,
    private readonly professorsService: ProfessorsService,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
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

  async findAll(period?: string) {
    let whereCondition = {};

    if (period) {
      if (!/^\d{6}$/.test(period)) {
        throw new Error(
          'El parámetro semestre debe tener el formato YYYYSS (por ejemplo, 202510)',
        );
      }
      const year = period.slice(0, 4);
      const periodPart = period.slice(4, 6);
      whereCondition = {
        period: {
          year,
          period: periodPart,
        },
      };
    }

    return this.projectRepository.find({
      where: whereCondition,
      relations: {
        professor: true,
        areasOfInterest: true,
      },
    });
  }

  async findByProfessor(professorId: string) {
    const period = await this.periodsService.findCurrentPeriod();
    const projects = await this.projectRepository.find({
      where: { professor: { id: professorId }, period },
    });
    if (!projects) {
      throw new NotFoundException(
        `Projects with professor id ${professorId} not found in period ${period.period}`,
      );
    }
    return projects;
  }

  async findOne(id: string) {
    const project = await this.projectRepository.findOne({
      where: { id }, relations:["projectApplications"]
    });
    if (!project) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }
    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const project = await this.findOne(id);
    Object.assign(project, updateProjectDto);
    return this.projectRepository.save(project);
  }

  async updateStudents(id:string, student: Student){
    const project = await this.projectRepository.findOne({ 
      where: { id }, 
      relations: ['students'],
    });
    if (!project) return
    
    if (!project.students.some(existingStudent => existingStudent.id === student.id)) {
      project.students.push(student);
  }
    return await this.projectRepository.save(project);
  }

  async remove(id: string) {
    const project = await this.findOne(id);
    return this.projectRepository.remove(project);
  }
}
