import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { Section } from '../sections/entities/section.entity';
import { Period } from '../periods/entities/period.entity';
import { PeriodsService } from '../periods/periods.service';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course) private courseRepository: Repository<Course>,
    private periodsService: PeriodsService,
  ) {}

  async create(createCourseDto: CreateCourseDto, section: Section) {
    const course = this.courseRepository.create(createCourseDto);
    course.sections = [section];
    await this.courseRepository.save(course);
    return course;
  }

  findAll() {
    return this.courseRepository.find({
      relations: [
        'sections',
        'sections.professor',
        'sections.professor.user',
        'sections.period',
      ],
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} course`;
  }

  async findByCodeAndPeriod(
    code: string,
    period: Period,
  ): Promise<Course | null> {
    let searchPeriod: Period = period;
    if (period.period === '11' || period.period === '12') {
      const foundPeriod = await this.periodsService.findOneByPeriodAndYear(
        '10',
        period.year,
      );
      if (!foundPeriod) {
        throw new Error('Period not found');
      }
      searchPeriod = foundPeriod;
    }
    return await this.courseRepository
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.sections', 'section')
      .leftJoin('section.period', 'period')
      .where('course.code = :code', { code })
      .andWhere('period.id = :periodId', { periodId: searchPeriod.id })
      .getOne();
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    const course = await this.courseRepository.findOne({ where: { id } });
    if (course) {
      Object.assign(course, updateCourseDto);
      return await this.courseRepository.save(course);
    }
    throw new Error('Course not found');
  }

  updateSections(section: Section, course: Course) {
    if (course.sections != undefined) {
      course.sections.push(section);
    } else {
      course.sections = [section];
    }
    return this.courseRepository.save(course);
  }

  remove(id: number) {
    return `This action removes a #${id} course`;
  }
}
