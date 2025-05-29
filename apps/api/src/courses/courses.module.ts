import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CourseController } from './courses.controller';
import { Course } from './entities/course.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeriodsModule } from '../periods/periods.module';
import { ProfessorsModule } from '../professors/professors.module';
import { Section } from '../sections/entities/section.entity';

@Module({
  controllers: [CourseController],
  providers: [CoursesService],
  imports: [
    TypeOrmModule.forFeature([Course, Section]),
    PeriodsModule,
    ProfessorsModule,
  ],
  exports: [TypeOrmModule, CoursesService],
})
export class CoursesModule {}
