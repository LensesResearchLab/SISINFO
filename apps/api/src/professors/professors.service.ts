import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { UpdateProfessorDto } from './dto/update-professor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Professor } from './entities/professor.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { RoleService } from '../common/interfaces/role.service';
import { PeriodsService } from '../periods/periods.service';

@Injectable()
export class ProfessorsService implements RoleService {
  constructor(
    @InjectRepository(Professor)
    private readonly professorRepository: Repository<Professor>,
    private readonly periodsService: PeriodsService,
  ) {}
  async create(createProfessorDto: CreateProfessorDto) {
    const professor = this.professorRepository.create(createProfessorDto);
    await this.professorRepository.save(professor);
    return professor;
  }

  async findAll(): Promise<Professor[]> {
    return this.professorRepository.find();
  }

  async findWithTasByPeriod(periodStr: string, id: string) {
    const period =
      await this.periodsService.findOneByPeriodAndYearString(periodStr);
    if (!period) {
      throw new NotFoundException(
        `No se encontró el periodo con el identificador: ${periodStr}`,
      );
    }

    const professor = await this.professorRepository.findOne({
      where: {
        id,
      },
      relations: [
        'sections',
        'sections.course',
        'sections.period',
        'sections.teachingAssistances',
        'sections.teachingAssistances.student',
        'sections.teachingAssistances.student.user',
      ],
    });

    if (!professor) {
      throw new NotFoundException(`No se encontró el profesor con id: ${id}`);
    }

    const filteredSections = professor.sections.filter(
      (section) =>
        section.period.id === period.id &&
        section.teachingAssistances.length > 0,
    );

    return filteredSections;
  }

  findOne(id: string) {
    return this.professorRepository.findOne({ where: { id } });
  }

  findByName(name: string) {
    return this.professorRepository
      .createQueryBuilder('professor')
      .innerJoinAndSelect('professor.user', 'user')
      .where('LOWER(user.name) = LOWER(:name)', { name })
      .getOne();
  }

  async update(id: string, updateProfessorDto: UpdateProfessorDto) {
    const professor = await this.professorRepository.findOneBy({
      id,
    });
    if (!professor) return null;
    Object.assign(professor, updateProfessorDto);
    await this.professorRepository.save(professor);
    return professor;
  }

  async addRole<T>(user: User, roleInfo: T): Promise<void> {
    let professor = await this.professorRepository.findOne({
      where: { id: user.id },
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
