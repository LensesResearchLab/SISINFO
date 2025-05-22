import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findAll() {
    const incidences = await this.incidenceRepository.find({
      relations: { user: true },
    });

    return incidences.map(({ user, ...rest }) => ({
      ...rest,
      userId: user.id,
    }));
  }

  async findOne(id: string) {
    const incidence = await this.incidenceRepository.findOne({ where: { id } });
    if (!incidence) {
      throw new NotFoundException('Incidencia no encontrada');
    }
    return incidence;
  }

  async close(id: string) {
    const incidence = await this.findOne(id);
    incidence.isClosed = true;
    return this.incidenceRepository.save(incidence);
  }
}
