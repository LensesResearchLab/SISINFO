import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImportantSection } from './entities/important-section.entity';
import { Repository } from 'typeorm';
import { PeriodsService } from 'src/periods/periods.service';
import { AcademicProcess } from './enum/academic-process.enum';
import { Period } from 'src/periods/entities/period.entity';

@Injectable()
export class ImportantSectionsService {
  constructor(
    @InjectRepository(ImportantSection)
    private importantSectionRepository: Repository<ImportantSection>,
    private periodsService: PeriodsService,
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
      order: { name: 'ASC' },
    });
  }
}
