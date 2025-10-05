import { Injectable } from '@nestjs/common';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { IsNull, Repository } from 'typeorm';
import { Section } from './entities/section.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Professor } from '../professors/entities/professor.entity';
import { Period } from '../periods/entities/period.entity';
import { CreateSimpleSectionDto } from './dto/create-simple-section.dto';

@Injectable()
export class SectionsService {
  constructor(
    @InjectRepository(Section)
    private readonly sectionRepository: Repository<Section>,
  ) {}

  async create(
    createSectionDto: CreateSectionDto,
    supportProfessors: Professor[],
    professors: Professor[],
    period: Period,
  ) {
    const section = this.sectionRepository.create();
    section.NRC = createSectionDto.NRC;
    section.period = period;
    section.section = createSectionDto.section;
    section.supportProfessors = supportProfessors;
    section.professors = professors;

    await this.sectionRepository.save(section);

    return section;
  }

  async createSimple(
    createSectionDto: CreateSimpleSectionDto,
    supportProfessors: Professor[],
    professors: Professor[],
    period: Period,
  ) {
    const section = this.sectionRepository.create(createSectionDto);
    section.supportProfessors = supportProfessors;
    section.professors = professors;
    section.period = period;

    await this.sectionRepository.save(section);

    return section;
  }

  findAll() {
    return this.sectionRepository.find({
      relations: {
        supportProfessors: true,
        professors: true,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} section`;
  }

  async getReport(reportType: 'program' | 'partial' | 'final') {
    const getField = (reportType: string) => {
      if (reportType === 'program') {
        return reportType;
      }
      return reportType === 'partial' ? 'partialGrades' : 'finalGrades';
    };

    /* Type of report to check */
    const fieldToCheck = getField(reportType);

    const sections = await this.sectionRepository.find({
      where: {
        period: {
          year: 2025,
        },
        course: {
          [fieldToCheck]: IsNull(),
        },
      },
      relations: [
        'period',
        'course',
        'course.mainProfessor',
        'course.mainProfessor.user',
      ],
    });

    // Para el reporte de programa, agrupar por curso en lugar de por sección
    if (reportType === 'program') {
      const coursesMap = new Map<string, any>();

      sections.forEach((section) => {
        const courseKey = section.course.id;

        if (!coursesMap.has(courseKey)) {
          coursesMap.set(courseKey, {
            id: section.course.id,
            courseCode: section.course.code,
            courseName: section.course.name,
            professorName: section.course.mainProfessor?.user.name,
            professorEmail: section.course.mainProfessor?.user.email,
            sections: [],
          });
        }

        const courseData = coursesMap.get(courseKey);
        courseData.sections.push({
          crn: section.NRC,
          section: section.section,
        });
      });

      return Array.from(coursesMap.values()).map((course) => {
        const sectionsStr = course.sections
          .map((s: any) => `${s.section}`)
          .join(', ');
        const crnsStr = course.sections.map((s: any) => s.crn).join(', ');

        return {
          id: course.id,
          crn: crnsStr,
          section: sectionsStr,
          courseCode: course.courseCode,
          courseName: course.courseName,
          professorName: course.professorName,
          professorEmail: course.professorEmail,
        };
      });
    }

    // Para reportes de notas parciales y finales, mantener el formato por sección
    return sections.map((section) => {
      const result = {
        id: section.id,
        crn: section.NRC,
        section: section.section,
        courseCode: section.course.code,
        courseName: section.course.name,
        professorName: section.course.mainProfessor?.user.name,
        professorEmail: section.course.mainProfessor?.user.email,
      };

      return result;
    });
  }

  async getProgramReport() {
    return this.getReport('program');
  }

  async getPartialReport() {
    return this.getReport('partial');
  }

  async getFinalReport() {
    return this.getReport('final');
  }

  async findOneBySectionNumber(
    courseCode: string,
    sectionNumber: number,
    periodId: string,
  ) {
    return this.sectionRepository.findOne({
      where: {
        section: String(sectionNumber),
        course: {
          code: courseCode,
        },
        period: {
          id: periodId,
        },
      },
      relations: ['course'],
    });
  }

  update(id: number, updateSectionDto: UpdateSectionDto) {
    return `This action updates a #${id} section`;
  }

  async findByNRCAndPeriod(NRC: string, period: Period) {
    return await this.sectionRepository.findOne({
      where: { NRC, period },
      relations: ['professors', 'supportProfessors'],
    });
  }

  async updateProfessorsSection(
    section: Section,
    professors: Professor[],
    supportProfessors: Professor[],
  ) {
    if (section.supportProfessors != null) {
      section.supportProfessors =
        section.supportProfessors.concat(supportProfessors);
    } else {
      section.supportProfessors = supportProfessors;
    }
    if (section.professors != null) {
      section.professors = section.professors.concat(professors);
    } else {
      section.professors = professors;
    }
    const sectionUpdated = await this.sectionRepository.save(section);
    return sectionUpdated;
  }

  findByNRC(NRC: string) {
    return this.sectionRepository.findOne({ where: { NRC } });
  }

  remove(id: number) {
    return `This action removes a #${id} section`;
  }
}
