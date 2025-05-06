import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { TaskFactory } from './factory/tasks.factory';

@Module({
  controllers: [TasksController],
  providers: [TasksService, TaskFactory ],
  imports: [TypeOrmModule.forFeature([Task])],
  exports: [TypeOrmModule, TasksService],
})
export class TasksModule {}
