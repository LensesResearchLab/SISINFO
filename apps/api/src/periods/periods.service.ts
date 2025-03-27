import { Injectable } from '@nestjs/common';
import { CreatePeriodDto } from './dto/create-period.dto';
import { UpdatePeriodDto } from './dto/update-period.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Period } from './entities/period.entity';

@Injectable()
export class PeriodsService {
  constructor(
    @InjectRepository(Period) private periodRepository: Repository<Period>,
  ) {}
  async create(createPeriodDto: CreatePeriodDto) {
    const period = this.periodRepository.create(createPeriodDto);
    await this.periodRepository.save(period);
    return period;
  }

  async findAll(): Promise<Period[]> {
    return this.periodRepository.find();
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

  findOneByPeriodAndYear(period: string, year: number) {
    return this.periodRepository.findOne({ where: { period, year } });
  }

  update(id: number, updatePeriodDto: UpdatePeriodDto) {
    return `This action updates a #${id} period`;
  }

  remove(id: number) {
    return `This action removes a #${id} period`;
  }
}
