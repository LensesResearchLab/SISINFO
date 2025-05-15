import { Injectable } from '@nestjs/common';
import { CreateIncidenceDto } from './dto/create-incidence.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Incidence } from './entities/incidence.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class IncidencesService {
  constructor(
    @InjectRepository(Incidence)
    private readonly incidenceRepository: Repository<Incidence>,
    private readonly usersService: UsersService,
  ) {}

  async create(createIncidenceDto: CreateIncidenceDto, userId: string) {
    const user = await this.usersService.findOne(userId);
    const incidence = this.incidenceRepository.create({
      ...createIncidenceDto,
      user,
    });
    return this.incidenceRepository.save(incidence);
  }

  findAll() {
    return this.incidenceRepository.find();
  }
}
