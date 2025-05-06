import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Task} from './entities/task.entity';
import { TaskState } from './enums/taskState';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly repo: Repository<Task>,
  ) {}

  async create(createDto: CreateTaskDto): Promise<Task> {
    const task = this.repo.create(createDto);
    return this.repo.save(task);
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.repo.findOne({where:{id}, 
      relations: ['previousTask', 'nextTasks', 'student', 'professor']});
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    return task;
  }

  async findPendingForStudent(studentId: string): Promise<Task[]> {
    return this.repo
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.previousTask', 'prev')
      .where('task.studentId = :stu', { stu: studentId })
      .andWhere('task.state = :pending', { pending: TaskState.PENDING })
      .andWhere(
        '(task.previousTaskId IS NULL OR prev.state = :done)',
        { done: TaskState.COMPLETED },
      )
      .getMany();
  }
  async findPendingForProfessor(professorId: string): Promise<Task[]> {
    return this.repo
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.previousTask', 'prev')
      .where('task.professorId = :prof', { prof: professorId })
      .andWhere('task.state = :pending', { pending: TaskState.PENDING })
      .andWhere(
        '(task.previousTaskId IS NULL OR prev.state = :done)',
        { done: TaskState.COMPLETED },
      )
      .getMany();
  }

  async completeTask(id: string): Promise<Task[]> {
    const task = await this.repo.findOne({where:{id}, relations: ['nextTasks'] });
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    task.state = TaskState.COMPLETED;
    await this.repo.save(task);
    return task.nextTasks || [];
  }

  async update(id: string, dto: UpdateTaskDto): Promise<Task> {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }
}
