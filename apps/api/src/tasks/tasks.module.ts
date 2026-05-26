import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { ProjectApplication } from '../project-applications/entities/project-application.entity';
import { TaskFactory } from './factory/tasks.factory';
import { ProfessorsModule } from '../professors/professors.module';
import { StudentsModule } from '../students/students.module';
import { DocumentsModule } from '../documents/documents.module';
import { CoordinatorsModule } from '../coordinators/coordinators.module';

@Module({
  controllers: [TasksController],
  providers: [TasksService, TaskFactory],
  imports: [
    TypeOrmModule.forFeature([Task, ProjectApplication]),
    ProfessorsModule,
    StudentsModule,
    DocumentsModule,
    CoordinatorsModule,
  ],
  exports: [TypeOrmModule, TasksService],
})
export class TasksModule {}
