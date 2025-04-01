import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { ProfessorsModule } from '../professors/professors.module';
import { PeriodsModule } from '../periods/periods.module';

@Module({
  controllers: [ProjectController],
  providers: [ProjectsService],
  imports: [
    PeriodsModule,
    ProfessorsModule,
    TypeOrmModule.forFeature([Project]),
  ],
  exports: [TypeOrmModule, ProjectsService],
})
export class ProjectsModule {}
