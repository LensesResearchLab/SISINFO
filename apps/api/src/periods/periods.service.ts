import {
  BadRequestException,
  Injectable,
  PreconditionFailedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePeriodDto } from './dto/create-period.dto';
import { UpdatePeriodDto } from './dto/update-period.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Period } from './entities/period.entity';
import { Not, In, Repository } from 'typeorm';
import { ImportantSection } from '../important-sections/entities/important-section.entity';
import { ImportantDate } from '../important-dates/entities/important-date.entity';

type AcademicProcessStr = 'Tesis pregrado' | 'Tesis postgrado' | 'Asistencia graduada';

@Injectable()
export class PeriodsService {
  constructor(
    @InjectRepository(Period)
    private readonly periodRepository: Repository<Period>,
    @InjectRepository(ImportantSection)
    private readonly importantSectionRepository: Repository<ImportantSection>,
    @InjectRepository(ImportantDate)
    private readonly importantDateRepository: Repository<ImportantDate>,
  ) {}
  async create(createPeriodDto: CreatePeriodDto) {
    const existingPeriod = await this.periodRepository.findOne({
      where: { period: createPeriodDto.period, year: createPeriodDto.year },
    });
    if (existingPeriod) {
      throw new ConflictException(
        `El periodo ${createPeriodDto.period} para el año ${createPeriodDto.year} ya existe`,
      );
    }
    const period = this.periodRepository.create(createPeriodDto);
    await this.periodRepository.save(period);

    // Create default template for important sections and dates for the new period
    try {
      await this.createTemplateForPeriod(period);
    } catch (err) {
      console.error('Error creating default important sections/dates', err);
    }

    return period;
  }

  async generateTemplateByPeriodStr(periodStr: string, force = false) {
    const period = await this.findOneByPeriodAndYearString(periodStr);
    if (!period) throw new Error('Periodo no encontrado');

    // If force=true, remove existing important sections and dates for this period
    if (force) {
      try {
        const existingSections = await this.importantSectionRepository.find({
          where: { period: { id: period.id } },
          relations: ['importantDates'],
        });
        for (const s of existingSections) {
          // delete dates
          for (const d of s.importantDates || []) {
            await this.importantDateRepository.delete(d.id);
          }
          // delete section
          await this.importantSectionRepository.delete(s.id);
        }
      } catch (err) {
        console.error('Error removing existing sections for force regenerate', err);
        throw err;
      }
    }

    // reuse same template creation logic as in create()
    try {
      await this.createTemplateForPeriod(period);
    } catch (err) {
      console.error('Error creating default important sections/dates', err);
      throw err;
    }

    return { message: 'Template generated' };
  }

  private async createTemplateForPeriod(period: Period) {
    const academicProcesses: AcademicProcessStr[] = ['Tesis pregrado', 'Tesis postgrado'];

    const sectionsDatesMap: Record<
      string,
      Array<{ name: string; month: number; day: number; yearOffset?: number }>
    > = {
      Inicio: [
        { name: 'Último día para publicar temas de proyectos de grado', month: 7, day: 10 },
        { name: 'Último día inscribir proyecto', month: 7, day: 13 },
        { name: 'Último día para que el asesor acepte el proyecto de grado', month: 7, day: 14 },
      ],
      Desarrollo: [
        { name: 'Último día para que el estudiante envie la propuesta', month: 8, day: 31 },
        { name: 'Último día para que el profesor valide la propuesta', month: 9, day: 7 },
        { name: 'Último día para que el profesor envie la apreciacion (30%)', month: 10, day: 2 },
        { name: 'Último día para que el estudiante entregue el póster', month: 11, day: 30 },
        { name: 'Último día para que el asesor valide el póster', month: 12, day: 4 },
        { name: 'Último día para que el estudiante informe retiro', month: 10, day: 23 },
        { name: 'Último día para que el asesor reporte la nota', month: 12, day: 7 },
        { name: 'Último día para que el asesor suba el documento ABET', month: 12, day: 10 },
      ],
      Pendiente: [
        { name: 'Último día para que el asesor solicite pendiente', month: 11, day: 27 },
        { name: 'Último día para que el asesor levante pendiente', month: 12, day: 5 },
        { name: 'Último día para que el estudiante entregue el póster', month: 12, day: 1 },
        { name: 'Último día para que el asesor valide el póster', month: 12, day: 4 },
      ],
      'Pendiente Especial': [
        { name: 'Último día para que el asesor solicite pendiente especial', month: 11, day: 27 },
        { name: 'Último día para que el asesor levante pendiente especial', month: 1, day: 25, yearOffset: 1 },
        { name: 'Último día para que el estudiante entregue el póster', month: 1, day: 15, yearOffset: 1 },
        { name: 'Último día para que el asesor valide el póster', month: 1, day: 18, yearOffset: 1 },
      ],
    };

    if (String(period.period) === '10') {
      sectionsDatesMap.Inicio = [
        { name: 'Ãšltimo dÃ­a para publicar temas de proyectos de grado', month: 1, day: 24 },
        { name: 'Ãšltimo dÃ­a inscribir proyecto', month: 1, day: 24 },
        { name: 'Ãšltimo dÃ­a para que el asesor acepte el proyecto de grado', month: 1, day: 24 },
      ];
      sectionsDatesMap.Desarrollo = [
        { name: 'Ãšltimo dÃ­a para que el estudiante envie la propuesta', month: 3, day: 3 },
        { name: 'Ãšltimo dÃ­a para que el profesor valide la propuesta', month: 3, day: 3 },
        { name: 'Ãšltimo dÃ­a para que el profesor envie la apreciacion (30%)', month: 4, day: 15 },
        { name: 'Ãšltimo dÃ­a para que el estudiante entregue el pÃ³ster', month: 5, day: 27 },
        { name: 'Ãšltimo dÃ­a para que el asesor valide el pÃ³ster', month: 5, day: 29 },
        { name: 'Ãšltimo dÃ­a para que el estudiante informe retiro', month: 4, day: 13 },
        { name: 'Ãšltimo dÃ­a para que el asesor reporte la nota', month: 6, day: 4 },
        { name: 'Ãšltimo dÃ­a para que el asesor suba el documento ABET', month: 6, day: 5 },
      ];
      sectionsDatesMap.Pendiente = [
        { name: 'Ãšltimo dÃ­a para que el asesor solicite pendiente', month: 5, day: 22 },
        { name: 'Ãšltimo dÃ­a para que el asesor levante pendiente', month: 6, day: 30 },
        { name: 'Ãšltimo dÃ­a para que el estudiante entregue el pÃ³ster', month: 6, day: 26 },
        { name: 'Ãšltimo dÃ­a para que el asesor valide el pÃ³ster', month: 6, day: 27 },
      ];
      sectionsDatesMap['Pendiente Especial'] = [
        { name: 'Ãšltimo dÃ­a para que el asesor solicite pendiente especial', month: 5, day: 22 },
        { name: 'Ãšltimo dÃ­a para que el asesor levante pendiente especial', month: 7, day: 30 },
        { name: 'Ãšltimo dÃ­a para que el estudiante entregue el pÃ³ster', month: 7, day: 16 },
        { name: 'Ãšltimo dÃ­a para que el asesor valide el pÃ³ster', month: 7, day: 23 },
      ];
    }

    for (const academicProcess of academicProcesses) {
      let positionCounter = 1;
      for (const [sectionName, dates] of Object.entries(sectionsDatesMap)) {
        const section = this.importantSectionRepository.create({
          name: sectionName,
          academicProcess: academicProcess as any,
          period: period,
          position: positionCounter,
        } as Partial<ImportantSection>);
        const savedSection = await this.importantSectionRepository.save(section);
        positionCounter += 1;

        for (const d of dates) {
          const year = period.year + (d.yearOffset || 0);
          const dateObj = new Date(year, d.month - 1, d.day);
          const normalizedName = d.name
            .replace(/^.*ltimo d..a/, '\u00daltimo d\u00eda')
            .replace(/p..ster/g, 'p\u00f3ster')
            .replace(/apreciacion/g, 'apreciaci\u00f3n')
            .replace(/envie/g, 'env\u00ede');
          const importantDate = this.importantDateRepository.create({
            name: normalizedName,
            date: dateObj,
            importantSection: savedSection,
          } as Partial<ImportantDate>);
          await this.importantDateRepository.save(importantDate);
        }
      }
    }
  }

  async findAll(): Promise<Period[]> {
    return await this.periodRepository.find({
      where: {
        period: Not(In(['11', '12'])),
      },
      order: {
        year: 'ASC',
        period: 'ASC',
      },
    });
  }

  async findOne(id: string): Promise<Period> {
    const period = await this.periodRepository.findOne({ where: { id } });
    if (!period) {
      throw new Error(`Period with id ${id} not found`);
    }
    return period;
  }

  async findCurrentPeriod(): Promise<Period> {
    const periods = await this.periodRepository.find();
    if (periods.length === 0) {
      throw new NotFoundException('No periods found');
    }

    const currentPeriod = periods.reduce((prev, current) => {
      if (current.year > prev.year) {
        return current;
      }
      if (current.year === prev.year && current.semester > prev.semester) {
        return current;
      }
      if (
        current.year === prev.year &&
        current.semester === prev.semester &&
        current.period > prev.period
      ) {
        return current;
      }
      return prev;
    }, periods[0]);

    return currentPeriod;
  }

  async findOneByPeriodAndYear(period: string, year: number) {
    const periodFound = await this.periodRepository.findOne({
      where: { period, year },
    });
    if (!periodFound) {
      throw new PreconditionFailedException('Periodo no encontrado');
    }
    return periodFound;
  }

  async findOneByPeriodAndYearString(periodStr: string) {
    if (!/^\d{6}$/.test(periodStr)) {
      throw new BadRequestException('El formato del periodo es inválido');
    }
    const yearInt = Number(periodStr.slice(0, 4));
    const periodInt = periodStr.slice(4);
    return await this.findOneByPeriodAndYear(periodInt, yearInt);
  }

  /**
   * Ensure templates exist for all periods.
   * If force=true, will delete existing sections/dates and recreate.
   */
  async ensureTemplatesForAllPeriods(force = false) {
    const periods = await this.periodRepository.find();
    for (const p of periods) {
      try {
        // If not forcing, skip periods that already have sections
        if (!force) {
          const existingCount = await this.importantSectionRepository.count({
            where: { period: { id: p.id } as any },
          });
          if (existingCount > 0) {
            continue;
          }
        }

        await this.generateTemplateByPeriodStr(`${p.year}${p.period}`, force);
      } catch (err) {
        console.error(`Error ensuring template for period ${p.year}${p.period}:`, err);
        // continue with next period
      }
    }
  }

  async update(id: string, updatePeriodDto: UpdatePeriodDto) {
    const period = await this.periodRepository.findOne({ where: { id } });
    if (!period) throw new NotFoundException('Periodo no encontrado');
    Object.assign(period, updatePeriodDto);
    return this.periodRepository.save(period);
  }

  async remove(id: string) {
    const period = await this.periodRepository.findOne({ where: { id }, relations: ['importantSections', 'projects', 'theses', 'projectApplication', 'sections', 'assistances', 'teachingAssistances'] });
    if (!period) throw new NotFoundException('Periodo no encontrado');
    const hasDependencies = [period.projects, period.theses, period.projectApplication, period.sections, period.assistances, period.teachingAssistances].some((items) => (items?.length ?? 0) > 0);
    if (hasDependencies) throw new ConflictException('No se puede eliminar un periodo que ya tiene información asociada');
    const sections = await this.importantSectionRepository.find({ where: { period: { id } }, relations: ['importantDates'] });
    for (const section of sections) {
      for (const date of section.importantDates ?? []) await this.importantDateRepository.delete(date.id);
      await this.importantSectionRepository.delete(section.id);
    }
    await this.periodRepository.delete(id);
    return { id, deleted: true };
  }
}
