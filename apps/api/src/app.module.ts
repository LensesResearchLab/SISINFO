import { Module } from '@nestjs/common';
import { BillboardModule } from './billboard/billboard.module';
import { PeriodModule } from './period/period.module';
import { TeachingAssistanceModule } from './teaching_assistance/teaching_assistance.module';
import { SectionModule } from './section/section.module';
import { ProfessorModule } from './professor/professor.module';
import { CourseModule } from './course/course.module';
import { TagModule } from './tag/tag.module';
import { ThesisModule } from './thesis/thesis.module';
import { ProjectModule } from './project/project.module';
import { RequirementModule } from './requirement/requirement.module';
import { GraduatedAssistanceModule } from './graduated_assistance/graduated_assistance.module';
import { CoordinatorModule } from './coordinator/coordinator.module';
import { TaskModule } from './task/task.module';
import { AlertProjectModule } from './alert-project/alert-project.module';
import { AlertProfessorModule } from './alert-professor/alert-professor.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedModule } from './seed/seed.module';
import { AreasOfInterestModule } from './areas_of_interest/areas_of_interest.module';
import { StudentModule } from './student/student.module';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';

@Module({
  imports: [
    SeedModule,
    AlertProfessorModule,
    AlertProjectModule, 
    AreasOfInterestModule,
    BillboardModule, 
    CoordinatorModule, 
    CourseModule, 
    GraduatedAssistanceModule, 
    PeriodModule, 
    ProfessorModule, 
    ProjectModule, 
    RequirementModule, 
    SectionModule, 
    TagModule, 
    TaskModule, 
    TeachingAssistanceModule, 
    ThesisModule, 
    StudentModule,
    ConfigModule.forRoot({
      envFilePath: path.resolve(__dirname, '../../../config/.env')
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD, 
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
