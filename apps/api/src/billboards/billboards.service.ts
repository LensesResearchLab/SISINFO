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

  async create(sectionsDto: CreateSectionDto[]) {
    const billboardCoursesMap = new Map<string, Course>();

    const normalizeName = (name: string) =>
      name.toLowerCase().trim().replace(/\s+/g, ' ');

    const mapPeriod = (raw: string) => (raw.startsWith('1') ? '10' : '20');

    for (const section of sectionsDto) {
      const year = Number(section.period.slice(0, 4));
      const semester = section.period.slice(4, 5);
      const rawPeriod = section.period.slice(4, 6);
      const periodStr = mapPeriod(rawPeriod);

      console.log(year, semester, periodStr);

      let periodFound = await this.periodsService.findOneByPeriodAndYear(
        periodStr,
        year,
      );
      if (!periodFound) {
        periodFound = await this.periodsService.create({
          period: periodStr,
          year: year,
          semester: semester === '1' ? 1 : 2,
        });
      }
      if (!periodFound) {
        throw new Error('Period not found');
      }

      let existingCourse = await this.courseService.findByCodeAndPeriod(
        section.code,
        periodFound,
      );
      const existingSection = await this.sectionService.findByNRCAndPeriod(
        section.NRC,
        periodFound,
      );

      if (section.professors != null && section.professors !== '') {
        const professorsArr = section.professors.split('|');
        const supportProfessors: Professor[] = [];
        const findedProfessors: Professor[] = [];

        await Promise.all(
          professorsArr.map(async (prof) => {
            console.log(prof);
            const cleanedName = cleanName(prof);
            const searchProfessor = await this.professorService.findByName(
              normalizeName(cleanedName),
            );
            if (searchProfessor) {
              if (/\(01\)/.test(prof)) {
                if (
                  !findedProfessors.find(
                    (p) => p.user.id === searchProfessor.user.id,
                  )
                ) {
                  findedProfessors.push(searchProfessor);
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

        let sectionToUse: Section;
        if (existingSection != null) {
          sectionToUse = await this.sectionService.updateProfessorsSection(
            existingSection,
            findedProfessors,
            supportProfessors,
          );
        } else {
          const newSectionDto = new CreateSectionDto();
          newSectionDto.NRC = section.NRC;
          newSectionDto.section = section.section;
          console.log(findedProfessors);
          console.log(supportProfessors);
          if (findedProfessors.length === 0 && supportProfessors.length === 0) {
            throw new Error('No professors found for the section');
          }
          sectionToUse = await this.sectionService.create(
            newSectionDto,
            supportProfessors,
            findedProfessors,
            periodFound,
          );
        }

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
          billboardCoursesMap.set(existingCourse.code, existingCourse);
        } else {
          const courseDto = new CreateCourseDto();
          courseDto.code = section.code;
          courseDto.credits = +section.credits;
          courseDto.departament = section.departament;
          courseDto.name = section.name;
          existingCourse = await this.courseService.create(
            courseDto,
            sectionToUse,
          );
          billboardCoursesMap.set(section.code, existingCourse);
        }
      }
    }

    const firstsection = sectionsDto[0];
    const billboardYear = Number(firstsection.period.slice(0, 4));
    const firstRawPeriod = firstsection.period.slice(4, 6);
    const firstPeriodStr = mapPeriod(firstRawPeriod);

    let periodForBillboard = await this.periodsService.findOneByPeriodAndYear(
      firstPeriodStr,
      billboardYear,
    );
    if (!periodForBillboard) {
      periodForBillboard = await this.periodsService.create({
        period: firstPeriodStr,
        year: billboardYear,
        semester: firstsection.period.slice(4, 5) === '1' ? 1 : 2,
      });
    }

    const billboard: Billboard = new Billboard();
    billboard.publicated = true;
    billboard.period = periodForBillboard;
    billboard.courses = Array.from(billboardCoursesMap.values());

    const billboardExisting = await this.findOne(
      billboard.period.year + billboard.period.period,
    );
    console.log(billboardExisting);
    if (billboardExisting) {
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

    return await this.billboardRepository.save(billboard);
  }

  async findAll() {
    const response = await this.billboardRepository.find({
      relations: [
        'courses',
        'courses.mainProfessor',
        'courses.sections',
        'courses.sections.professors',
        'courses.sections.period',
      ],
    });
    return response;
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
        'courses.sections',
        'courses.sections.professors',
        'courses.sections.period',
      ],
    });
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
