import { Module } from '@nestjs/common';
import { ProjectApplicationsService } from './project-applications.service';
import { ProjectApplicationsController } from './project-applications.controller';
import { ProjectApplication } from './entities/project-application.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsModule } from '../projects/projects.module';
import { StudentsModule } from '../students/students.module';
import { TasksModule } from 'src/tasks/tasks.module';
import { TaskFactory } from 'src/tasks/factory/tasks.factory';

@Module({
  controllers: [ProjectApplicationsController],
  providers: [ProjectApplicationsService, TaskFactory],
  imports: [
    ProjectsModule,
    StudentsModule,
    TasksModule,
    TypeOrmModule.forFeature([ProjectApplication]),
  ],
  exports: [TypeOrmModule, ProjectApplicationsService],
})
export class ProjectApplicationsModule {}
