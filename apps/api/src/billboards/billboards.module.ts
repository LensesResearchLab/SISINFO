import { Module } from '@nestjs/common';
import { BillboardsService } from './billboards.service';
import { BillboardsController } from './billboards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Billboard } from './entities/billboard.entity';
import { Course } from '../courses/entities/course.entity';
import { CoursesModule } from '../courses/courses.module';
import { Section } from '../sections/entities/section.entity';
import { SectionsModule } from '../sections/sections.module';
import { PeriodsModule } from '../periods/periods.module';
import { ProfessorsModule } from '../professors/professors.module';
import { Period } from '../periods/entities/period.entity';
import { Professor } from '../professors/entities/professor.entity';

@Module({
  controllers: [BillboardsController],
  providers: [BillboardsService],
  imports: [
    TypeOrmModule.forFeature([Billboard, Course, Section, Period, Professor]),
    CoursesModule,
    SectionsModule,
    PeriodsModule,
    ProfessorsModule,
  ],
  exports: [TypeOrmModule, BillboardsService],
})
export class BillboardsModule {}
