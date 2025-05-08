import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Task } from './entities/task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskFactory } from './factory/tasks.factory';
import { TaskType } from './enums/taskType';
import { flows } from './flows/tasksFlows';
import { StudentsService } from 'src/students/students.service';
import { ProfessorsService } from 'src/professors/professors.service';
import { Student } from 'src/students/entities/student.entity';
import { Professor } from 'src/professors/entities/professor.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly repo: Repository<Task>,
    private factory: TaskFactory,
    private readonly studentsService: StudentsService,
    private readonly professorService: ProfessorsService
  ) { }

  async create(type: TaskType,
    overrides?: UpdateTaskDto): Promise<Task> {
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
        entity.student = student
      }
    } else if (overrides?.professorId) {
      professor = await this.professorService.findOne(overrides?.professorId);
      if (professor) {
        entity.professor = professor
      }
    }
    return await this.repo.save(entity);
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.repo.findOne({
      where: { id },
      relations: ['previousTask', 'nextTasks', 'student', 'professor']
    });
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    return task;
  }
  async update(id: string, dto: UpdateTaskDto): Promise<Task> {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

}
