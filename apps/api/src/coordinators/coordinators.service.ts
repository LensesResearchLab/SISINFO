import { Injectable } from '@nestjs/common';
import { CreateCoordinatorDto } from './dto/create-coordinator.dto';
import { UpdateCoordinatorDto } from './dto/update-coordinator.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Coordinator } from './entities/coordinator.entity';
import { Repository } from 'typeorm';
import { RoleService } from '../common/interfaces/role.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CoordinatorsService implements RoleService {
  constructor(
    @InjectRepository(Coordinator)
    private coordinatorRepository: Repository<Coordinator>,
  ) {}

  async create(createCoordinatorDto: CreateCoordinatorDto) {
    const coordinator = this.coordinatorRepository.create(createCoordinatorDto);
    await this.coordinatorRepository.save(coordinator);
    return coordinator;
  }

  findAll() {
    return this.coordinatorRepository.find({
      relations: ['user'],
    });
  }

  async findOne(id: string) {
    const coordinator = await this.coordinatorRepository.findOne({
      where: {
        id,
      },
    });
    if (!coordinator) return null;
    return coordinator;
  }

  async update(id: string, updateCoordinatorDto: UpdateCoordinatorDto) {
    const coordinator = await this.coordinatorRepository.findOneBy({
      id,
    });
    if (!coordinator) return null;
    Object.assign(coordinator, updateCoordinatorDto);
    await this.coordinatorRepository.save(coordinator);
    return coordinator;
  }

  remove(id: number) {
    return `This action removes a #${id} coordinator`;
  }

  async addRole<CreateCoordinatorDto>(
    user: User,
    roleInfo: CreateCoordinatorDto,
  ): Promise<void> {
    let coordinator = await this.coordinatorRepository.findOne({
      where: {
        id: user.id,
      },
    });
    if (!coordinator) {
      coordinator = this.coordinatorRepository.create({
        ...roleInfo,
        user: user,
      });
    } else {
      coordinator.isActive = true;
      Object.assign(coordinator, roleInfo);
    }
    await this.coordinatorRepository.save(coordinator);
  }
}
