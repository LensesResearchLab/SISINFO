import { Injectable } from '@nestjs/common';
import { CreateCoordinatorDto } from './dto/create-coordinator.dto';
import { UpdateCoordinatorDto } from './dto/update-coordinator.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Coordinator } from './entities/coordinator.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CoordinatorService {
  constructor(
    @InjectRepository(Coordinator) private coordinatorRepository: Repository<Coordinator>
  ){}

  async create(createCoordinatorDto: CreateCoordinatorDto) {
    const coordinator = this.coordinatorRepository.create(createCoordinatorDto);
    await this.coordinatorRepository.save(coordinator);
    return coordinator
  }

  findAll() {
    return `This action returns all coordinator`;
  }

  findOne(id: number) {
    return `This action returns a #${id} coordinator`;
  }

  update(id: number, updateCoordinatorDto: UpdateCoordinatorDto) {
    return `This action updates a #${id} coordinator`;
  }

  remove(id: number) {
    return `This action removes a #${id} coordinator`;
  }
}
