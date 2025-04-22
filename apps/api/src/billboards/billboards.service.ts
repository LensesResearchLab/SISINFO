import { Injectable } from '@nestjs/common';
import { CreateBillboardDto } from './dto/create-billboard.dto';
import { UpdateBillboardDto } from './dto/update-billboard.dto';
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
    private billboardRepository: Repository<Billboard>,

    private periodsService: PeriodsService,
    private courseService: CoursesService,
    private sectionService: SectionsService,
    private professorService: ProfessorsService,
  ) {}

  async create(createBillboardDto: CreateBillboardDto[]) {
    const billboardCoursesMap = new Map<string, Course>();
    const billboardSectionsMap = new Map<string, Section>();

    for (const info of createBillboardDto) {
      const year = Number(info.period.slice(0, 4));
      const semester = info.period.slice(4, 5);
      const periodStr = info.period.slice(4, 6);

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
        info.code,
        periodFound,
      );
      const existingSection = await this.sectionService.findByNRCAndPeriod(
        info.NRC,
        periodFound,
      );

      if (info.professors != null && info.professors !== '') {
        const professorsArr = info.professors.split('|');
        const supportProfessors: Professor[] = [];
        const findedProfessors: Professor[] = [];

        await Promise.all(
          professorsArr.map(async (prof) => {
            const cleanedName = prof
              .replace(/^\s*\(\d+\)\s*/, '')
              .replace(/\s*\([^)]+\)\s*$/, '')
              .trim();
            const searchProfessor =
              await this.professorService.findByName(cleanedName);
            if (searchProfessor) {
              if (/\(01\)/.test(prof)) {
                if (
                  !findedProfessors.find(
                    (p) => p.document === searchProfessor.document,
                  )
                ) {
                  findedProfessors.push(searchProfessor);
                }
              } else if (/\(02\)/.test(prof)) {
                if (
                  !supportProfessors.find(
                    (p) => p.document === searchProfessor.document,
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
          billboardSectionsMap.set(sectionToUse.NRC, sectionToUse);
        } else {
          const newSectionDto = new CreateSectionDto();
          newSectionDto.NRC = info.NRC;
          newSectionDto.section = info.section;
          if (findedProfessors.length === 0 && supportProfessors.length === 0) {
            throw new Error('No professors found for the section');
          }
          sectionToUse = await this.sectionService.create(
            newSectionDto,
            supportProfessors,
            findedProfessors,
            periodFound,
          );
          billboardSectionsMap.set(sectionToUse.NRC, sectionToUse);
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
          courseDto.code = info.code;
          courseDto.credits = +info.credits;
          courseDto.departament = info.departament;
          courseDto.name = info.name;
          existingCourse = await this.courseService.create(
            courseDto,
            sectionToUse,
          );
          billboardCoursesMap.set(info.code, existingCourse);
        }
      }
    }

    const firstInfo = createBillboardDto[0];
    const billboardYear = Number(firstInfo.period.slice(0, 4));
    const firstPeriodStr = firstInfo.period.slice(4, 6);

    let periodForBillboard = await this.periodsService.findOneByPeriodAndYear(
      firstPeriodStr,
      billboardYear,
    );
    if (!periodForBillboard) {
      periodForBillboard = await this.periodsService.create({
        period: firstPeriodStr,
        year: billboardYear,
        semester: firstInfo.period.slice(4, 5) === '1' ? 1 : 2,
      });
    }

    const billboard: Billboard = new Billboard();
    billboard.publicated = true;
    billboard.period = periodForBillboard;
    billboard.courses = Array.from(billboardCoursesMap.values());

    const billboardExisting = await this.findOne(
      billboard.period.year + billboard.period.period,
    );
    if (billboardExisting) {
      billboardExisting.courses = billboard.courses;
      billboardExisting.period = billboard.period;
      billboardExisting.publicated = true;
      await this.billboardRepository.save(billboardExisting);
      return billboardExisting;
    }

    return await this.billboardRepository.save(billboard);
  }

  async findAll() {
    const response= await this.billboardRepository.find({
      relations: [
        'courses',
        'courses.mainProfessor',
        'courses.sections',
        'courses.sections.professors',
        'courses.sections.period',
      ],
    });
    return response
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

  update(id: number, updateBillboardDto: UpdateBillboardDto) {
    return `This action updates a #${id} billboard`;
  }

  remove(id: string) {
    return this.billboardRepository.delete(id);
  }
}
