import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { Section } from 'src/sections/entities/section.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course) private courseRepository: Repository<Course>,
  ) {}

  async create(createCourseDto: CreateCourseDto, section:Section) {
    const course = this.courseRepository.create(createCourseDto);
    course.sections = [section];
    await this.courseRepository.save(course);
    return course;
  }

  findAll() {
    return this.courseRepository.find({relations:["sections", "sections.professor", "sections.professor.user", "sections.period"]});
  }

  findOne(id: number) {
    return `This action returns a #${id} course`;
  }

  findByCode(code:string){
    return this.courseRepository.findOne({ where: { code } });
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    
    const course = await this.courseRepository.findOne({ where: { id } });
    if (course) {
      Object.assign(course, updateCourseDto);
      return await this.courseRepository.save(course);
    }
    throw new Error('Course not found');
  }

  updateSections(section:Section, course:Course){
    console.log("Course: ", course)
    console.log("Section: ", section)
    course.sections.push(section);
    return this.courseRepository.save(course);
  }

  remove(id: number) {
    return `This action removes a #${id} course`;
  }
}
