import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskFactory } from './factory/tasks.factory';
import { TaskType } from './enums/taskType';
import { StudentsService } from '../students/students.service';
import { ProfessorsService } from '../professors/professors.service';
import { Student } from '../students/entities/student.entity';
import { Professor } from '../professors/entities/professor.entity';
import { DocumentsService } from '../documents/documents.service';
import { Coordinator } from '../coordinators/entities/coordinator.entity';
import { CoordinatorsService } from '../coordinators/coordinators.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly repo: Repository<Task>,
    private readonly documentService: DocumentsService,
    private readonly factory: TaskFactory,
    private readonly studentsService: StudentsService,
    private readonly professorService: ProfessorsService,
    private readonly coordinatorService: CoordinatorsService,
  ) {}

  async create(type: TaskType, overrides?: UpdateTaskDto): Promise<Task> {
    let student: Student | null;
    let professor: Professor | null;
    let coordinator: Coordinator | null;
    const total =
      Number(!!overrides?.studentId) +
      Number(!!overrides?.professorId) +
      Number(!!overrides?.coordinatorId);

    if (total !== 1) {
      throw new BadRequestException(
        'Debes especificar exactamente uno: studentId, professorId o coordinatorId',
      );
    }

    const dto = this.factory.create({ type, ...overrides });
    const entity = this.repo.create(dto);
    if (overrides?.studentId) {
      student = await this.studentsService.findOne(overrides.studentId);
      if (student) {
        entity.student = student;
      }
    } else if (overrides?.professorId) {
      professor = await this.professorService.findOne(overrides?.professorId);
      if (professor) {
        entity.professor = professor;
      }
    } else if (overrides?.coordinatorId) {
      coordinator = await this.coordinatorService.findOne(
        overrides?.coordinatorId,
      );
      console.log(coordinator);
      if (coordinator) {
        entity.coordinator = coordinator;
        console.log(entity);
      }
    }
    if (overrides?.documentId) {
      const document = await this.documentService.findOne(
        overrides?.documentId,
      );
      if (document) {
        entity.document = document;
      }
    }
    return await this.repo.save(entity);
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.repo.findOne({
      where: { id },
      relations: [
        'projectPreviousTasks',
        'projectActualTask',
        'student',
        'professor',
      ],
    });
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    return task;
  }
  async update(id: string, dto: UpdateTaskDto): Promise<Task> {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async findAll(): Promise<Task[]> {
    return await this.repo.find({
      relations: ['coordinator', 'projectActualTask', 'projectPreviousTasks'],
    });
  }
}
