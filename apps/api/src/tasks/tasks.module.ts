import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { TaskFactory } from './factory/tasks.factory';
import { ProfessorsModule } from '../professors/professors.module';
import { StudentsModule } from '../students/students.module';
import { DocumentsModule } from 'src/documents/documents.module';

@Module({
  controllers: [TasksController],
  providers: [TasksService, TaskFactory],
  imports: [TypeOrmModule.forFeature([Task]), ProfessorsModule, StudentsModule, DocumentsModule],
  exports: [TypeOrmModule, TasksService],
})
export class TasksModule {}
