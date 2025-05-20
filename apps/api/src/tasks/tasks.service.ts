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

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly repo: Repository<Task>,
    private readonly documentService: DocumentsService,
    private readonly factory: TaskFactory,
    private readonly studentsService: StudentsService,
    private readonly professorService: ProfessorsService,
  ) {}

  async create(type: TaskType, overrides?: UpdateTaskDto): Promise<Task> {
    const hasStudent = !!overrides?.studentId;
    const hasProfessor = !!overrides?.professorId;
    let student: Student | null;
    let professor: Professor | null;
    if (hasStudent == hasProfessor) {
      throw new BadRequestException(
        'Debes especificar exactamente uno: studentId o professorId',
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
    }
    if (overrides?.documentId) {
      const document = await this.documentService.findOne(overrides?.documentId);
      if (document) {
        entity.document = document;
      }
    }
    return await this.repo.save(entity);
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.repo.findOne({
      where: { id },
      relations: ['projectPreviousTasks', 'projectActualTask', 'student', 'professor'],
    });
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    return task;
  }
  async update(id: string, dto: UpdateTaskDto): Promise<Task> {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }
}
