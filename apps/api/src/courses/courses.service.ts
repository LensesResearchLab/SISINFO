import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
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

  async create(createCourseDto: CreateCourseDto, section: Section, manager?: EntityManager) {
    const repo = manager ? manager.getRepository(Course) : this.courseRepository;
    const course = repo.create(createCourseDto);
    course.sections = [section];
    await repo.save(course);
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
    manager?: EntityManager,
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
    const qb = manager
      ? manager.createQueryBuilder(Course, 'course')
      : this.courseRepository.createQueryBuilder('course');
    return await qb
      .leftJoinAndSelect('course.sections', 'section')
      .leftJoin('section.period', 'period')
      .where('course.code = :code', { code })
      .andWhere('period.id = :periodId', { periodId: searchPeriod.id })
      .getOne();
  }

  async findAllWithMainProfessor() {
    const courses = await this.courseRepository.find({
      relations: ['mainProfessor'],
    });

    const byCode = new Map<string, Course>();
    for (const course of courses) {
      const existing = byCode.get(course.code);
      if (!existing || (!existing.mainProfessor && course.mainProfessor)) {
        byCode.set(course.code, course);
      }
    }

    return Array.from(byCode.values());
  }

  async findProfessorsForCourseInCurrentPeriod(courseId: string) {
    const period = await this.periodsService.findCurrentPeriod();

    let sections = await this.sectionRepository.find({
      where: {
        course: { id: courseId },
        period: { id: period.id },
      },
      relations: ['professors'],
    });

    // La asignación de líderes debe poder consultar profesores aunque el curso
    // representativo del programa no pertenezca al periodo marcado como actual.
    if (sections.length === 0) {
      sections = await this.sectionRepository.find({
        where: { course: { id: courseId } },
        relations: ['professors'],
      });
    }
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

    const programKey = this.getProgramKey(course.code);
    const patterns = programKey === 'ISIS-4'
      ? ['ISIS-4%', 'ISIS4%']
      : [`${programKey}%`];

    await this.courseRepository
      .createQueryBuilder()
      .update(Course)
      .set({ mainProfessor: professor })
      .where(patterns.map((_, index) => `code LIKE :pattern${index}`).join(' OR '),
        Object.fromEntries(patterns.map((pattern, index) => [`pattern${index}`, pattern])))
      .execute();

    return { ...course, mainProfessor: professor };
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
    });
    if (!course) return false;

    // En pregrado se permite cargar únicamente cursos en los que el profesor
    // está asignado; no se habilita toda la cartelera para cualquier profesor.
    if (this.isUndergraduateCode(course.code)) {
      const assigned = await this.sectionRepository
        .createQueryBuilder('section')
        .innerJoin('section.professors', 'professor')
        .innerJoin('professor.user', 'user')
        .where('section.courseId = :courseId', { courseId })
        .andWhere('user.id = :userId', { userId })
        .getCount();
      return assigned > 0;
    }

    const programKey = this.getProgramKey(course.code);
    const patterns = programKey === 'ISIS-4'
      ? ['ISIS-4%', 'ISIS4%']
      : [`${programKey}%`];
    const leaders = await this.courseRepository
      .createQueryBuilder('course')
      .leftJoin('course.mainProfessor', 'mainProfessor')
      .leftJoin('mainProfessor.user', 'mainProfessorUser')
      .select('mainProfessorUser.id', 'userId')
      .where(patterns.map((_, index) => `course.code LIKE :pattern${index}`).join(' OR '),
        Object.fromEntries(patterns.map((pattern, index) => [`pattern${index}`, pattern])))
      .getRawMany<{ userId: string }>();

    return leaders.some((leader) => leader.userId === userId);
  }

  private isUndergraduateCode(code: string) {
    const normalized = code.toUpperCase().replace(/\s/g, '');
    return normalized.startsWith('ISIS')
      && !(normalized.startsWith('ISIS-4') || normalized.startsWith('ISIS4'));
  }

  private getProgramKey(code: string) {
    const normalized = code.toUpperCase().trim();
    if (normalized.startsWith('ISIS-4') || normalized.startsWith('ISIS4')) return 'ISIS-4';
    return normalized.split('-')[0];
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

  updateSections(section: Section, course: Course, manager?: EntityManager) {
    const repo = manager ? manager.getRepository(Course) : this.courseRepository;
    if (course.sections != undefined) {
      course.sections.push(section);
    } else {
      course.sections = [section];
    }
    return repo.save(course);
  }

  remove(id: number) {
    return `This action removes a #${id} course`;
  }
}
