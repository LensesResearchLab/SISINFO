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
    return 'This action adds a new administrator';
  }

  findAll() {
    return `This action returns all administrators`;
  }

  findOne(id: number) {
    return `This action returns a #${id} administrator`;
  }

  update(id: number, updateAdministratorDto: UpdateAdministratorDto) {
    return `This action updates a #${id} administrator`;
  }

  remove(id: number) {
    return `This action removes a #${id} administrator`;
  }

  async addRole<CreateAdministratorDto>(
    user: User,
    roleInfo: CreateAdministratorDto,
  ): Promise<void> {
    let administrator = await this.administratorRepository.findOne({
      where: { document: user.document },
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
