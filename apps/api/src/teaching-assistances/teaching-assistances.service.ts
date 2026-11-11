import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTeachingAssistanceDto } from './dto/create-teaching-assistance.dto';
import { TeachingAssistance } from './entities/teaching-assistance.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PeriodsService } from '../periods/periods.service';
import { SectionsService } from '../sections/sections.service';
import { UpdateTeachingAssistanceDto } from './dto/update-teaching-assistance.dto';

@Injectable()
export class TeachingAssistancesService {
  constructor(
    @InjectRepository(TeachingAssistance)
    private readonly teachingAssistanceRepository: Repository<TeachingAssistance>,
    private readonly periodsService: PeriodsService,
    private readonly sectionsService: SectionsService,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createTeachingAssistanceDtoList: CreateTeachingAssistanceDto[],
    periodStr: string,
  ) {
    const period =
      await this.periodsService.findOneByPeriodAndYearString(periodStr);
    if (!period) {
      throw new NotFoundException(
        `No se encontró el periodo con el identificador: ${periodStr}`,
      );
    }

    const newAssistances: TeachingAssistance[] = [];

    for (const dto of createTeachingAssistanceDtoList) {
      const section = await this.sectionsService.findOneBySectionNumber(
        dto.courseCode,
        dto.sectionNumber,
        period.id,
      );
      if (!section) {
        throw new NotFoundException(
          `Sección ${dto.sectionNumber} del curso ${dto.courseCode} no encontrada para el periodo ${periodStr}.`,
        );
      }

      if (!dto.studentName) {
        throw new BadRequestException(
          'El nombre del estudiante es obligatorio',
        );
      }
      const studentCode = Number(dto.studentCode);
      const exists = await this.teachingAssistanceRepository.findOne({
        where: { studentCode, section, period },
      });

      if (exists) {
        continue;
      }

      const newAssistance = this.teachingAssistanceRepository.create({
        studentCode,
        studentName: dto.studentName,
        section,
        period,
      });

      newAssistances.push(newAssistance);
    }
    return await this.teachingAssistanceRepository.save(newAssistances);
  }

  async updateGrade(id: string, grade?: number, gradeDescription?: string) {
    return this.dataSource.transaction(async (manager) => {
      const assistance = await manager.findOne(TeachingAssistance, {
        where: { id },
      });

      if (!assistance) {
        throw new NotFoundException(`Monitor con id ${id} no encontrado`);
      }

      if (assistance.grade !== null) {
        throw new BadRequestException(
          `La monitoría con id ${id} ya tiene una nota asignada`,
        );
      }

      if (grade !== undefined) {
        assistance.grade = grade;
      }

      if (gradeDescription !== undefined) {
        assistance.gradeDescription = gradeDescription;
      }

      return manager.save(assistance);
    });
  }

  async findAll(periodStr: string) {
    const period =
      await this.periodsService.findOneByPeriodAndYearString(periodStr);
    if (!period) {
      throw new NotFoundException(
        `No se encontró el periodo con el identificador: ${periodStr}`,
      );
    }
    return this.teachingAssistanceRepository.find({
      where: {
        period: {
          id: period.id,
        },
      },
      relations: ['section', 'period', 'section.course', 'section.professors'],
    });
  }

  async getMonitorsReport(periodStr: string) {
    const period =
      await this.periodsService.findOneByPeriodAndYearString(periodStr);
    if (!period) {
      throw new NotFoundException(
        `No se encontró el periodo con el identificador: ${periodStr}`,
      );
    }

    const monitors = await this.teachingAssistanceRepository.find({
      where: {
        period: {
          id: period.id,
        },
      },
      relations: [
        'section',
        'section.course',
        'section.professors',
        'section.professors.user',
      ],
    });

    return monitors.map((monitor) => ({
      id: monitor.id,
      studentCode: monitor.studentCode,
      studentName: monitor.studentName,
      courseCode: monitor.section.course.code,
      courseName: monitor.section.course.name,
      section: monitor.section.section,
      nrc: monitor.section.NRC,
      professorName:
        monitor.section.professors && monitor.section.professors.length > 0
          ? monitor.section.professors[0].user.name
          : 'Sin asignar',
      professorEmail:
        monitor.section.professors && monitor.section.professors.length > 0
          ? monitor.section.professors[0].user.email
          : 'Sin asignar',
      grade: monitor.grade ?? 'Sin calificar',
      gradeDescription: monitor.gradeDescription ?? 'Sin descripción',
    }));
  }

  findOne(id: string) {
    return this.teachingAssistanceRepository.findOne({ where: { id }, relations: ['section', 'period', 'student'] });
  }

  async update(id: string, updateTeachingAssistanceDto: UpdateTeachingAssistanceDto) {
    const assistance = await this.teachingAssistanceRepository.findOne({ where: { id } });
    if (!assistance) return null;
    Object.assign(assistance, updateTeachingAssistanceDto);
    return this.teachingAssistanceRepository.save(assistance);
  }

  async remove(id: string) {
    const assistance = await this.teachingAssistanceRepository.findOne({ where: { id } });
    if (!assistance) return null;
    await this.teachingAssistanceRepository.remove(assistance);
    return { id, deleted: true };
  }
}
