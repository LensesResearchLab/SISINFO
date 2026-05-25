import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImportantSection } from './entities/important-section.entity';
import { Repository } from 'typeorm';
import { PeriodsService } from '../periods/periods.service';
import { AcademicProcess } from './enum/academic-process.enum';
import { Period } from '../periods/entities/period.entity';
import { CreateImportantSectionDto } from './dto/create-important-section.dto';

@Injectable()
export class ImportantSectionsService {
  constructor(
    @InjectRepository(ImportantSection)
    private readonly importantSectionRepository: Repository<ImportantSection>,
    private readonly periodsService: PeriodsService,
  ) {}

  async findByAcademicProcessAndPeriod(
    academicProcessStr: string,
    periodStr: string,
  ) {
    let period: Period;
    if (periodStr) {
      period =
        await this.periodsService.findOneByPeriodAndYearString(periodStr);
    } else {
      period = await this.periodsService.findCurrentPeriod();
    }
    const academicProcess = Object.values(AcademicProcess).includes(
      academicProcessStr as AcademicProcess,
    )
      ? (academicProcessStr as AcademicProcess)
      : undefined;

    if (!academicProcess) {
      throw new Error(`Invalid academicProcess: ${academicProcessStr}`);
    }

    return this.importantSectionRepository.find({
      where: {
        academicProcess,
        period: {
          id: period.id,
        },
      },
      relations: ['importantDates'],
      order: { position: 'ASC', name: 'ASC' },
    });
  }

  findAll() {
    return this.importantSectionRepository.find();
  }

  async findOne(id: string) {
    const section = await this.importantSectionRepository.findOne({
      where: { id },
    });
    if (!section) {
      throw new NotFoundException('Seccion de fechas no encontrada');
    }
    return section;
  }

  async create(createImportantSectionDto: CreateImportantSectionDto) {
    const period = await this.periodsService.findOneByPeriodAndYearString(
      createImportantSectionDto.periodStr,
    );

    const section = this.importantSectionRepository.create(
      createImportantSectionDto,
    );
    section.period = period;
    return await this.importantSectionRepository.save(section);
  }
}
