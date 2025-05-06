import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePeriodDto } from './dto/create-period.dto';
import { UpdatePeriodDto } from './dto/update-period.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Period } from './entities/period.entity';
import { Not, In } from 'typeorm';

@Injectable()
export class PeriodsService {
  constructor(
    @InjectRepository(Period)
    private readonly periodRepository: Repository<Period>,
  ) {}
  async create(createPeriodDto: CreatePeriodDto) {
    const existingPeriod = await this.periodRepository.findOne({
      where: { period: createPeriodDto.period, year: createPeriodDto.year },
    });
    if (existingPeriod) {
      throw new Error(
        `Period ${createPeriodDto.period} for year ${createPeriodDto.year} already exists`,
      );
    }
    const period = this.periodRepository.create(createPeriodDto);
    await this.periodRepository.save(period);
    return period;
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
    const currentPeriod = periods.reduce((prev, current) => {
      return prev.period > current.period ? prev : current;
    });
    return currentPeriod;
  }

  async findOneByPeriodAndYear(period: string, year: number) {
    return await this.periodRepository.findOne({ where: { period, year } });
  }

  async findOneByPeriodAndYearString(periodStr: string) {
    if (!/^\d{6}$/.test(periodStr)) {
      throw new BadRequestException('El formato del periodo es inválido');
    }
    const year = Number(periodStr.slice(0, 4));
    const period = periodStr.slice(4);
    return await this.findOneByPeriodAndYear(period, year);
  }

  update(id: number, updatePeriodDto: UpdatePeriodDto) {
    return `This action updates a #${id} period`;
  }

  remove(id: number) {
    return `This action removes a #${id} period`;
  }
}
