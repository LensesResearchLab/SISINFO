import { Module } from '@nestjs/common';
import { AlertProfessorModule } from '../alert-professor/alert-professor.module';
import { AlertProjectModule } from '../alert-project/alert-project.module';
import { AreasOfInterestModule } from '../areas_of_interest/areas_of_interest.module';
import { BillboardModule } from '../billboard/billboard.module';
import { CoordinatorModule } from '../coordinator/coordinator.module';
import { CourseModule } from '../course/course.module';
import { GraduatedAssistanceModule } from '../graduated_assistance/graduated_assistance.module';
import { PeriodModule } from '../period/period.module';
import { ProfessorModule } from '../professor/professor.module';
import { ProjectModule } from '../project/project.module';
import { RequirementModule } from '../requirement/requirement.module';
import { SectionModule } from '../section/section.module';
import { StudentModule } from '../student/student.module';
import { TagModule } from '../tag/tag.module';
import { TaskModule } from '../task/task.module';
import { TeachingAssistanceModule } from '../teaching_assistance/teaching_assistance.module';
import { ThesisModule } from '../thesis/thesis.module';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
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
    StudentModule,
    TagModule,
    TaskModule,
    TeachingAssistanceModule,
    ThesisModule,
  ],
})
export class SeedModule {}
