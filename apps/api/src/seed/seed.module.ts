import { Module } from '@nestjs/common';
import { AreasOfInterestModule } from '../areas-of-interest/areas-of-interest.module';
import { BillboardsModule } from '../billboards/billboards.module';
import { CoordinatorsModule } from '../coordinators/coordinators.module';
import { CoursesModule } from '../courses/courses.module';
import { GraduatedAssistancesModule } from '../graduated-assistances/graduated-assistances.module';
import { PeriodsModule } from '../periods/periods.module';
import { ProfessorsModule } from '../professors/professors.module';
import { ProjectsModule } from '../projects/projects.module';
import { RequirementsModule } from '../requirements/requirements.module';
import { SectionsModule } from '../sections/sections.module';
import { TagsModule } from '../tags/tags.module';
import { TasksModule } from '../tasks/tasks.module';
import { TeachingAssistancesModule } from '../teaching-assistances/teaching-assistances.module';
import { ThesesModule } from '../theses/theses.module';
import { StudentsModule } from '../students/students.module';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { ProjectApplicationsModule } from '../project-applications/project-applications.module';
import { ThesisApplicationsModule } from '../thesis-applications/thesis-applications.module';
import { AssistanceApplicationsModule } from '../assistance-applications/assistance-applications.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    AreasOfInterestModule,
    AssistanceApplicationsModule,
    BillboardsModule,
    CoordinatorsModule,
    CoursesModule,
    GraduatedAssistancesModule,
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
  ],
})
export class SeedModule {}
