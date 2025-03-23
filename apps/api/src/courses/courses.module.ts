import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CourseController } from './courses.controller';
import { Course } from './entities/course.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [CourseController],
  providers: [CoursesService],
  imports: [TypeOrmModule.forFeature([Course])],
  exports: [TypeOrmModule, CoursesService],
})
export class CoursesModule {}
