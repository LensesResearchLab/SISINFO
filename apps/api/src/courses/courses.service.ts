import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { Section } from '../sections/entities/section.entity';
import { Period } from '../periods/entities/period.entity';
import { PeriodsService } from '../periods/periods.service';
import { Document } from '../documents/entities/document.entity';
import { ProfessorsService } from '../professors/professors.service';
import { Professor } from '../professors/entities/professor.entity';
import { deletePasswordFromUser } from '../common/utils/deletePasswordFromUser';
import { DocumentsService } from '../documents/documents.service';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Section)
    private readonly sectionRepository: Repository<Section>,
    private readonly periodsService: PeriodsService,
    private readonly professorsService: ProfessorsService,
    private readonly documentsService: DocumentsService,
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
        'mainProfessor',
        'sections',
        'sections.professors',
        'sections.professors.user',
        'sections.period',
      ],
    });
  }

  findOne(id: string) {
    return this.courseRepository.findOne({
      where: { id },
      relations: ['mainProfessor', 'program'],
    });
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

  async findAllWithMainProfessor() {
    return this.courseRepository.find({
      relations: ['mainProfessor'],
    });
  }

  async findProfessorsForCourseInCurrentPeriod(courseId: string) {
    const period = await this.periodsService.findCurrentPeriod();

    const sections = await this.sectionRepository.find({
      where: {
        course: { id: courseId },
        period: { id: period.id },
      },
      relations: ['professors'],
    });
    const professorsMap = new Map<string, Professor>();
    for (const section of sections) {
      for (const professor of section.professors) {
        professorsMap.set(professor.id, professor);
      }
    }

    const professorsArray = Array.from(professorsMap.values());
    const sanitizedProfessors = professorsArray.map((professor) =>
      deletePasswordFromUser(professor.user),
    );
    return sanitizedProfessors;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    const course = await this.courseRepository.findOne({ where: { id } });
    if (course) {
      Object.assign(course, updateCourseDto);
      return await this.courseRepository.save(course);
    }
    throw new Error('Course not found');
  }

  async updateMainProfessor(id: string, professorId: string) {
    const course = await this.courseRepository.findOne({ where: { id } });
    if (!course) {
      throw new Error('Course not found');
    }
    const professor = await this.professorsService.findOne(professorId);
    if (!professor) {
      throw new Error('Professor not found');
    }

    course.mainProfessor = professor;
    return await this.courseRepository.save(course);
  }

  async updateProgram(id: string, program: Document) {
    const course = await this.courseRepository.findOne({ where: { id } });
    if (course) {
      course.program = program;
      return await this.courseRepository.save(course);
    }
    throw new Error('Course not found');
  }

  // Verify if a user (by userId) is the leader (mainProfessor.user.id) of the given course
  async isUserLeaderOfCourse(userId: string, courseId: string): Promise<boolean> {
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
      relations: ['mainProfessor', 'mainProfessor.user'],
    });
    if (!course?.mainProfessor?.user?.id) return false;
    return course.mainProfessor.user.id === userId;
  }

  // Create a Document from uploaded file and attach it as program to the course
  async uploadProgram(courseId: string, file: Express.Multer.File) {
    const course = await this.courseRepository.findOne({ where: { id: courseId } });
    if (!course) {
      throw new Error('Course not found');
    }

    const savedDocument = await this.documentsService.create({
      name: file.originalname,
      file: Buffer.from(file.buffer),
    });

    course.program = savedDocument;
    return this.courseRepository.save(course);
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
