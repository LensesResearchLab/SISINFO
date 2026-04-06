import { Module } from '@nestjs/common';
import { ThesisApplicationsService } from './thesis-applications.service';
import { ThesisApplicationsController } from './thesis-applications.controller';
import { ThesisApplication } from './entities/thesis-application.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfessorsModule } from '../professors/professors.module';
import { ThesesModule } from '../theses/theses.module';
import { StudentsModule } from '../students/students.module';
import { PeriodsModule } from '../periods/periods.module';
import { TasksModule } from '../tasks/tasks.module';
import { ProfilesModule } from '../profiles/profiles.module';

@Module({
  controllers: [ThesisApplicationsController],
  providers: [ThesisApplicationsService],
  imports: [
    ProfessorsModule,
    ThesesModule,
    StudentsModule,
    PeriodsModule,
    TasksModule,
    ProfilesModule,
    TypeOrmModule.forFeature([ThesisApplication]),
  ],
  exports: [TypeOrmModule, ThesisApplicationsService],
})
export class ThesisApplicationsModule {}
