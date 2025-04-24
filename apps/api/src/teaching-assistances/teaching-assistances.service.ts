import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTeachingAssistanceDto } from './dto/create-teaching-assistance.dto';
import { UpdateTeachingAssistanceDto } from './dto/update-teaching-assistance.dto';
import { TeachingAssistance } from './entities/teaching-assistance.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PeriodsService } from '../periods/periods.service';
import { SectionsService } from '../sections/sections.service';
import { StudentsService } from '../students/students.service';

@Injectable()
export class TeachingAssistancesService {
  constructor(
    @InjectRepository(TeachingAssistance)
    private teachingAssistanceRepository: Repository<TeachingAssistance>,
    private periodsService: PeriodsService,
    private sectionsService: SectionsService,
    private studentsService: StudentsService,
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
      const student = await this.studentsService.findOneByCode(dto.studentCode);
      if (!student) {
        throw new NotFoundException(
          `Estudiante con código ${dto.studentCode} no encontrado.`,
        );
      }

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

      const exists = await this.teachingAssistanceRepository.findOne({
        where: { student, section, period },
      });

      if (exists) {
        throw new BadRequestException(
          `Ya existe una monitoria registrada para el estudiante ${dto.studentCode} en la sección ${dto.sectionNumber} del curso ${dto.courseCode}.`,
        );
      }

      const newAssistance = this.teachingAssistanceRepository.create({
        contractNumber: dto.contractNumber,
        student,
        section,
        period,
      });

      newAssistances.push(newAssistance);
    }
    return await this.teachingAssistanceRepository.save(newAssistances);
  }

  async updateGrade(id: string, grade?: number, gradeDescription?: string) {
    const assistance = await this.teachingAssistanceRepository.findOne({
      where: { id },
    });

    if (!assistance) {
      throw new NotFoundException(`Monitor con id ${id} no encontrado`);
    }

    if (grade !== undefined) {
      assistance.grade = grade;
    }

    if (gradeDescription !== undefined) {
      assistance.gradeDescription = gradeDescription;
    }

    return this.teachingAssistanceRepository.save(assistance);
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
      relations: [
        'student',
        'section',
        'period',
        'section.course',
        'section.professors',
      ],
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} teachingAssistance`;
  }

  update(id: number, updateTeachingAssistanceDto: UpdateTeachingAssistanceDto) {
    return `This action updates a #${id} teachingAssistance`;
  }

  remove(id: number) {
    return `This action removes a #${id} teachingAssistance`;
  }
}
