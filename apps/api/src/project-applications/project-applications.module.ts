import { Module } from '@nestjs/common';
import { ProjectApplicationsService } from './project-applications.service';
import { ProjectApplicationsController } from './project-applications.controller';
import { ProjectApplication } from './entities/project-application.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [ProjectApplicationsController],
  providers: [ProjectApplicationsService],
  imports: [TypeOrmModule.forFeature([ProjectApplication])],
  exports: [TypeOrmModule, ProjectApplicationsService],
})
export class ProjectApplicationsModule {}
