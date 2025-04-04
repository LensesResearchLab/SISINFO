import { Injectable } from '@nestjs/common';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { UpdateProfessorDto } from './dto/update-professor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Professor } from './entities/professor.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { RoleService } from '../common/interfaces/role.service';

@Injectable()
export class ProfessorsService implements RoleService {
  constructor(
    @InjectRepository(Professor)
    private professorRepository: Repository<Professor>,
  ) {}
  async create(createProfessorDto: CreateProfessorDto) {
    const professor = this.professorRepository.create(createProfessorDto);
    await this.professorRepository.save(professor);
    return professor;
  }

  async findAll(): Promise<Professor[]> {
    return this.professorRepository.find();
  }

  findOne(document: string) {
    return this.professorRepository.findOneBy({ document: document });
  }

  async update(document: string, updateProfessorDto: UpdateProfessorDto) {
    const professor = await this.professorRepository.findOneBy({
      document: document,
    });
    if (!professor) return null;
    Object.assign(professor, updateProfessorDto);
    await this.professorRepository.save(professor);
    return professor;
  }

  remove(document: string) {
    return `This action removes a #${document} professor`;
  }

  async addRole<CreateProfessorDto>(
    user: User,
    roleInfo: CreateProfessorDto,
  ): Promise<void> {
    let professor = await this.professorRepository.findOne({
      where: { document: user.document },
    });
    if (!professor) {
      professor = this.professorRepository.create({
        ...roleInfo,
        user: user,
      });
    } else {
      professor.isActive = true;
      Object.assign(professor, roleInfo);
    }
    await this.professorRepository.save(professor);
  }
}
