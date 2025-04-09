import { Module } from '@nestjs/common';
import { BillboardsService } from './billboards.service';
import { BillboardsController } from './billboards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Billboard } from './entities/billboard.entity';
import { Course } from 'src/courses/entities/course.entity';
import { CoursesModule } from 'src/courses/courses.module';
import { Section } from 'src/sections/entities/section.entity';
import { SectionsModule } from 'src/sections/sections.module';
import { PeriodsModule } from 'src/periods/periods.module';
import { ProfessorsModule } from 'src/professors/professors.module';
import { Period } from 'src/periods/entities/period.entity';
import { Professor } from 'src/professors/entities/professor.entity';

@Module({
  controllers: [BillboardsController],
  providers: [BillboardsService],
  imports: [TypeOrmModule.forFeature([Billboard, Course, Section, Period, Professor]), CoursesModule, SectionsModule, PeriodsModule, ProfessorsModule],
  exports: [TypeOrmModule, BillboardsService],
})
export class BillboardsModule {}