import { Injectable } from '@nestjs/common';
import { CreateAreasOfInterestDto } from './dto/create-areas-of-interest.dto';
import { UpdateAreasOfInterestDto } from './dto/update-areas-of-interest.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AreasOfInterest } from './entities/areas-of-interest.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AreasOfInterestService {
  constructor(
    @InjectRepository(AreasOfInterest)
    private areasOfInterestRepository: Repository<AreasOfInterest>,
  ) {}

  async create(createAreasOfInterestDto: CreateAreasOfInterestDto) {
    const area = this.areasOfInterestRepository.create(
      createAreasOfInterestDto,
    );
    await this.areasOfInterestRepository.save(area);
    return area;
  }

  findAll() {
    return `This action returns all areasOfInterest`;
  }

  findOne(id: number) {
    return `This action returns a #${id} areasOfInterest`;
  }

  update(id: number, updateAreasOfInterestDto: UpdateAreasOfInterestDto) {
    return `This action updates a #${id} areasOfInterest`;
  }

  remove(id: number) {
    return `This action removes a #${id} areasOfInterest`;
  }
}
