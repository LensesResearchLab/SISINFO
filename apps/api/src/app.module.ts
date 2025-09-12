import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
import { SeedModule } from './seed/seed.module';
import { AreasOfInterestModule } from './areas-of-interest/areas-of-interest.module';
import { BillboardsModule } from './billboards/billboards.module';
import { CoordinatorsModule } from './coordinators/coordinators.module';
import { CoursesModule } from './courses/courses.module';
import { GraduatedAssistancesModule } from './graduated-assistances/graduated-assistances.module';
import { PeriodsModule } from './periods/periods.module';
import { ProfessorsModule } from './professors/professors.module';
import { ProjectsModule } from './projects/projects.module';
import { RequirementsModule } from './requirements/requirements.module';
import { SectionsModule } from './sections/sections.module';
import { TagsModule } from './tags/tags.module';
import { TasksModule } from './tasks/tasks.module';
import { TeachingAssistancesModule } from './teaching-assistances/teaching-assistances.module';
import { ThesesModule } from './theses/theses.module';
import { StudentsModule } from './students/students.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImportantDatesModule } from './important-dates/important-dates.module';
import { DocumentsModule } from './documents/documents.module';
import { IncidencesModule } from './incidences/incidences.module';
import { AssistanceApplicationsModule } from './assistance-applications/assistance-applications.module';
import { ThesisApplicationsModule } from './thesis-applications/thesis-applications.module';
import { ProjectApplicationsModule } from './project-applications/project-applications.module';
import { UsersModule } from './users/users.module';
import { AdministratorsModule } from './administrators/administrators.module';
import { AuthModule } from './auth/auth.module';
import { ImportantSectionsModule } from './important-sections/important-sections.module';

@Module({
  imports: [
    SeedModule,
    AreasOfInterestModule,
    AssistanceApplicationsModule,
    BillboardsModule,
    CoordinatorsModule,
    CoursesModule,
    DocumentsModule,
    GraduatedAssistancesModule,
    ImportantDatesModule,
    IncidencesModule,
    PeriodsModule,
    ProfessorsModule,
    ProjectsModule,
    ProjectApplicationsModule,
    RequirementsModule,
    SectionsModule,
    TagsModule,
    TasksModule,
    TeachingAssistancesModule,
    ThesesModule,
    ThesisApplicationsModule,
    StudentsModule,
    UsersModule,
    AuthModule,
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
      dropSchema: false,
      ssl: {
        rejectUnauthorized: false,
      }
    },
    ),
    AdministratorsModule,
    ImportantSectionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
