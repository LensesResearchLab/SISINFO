import { Injectable } from '@nestjs/common';
import { CreateAdministratorDto } from './dto/create-administrator.dto';
import { UpdateAdministratorDto } from './dto/update-administrator.dto';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { Administrator } from './entities/administrator.entity';
import { RoleService } from '../common/interfaces/role.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AdministratorsService implements RoleService {
  constructor(
    @InjectRepository(Administrator)
    private administratorRepository: Repository<Administrator>,
  ) {}

  create(createAdministratorDto: CreateAdministratorDto) {
    const administrator = this.administratorRepository.create(
      createAdministratorDto,
    );
    return this.administratorRepository.save(administrator);
  }

  findAll() {
    return this.administratorRepository.find({
      relations: ['user'],
    });
  }

  async findOne(id: string) {
    const administrator = await this.administratorRepository.findOne({
      where: {
        id,
      },
      relations: ['user'],
    });
    if (!administrator) {
      throw new Error('Administrator not found');
    }
    return administrator;
  }

  async update(id: string, updateAdministratorDto: UpdateAdministratorDto) {
    const administrator = await this.findOne(id);
    Object.assign(administrator, updateAdministratorDto);
    return this.administratorRepository.save(administrator);
  }

  async addRole<CreateAdministratorDto>(
    user: User,
    roleInfo: CreateAdministratorDto,
  ): Promise<void> {
    let administrator = await this.administratorRepository.findOne({
      where: {
        user: {
          id: user.id,
        },
      },
    });
    if (!administrator) {
      administrator = this.administratorRepository.create({
        ...roleInfo,
        user: user,
      });
    } else {
      administrator.isActive = true;
      Object.assign(administrator, roleInfo);
    }
    await this.administratorRepository.save(administrator);
  }
}
