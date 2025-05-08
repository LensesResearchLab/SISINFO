import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { TaskFactory } from './factory/tasks.factory';
import { ProfessorsModule } from 'src/professors/professors.module';
import { StudentsModule } from 'src/students/students.module';

@Module({
  controllers: [TasksController],
  providers: [TasksService, TaskFactory ],
  imports: [TypeOrmModule.forFeature([Task]), ProfessorsModule, StudentsModule],
  exports: [TypeOrmModule, TasksService],
})
export class TasksModule {}
