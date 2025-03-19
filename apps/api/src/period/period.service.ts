import { Inject, Injectable } from '@nestjs/common';
import { CreatePeriodDto } from './dto/create-period.dto';
import { UpdatePeriodDto } from './dto/update-period.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Period } from './entities/period.entity';

@Injectable()
export class PeriodService {
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

  findOne(id: number) {
    return `This action returns a #${id} period`;
  }

  update(id: number, updatePeriodDto: UpdatePeriodDto) {
    return `This action updates a #${id} period`;
  }

  remove(id: number) {
    return `This action removes a #${id} period`;
  }
}
