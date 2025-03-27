import { Module } from '@nestjs/common';
import { ProjectApplicationsService } from './project-applications.service';
import { ProjectApplicationsController } from './project-applications.controller';
import { ProjectApplication } from './entities/project-application.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsModule } from '../projects/projects.module';
import { StudentsModule } from '../students/students.module';

@Module({
  controllers: [ProjectApplicationsController],
  providers: [ProjectApplicationsService],
  imports: [
    ProjectsModule,
    StudentsModule,
    TypeOrmModule.forFeature([ProjectApplication]),
  ],
  exports: [TypeOrmModule, ProjectApplicationsService],
})
export class ProjectApplicationsModule {}
