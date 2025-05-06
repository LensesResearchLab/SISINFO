import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Task} from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FactoryParams, TaskFactory } from './factory/tasks.factory';
import { TaskType } from './enums/taskType';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly repo: Repository<Task>,
    private factory: TaskFactory,
  ) {}

  async create(type: TaskType,
    overrides?: UpdateTaskDto): Promise<Task> {

      const dto = this.factory.create({ type, ...overrides });
      const entity = this.repo.create(dto);
      return this.repo.save(entity);
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.repo.findOne({where:{id}, 
      relations: ['previousTask', 'nextTasks', 'student', 'professor']});
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    return task;
  }
  async update(id: string, dto: UpdateTaskDto): Promise<Task> {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }
}
