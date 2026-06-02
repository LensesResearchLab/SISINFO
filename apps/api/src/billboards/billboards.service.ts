import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Billboard } from './entities/billboard.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
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
    private readonly dataSource: DataSource,
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
    manager: EntityManager,
  ) {
    const existingSection = await this.sectionService.findByNRCAndPeriod(
      sectionDto.NRC,
      period,
      manager,
    );

    let sectionToUse: Section;
    if (existingSection != null) {
      sectionToUse = await this.sectionService.updateProfessorsSection(
        existingSection,
        foundProfessors,
        supportProfessors,
        manager,
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
        manager,
      );
    }
    return sectionToUse;
  }

  async getOrCreateCourseBySectionDto(
    sectionDto: CreateSectionDto,
    period: Period,
    sectionToUse: Section,
    manager: EntityManager,
  ) {
    let existingCourse = await this.courseService.findByCodeAndPeriod(
      sectionDto.code,
      period,
      manager,
    );
    if (existingCourse) {
      const sectionAlreadyIncluded = existingCourse.sections?.some(
        (sec) => sec.NRC === sectionToUse.NRC,
      );
      if (!sectionAlreadyIncluded) {
        existingCourse = await this.courseService.updateSections(
          sectionToUse,
          existingCourse,
          manager,
        );
      }
    } else {
      const courseDto = new CreateCourseDto();
      courseDto.code = sectionDto.code;
      courseDto.credits = +sectionDto.credits;
      courseDto.departament = sectionDto.departament;
      courseDto.name = sectionDto.name;
      existingCourse = await this.courseService.create(courseDto, sectionToUse, manager);
    }
    return existingCourse;
  }

  async getProfessors(
    section: CreateSectionDto,
    allProfessors: Professor[],
  ): Promise<[Professor[], Professor[], string[]]> {
    const normalizeName = (name: string) =>
      name
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, ' ');

    const professorsByNormalizedName = new Map(
      allProfessors.map((p) => [normalizeName(p.user.name), p]),
    );

    const professorsArr = section.professors.split('|');
    const supportProfessors: Professor[] = [];
    const foundProfessors: Professor[] = [];
    const missingNames: string[] = [];

    for (const prof of professorsArr) {
      const cleanedName = cleanName(prof);
      const searchProfessor = professorsByNormalizedName.get(normalizeName(cleanedName));

      if (searchProfessor) {
        if (/\(01\)/.test(prof)) {
          if (!foundProfessors.find((p) => p.user.id === searchProfessor.user.id)) {
            foundProfessors.push(searchProfessor);
          }
        } else if (/\(02\)/.test(prof)) {
          if (!supportProfessors.find((p) => p.user.id === searchProfessor.user.id)) {
            supportProfessors.push(searchProfessor);
          }
        }
      } else if (cleanedName.trim() !== '') {
        missingNames.push(cleanedName);
      }
    }

    return [supportProfessors, foundProfessors, missingNames];
  }

  async mergeCourses(billboardExisting: Billboard, billboard: Billboard, manager: EntityManager) {
    const existingCodes = new Set(billboardExisting.courses.map((c) => c.code));
    const newCourses = billboard.courses.filter((c) => !existingCodes.has(c.code));

    billboardExisting.courses = [...billboardExisting.courses, ...newCourses];
    billboardExisting.period = billboard.period;
    billboardExisting.publicated = true;
    await manager.getRepository(Billboard).save(billboardExisting);
    return billboardExisting;
  }

  async getBillboardFromSectionsDto(sectionsDto: CreateSectionDto[], manager: EntityManager) {
    const seenNRCs = new Set<string>();
    const uniqueSectionsDto = sectionsDto.filter((s) => {
      if (seenNRCs.has(s.NRC)) return false;
      seenNRCs.add(s.NRC);
      return true;
    });

    const allProfessors = await this.professorService.findAllWithUsers();

    const billboard: Billboard = new Billboard();
    const billboardCoursesMap = new Map<string, Course>();
    const allMissingProfessors: { name: string; sectionNRC: string; courseName: string }[] = [];

    for (const section of uniqueSectionsDto) {
      const foundPeriod = await this.getOrCreatePeriodBySectionDto(section);
      if (section.professors != null && section.professors !== '') {
        const [supportProfessors, foundProfessors, missingNames] =
          await this.getProfessors(section, allProfessors);

        for (const name of missingNames) {
          allMissingProfessors.push({
            name,
            sectionNRC: section.NRC,
            courseName: section.name,
          });
        }

        const sectionToUse = await this.getOrCreateSectionBySectionDto(
          section,
          foundPeriod,
          foundProfessors,
          supportProfessors,
          manager,
        );

        const existingCourse = await this.getOrCreateCourseBySectionDto(
          section,
          foundPeriod,
          sectionToUse,
          manager,
        );

        billboardCoursesMap.set(existingCourse.code, existingCourse);
      }
    }

    const periodForBillboard = await this.getOrCreatePeriodBySectionDto(
      uniqueSectionsDto[0],
    );

    billboard.publicated = true;
    billboard.period = periodForBillboard;
    billboard.courses = Array.from(billboardCoursesMap.values());
    return { billboard, missingProfessors: allMissingProfessors };
  }

  async create(sectionsDto: CreateSectionDto[]) {
    return await this.dataSource.transaction(async (manager) => {
      const { billboard, missingProfessors } =
        await this.getBillboardFromSectionsDto(sectionsDto, manager);
      const existingBillboard = await this.findOne(
        billboard.period.year + billboard.period.period,
      );
      if (existingBillboard) {
        const saved = await this.mergeCourses(existingBillboard, billboard, manager);
        return { ...saved, missingProfessors };
      }
      const saved = await manager.getRepository(Billboard).save(billboard);
      return { ...saved, missingProfessors };
    });
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
