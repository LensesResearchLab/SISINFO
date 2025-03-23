import { Module } from '@nestjs/common';
import { AlertsProfessorModule } from '../alerts-professor/alerts-professor.module';
import { AlertsProjectModule } from '../alerts-project/alerts-project.module';
import { AreasOfInterestModule } from '../areas_of_interest/areas_of_interest.module';
import { BillboardsModule } from '../billboards/billboards.module';
import { CoordinatorsModule } from '../coordinators/coordinators.module';
import { CoursesModule } from '../courses/courses.module';
import { GraduatedAssistancesModule } from '../graduated_assistances/graduated_assistances.module';
import { PeriodsModule } from '../periods/periods.module';
import { ProfessorsModule } from '../professors/professors.module';
import { ProjectsModule } from '../projects/projects.module';
import { RequirementsModule } from '../requirements/requirements.module';
import { SectionsModule } from '../sections/sections.module';
import { TagsModule } from '../tags/tags.module';
import { TasksModule } from '../tasks/tasks.module';
import { TeachingAssistancesModule } from '../teaching_assistances/teaching_assistances.module';
import { ThesesModule } from '../theses/theses.module';
import { StudentsModule } from '../students/students.module';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    AlertsProfessorModule,
    AlertsProjectModule,
    AreasOfInterestModule,
    BillboardsModule,
    CoordinatorsModule,
    CoursesModule,
    GraduatedAssistancesModule,
    PeriodsModule,
    ProfessorsModule,
    ProjectsModule,
    RequirementsModule,
    SectionsModule,
    TagsModule,
    TasksModule,
    TeachingAssistancesModule,
    ThesesModule,
    StudentsModule,
  ],
})
export class SeedModule {}
