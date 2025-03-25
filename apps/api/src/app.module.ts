import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
import { SeedModule } from './seed/seed.module';
import { AreasOfInterestModule } from './areas_of_interest/areas_of_interest.module';
import { BillboardsModule } from './billboards/billboards.module';
import { CoordinatorsModule } from './coordinators/coordinators.module';
import { CoursesModule } from './courses/courses.module';
import { GraduatedAssistancesModule } from './graduated_assistances/graduated_assistances.module';
import { PeriodsModule } from './periods/periods.module';
import { ProfessorsModule } from './professors/professors.module';
import { ProjectsModule } from './projects/projects.module';
import { RequirementsModule } from './requirements/requirements.module';
import { SectionsModule } from './sections/sections.module';
import { TagsModule } from './tags/tags.module';
import { TasksModule } from './tasks/tasks.module';
import { TeachingAssistancesModule } from './teaching_assistances/teaching_assistances.module';
import { ThesesModule } from './theses/theses.module';
import { StudentsModule } from './students/students.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImportantDatesModule } from './important_dates/important_dates.module';
import { ProgramsModule } from './programs/programs.module';
import { DocumentsModule } from './documents/documents.module';

@Module({
  imports: [
    SeedModule,
    AreasOfInterestModule,
    BillboardsModule,
    CoordinatorsModule,
    CoursesModule,
    DocumentsModule,
    GraduatedAssistancesModule,
    ImportantDatesModule,
    PeriodsModule,
    ProfessorsModule,
    ProgramsModule,
    ProjectsModule,
    RequirementsModule,
    SectionsModule,
    TagsModule,
    TasksModule,
    TeachingAssistancesModule,
    ThesesModule,
    StudentsModule,
    ConfigModule.forRoot({
      envFilePath: path.resolve(__dirname, '../../../config/.env'),
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
    ImportantDatesModule,
    ProgramsModule,
    DocumentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
