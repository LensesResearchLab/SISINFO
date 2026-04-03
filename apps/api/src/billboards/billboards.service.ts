import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Billboard } from './entities/billboard.entity';
import { Repository } from 'typeorm';
import { CreateCourseDto } from '../courses/dto/create-course.dto';
import { Course } from '../courses/entities/course.entity';
import { CreateSectionDto } from '../sections/dto/create-section.dto';
import { Section } from '../sections/entities/section.entity';
import { PeriodsService } from '../periods/periods.service';
import { CoursesService } from '../courses/courses.service';
import { SectionsService } from '../sections/sections.service';
import { ProfessorsService } from '../professors/professors.service';
import { Professor } from '../professors/entities/professor.entity';
import { Period } from '../periods/entities/period.entity';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class BillboardsService {
  constructor(
    @InjectRepository(Billboard)
    private readonly billboardRepository: Repository<Billboard>,

    private readonly periodsService: PeriodsService,
    private readonly courseService: CoursesService,
    private readonly sectionService: SectionsService,
    private readonly professorService: ProfessorsService,
  ) {}

  async getOrCreatePeriodBySectionDto(sectionDto: CreateSectionDto) {
    const mapPeriod = (raw: string) => (raw.startsWith('1') ? '10' : '20');
    const year = Number(sectionDto.period.slice(0, 4));
    const semester = sectionDto.period.slice(4, 5);
    const rawPeriod = sectionDto.period.slice(4, 6);
    const periodStr = mapPeriod(rawPeriod);

    let foundPeriod = await this.periodsService.findOneByPeriodAndYear(
      periodStr,
      year,
    );

    foundPeriod ??= await this.periodsService.create({
      period: periodStr,
      year: year,
      semester: semester === '1' ? 1 : 2,
    });

    return foundPeriod;
  }

  async getOrCreateSectionBySectionDto(
    sectionDto: CreateSectionDto,
    period: Period,
    foundProfessors: Professor[],
    supportProfessors: Professor[],
  ) {
    const existingSection = await this.sectionService.findByNRCAndPeriod(
      sectionDto.NRC,
      period,
    );

    let sectionToUse: Section;
    if (existingSection != null) {
      sectionToUse = await this.sectionService.updateProfessorsSection(
        existingSection,
        foundProfessors,
        supportProfessors,
      );
    } else {
      const newSectionDto = new CreateSectionDto();
      newSectionDto.NRC = sectionDto.NRC;
      newSectionDto.section = sectionDto.section;
      if (foundProfessors.length === 0 && supportProfessors.length === 0) {
        throw new Error('No professors found for the section');
      }
      sectionToUse = await this.sectionService.create(
        newSectionDto,
        supportProfessors,
        foundProfessors,
        period,
      );
    }
    return sectionToUse;
  }

  async getOrCreateCourseBySectionDto(
    sectionDto: CreateSectionDto,
    period: Period,
    sectionToUse: Section,
  ) {
    let existingCourse = await this.courseService.findByCodeAndPeriod(
      sectionDto.code,
      period,
    );
    if (existingCourse) {
      const sectionAlreadyIncluded = existingCourse.sections?.some(
        (sec) => sec.NRC === sectionToUse.NRC,
      );
      if (!sectionAlreadyIncluded) {
        existingCourse = await this.courseService.updateSections(
          sectionToUse,
          existingCourse,
        );
      }
    } else {
      const courseDto = new CreateCourseDto();
      courseDto.code = sectionDto.code;
      courseDto.credits = +sectionDto.credits;
      courseDto.departament = sectionDto.departament;
      courseDto.name = sectionDto.name;
      existingCourse = await this.courseService.create(courseDto, sectionToUse);
    }
    return existingCourse;
  }

  async getProfessors(section: CreateSectionDto) {
    const normalizeName = (name: string) =>
      name.toLowerCase().trim().replace(/\s+/g, ' ');
    const professorsArr = section.professors.split('|');
    const supportProfessors: Professor[] = [];
    const foundProfessors: Professor[] = [];

    await Promise.all(
      professorsArr.map(async (prof) => {
        const cleanedName = cleanName(prof);
        const searchProfessor = await this.professorService.findByName(
          normalizeName(cleanedName),
        );
        if (searchProfessor) {
          if (/\(01\)/.test(prof)) {
            if (
              !foundProfessors.find(
                (p) => p.user.id === searchProfessor.user.id,
              )
            ) {
              foundProfessors.push(searchProfessor);
            }
          } else if (/\(02\)/.test(prof)) {
            if (
              !supportProfessors.find(
                (p) => p.user.id === searchProfessor.user.id,
              )
            ) {
              supportProfessors.push(searchProfessor);
            }
          }
        }
      }),
    );
    return [supportProfessors, foundProfessors];
  }

  async mergeCourses(billboardExisting: Billboard, billboard: Billboard) {
    const combinedCourses = [
      ...billboardExisting.courses,
      ...billboard.courses,
    ];
    const uniqueCoursesMap = new Map(
      combinedCourses.map((course) => [course.code, course]),
    );
    billboardExisting.courses = Array.from(uniqueCoursesMap.values());

    billboardExisting.period = billboard.period;
    billboardExisting.publicated = true;
    await this.billboardRepository.save(billboardExisting);
    return billboardExisting;
  }

  async getBillboardFromSectionsDto(sectionsDto: CreateSectionDto[]) {
    const billboard: Billboard = new Billboard();
    const billboardCoursesMap = new Map<string, Course>();

    for (const section of sectionsDto) {
      const foundPeriod = await this.getOrCreatePeriodBySectionDto(section);
      if (section.professors != null && section.professors !== '') {
        const [supportProfessors, foundProfessors] =
          await this.getProfessors(section);

        const sectionToUse = await this.getOrCreateSectionBySectionDto(
          section,
          foundPeriod,
          foundProfessors,
          supportProfessors,
        );

        const existingCourse = await this.getOrCreateCourseBySectionDto(
          section,
          foundPeriod,
          sectionToUse,
        );

        billboardCoursesMap.set(existingCourse.code, existingCourse);
      }
    }

    const periodForBillboard = await this.getOrCreatePeriodBySectionDto(
      sectionsDto[0],
    );

    billboard.publicated = true;
    billboard.period = periodForBillboard;
    billboard.courses = Array.from(billboardCoursesMap.values());
    return billboard;
  }

  async create(sectionsDto: CreateSectionDto[]) {
    const billboard = await this.getBillboardFromSectionsDto(sectionsDto);
    const existingBillboard = await this.findOne(
      billboard.period.year + billboard.period.period,
    );
    if (existingBillboard) {
      return await this.mergeCourses(existingBillboard, billboard);
    }
    return await this.billboardRepository.save(billboard);
  }

  async findAll() {
    const response = await this.billboardRepository.find({
      relations: [
        'courses',
        'courses.mainProfessor',
        'courses.program',
        'courses.sections',
        'courses.sections.professors',
        'courses.sections.period',
      ],
    });
    return response;
  }

  async findOneWithCoursesProgram(period: string) {
    const year = Number(period.slice(0, 4));
    const periodDigit = period.slice(4, 6);
    const periodBillboard = await this.periodsService.findOneByPeriodAndYear(
      periodDigit,
      year,
    );
    if (!periodBillboard) {
      throw new NotFoundException('Period not found');
    }
    const billboard = await this.billboardRepository.findOne({
      where: { period: periodBillboard },
      relations: [
        'courses',
        'courses.mainProfessor',
        'courses.program',
        'courses.sections',
        'courses.sections.professors',
        'courses.sections.period',
      ],
    });
    if (!billboard) return null;
    //Obtenemos los cursos sin profesores repetidos
    billboard.courses = (billboard.courses ?? [])
      .filter((course: Course) => {
        const program = course.program;

        // No obtener los cursos que no tienen programa
        if (program != null) return true;
      })
      .map((course: Course) => ({
        ...course,
        professors: uniqueProfessorsOfCourse(course),
      }));

    return billboard;
  }

  async findOne(period: string) {
    const year = Number(period.slice(0, 4));
    const periodDigit = period.slice(4, 6);
    const periodBillboard = await this.periodsService.findOneByPeriodAndYear(
      periodDigit,
      year,
    );
    if (!periodBillboard) {
      throw new Error('Period not found');
    }
    const billboard = await this.billboardRepository.findOne({
      where: { period: periodBillboard },
      relations: [
        'courses',
        'courses.mainProfessor',
        'courses.program',
        'courses.sections',
        'courses.sections.professors',
        'courses.sections.period',
      ],
    });
    if (!billboard) return null;
    //Obtenemos los cursos sin profesores repetidos
    billboard.courses =
      billboard.courses?.map((course: Course) => ({
        ...course,
        professors: uniqueProfessorsOfCourse(course),
      })) ?? [];
    return billboard;
  }

  remove(id: string) {
    return this.billboardRepository.delete(id);
  }
}

function cleanName(prof: string): string {
  let name = prof.trim();
  if (name.startsWith('(')) {
    const endIdx = name.indexOf(')');
    const numberPart = name.slice(1, endIdx);
    if (!isNaN(Number(numberPart))) {
      name = name.slice(endIdx + 1).trim();
    }
  }
  const lastOpen = name.lastIndexOf('(');
  const lastClose = name.lastIndexOf(')');
  if (
    lastOpen !== -1 &&
    lastClose === name.length - 1 &&
    lastOpen < lastClose
  ) {
    name = name.slice(0, lastOpen).trim();
  }
  return name;
}

function uniqueProfessorsOfCourse(course: Course): Professor[] {
  const byId = new Map<string, Professor>();
  for (const sec of course.sections ?? []) {
    for (const p of sec.professors ?? []) {
      if (!byId.has(p.id)) byId.set(p.id, p);
    }
  }
  return Array.from(byId.values());
}
