import { Injectable } from '@nestjs/common';
import { CreateIncidenceDto } from './dto/create-incidence.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Incidence } from './entities/incidence.entity';

@Injectable()
export class IncidencesService {
  constructor(
    @InjectRepository(Incidence)
    private readonly incidenceRepository: Repository<Incidence>,
  ) {}

  create(createIncidenceDto: CreateIncidenceDto) {
    const incidence = this.incidenceRepository.create(createIncidenceDto);
    return this.incidenceRepository.save(incidence);
  }

  findAll() {
    return this.incidenceRepository.find();
  }
}
