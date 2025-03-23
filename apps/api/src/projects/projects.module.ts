import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';

@Module({
  controllers: [ProjectController],
  providers: [ProjectsService],
  imports: [TypeOrmModule.forFeature([Project])],
  exports: [TypeOrmModule, ProjectsService],
})
export class ProjectsModule {}
