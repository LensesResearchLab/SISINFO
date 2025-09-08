import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { UpdateProfessorDto } from './dto/update-professor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Professor } from './entities/professor.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { RoleService } from '../common/interfaces/role.service';
import { PeriodsService } from '../periods/periods.service';
import { UploadProfessorDto } from './dto/upload-professor.dto';

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

  async findOne(id: string) {
    const professor = await this.professorRepository.findOne({ where: { id } });
    if (!professor) {
      throw new NotFoundException(`Professor with id ${id} not found`);
    }
    return professor;
  }

  findByName(name: string) {
    const qb = this.professorRepository
      .createQueryBuilder('professor')
      .innerJoinAndSelect('professor.user', 'user')
      .where('LOWER(user.name) = LOWER(:name)', { name });

    return qb.getOne();
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

  async uploadProfessors(professors: UploadProfessorDto[]) {
    const existingProfessors = await this.professorRepository.find();
    const existingEmails = new Set(existingProfessors.map((p) => p.user.email));
    // 2. Set temporal para esta lista
    const seen = new Set<string>();

    const newProfessors = professors.filter((professor) => {
      const email = professor.user.email;
      if (!email) return false;
      if (existingEmails.has(email)) return false; // Already in BD
      if (seen.has(email)) return false; // input duplicated
      seen.add(email); // mark as seen
      return true;
    });

    if (newProfessors.length > 0) {
      await this.professorRepository.save(newProfessors);
    }

    return newProfessors;
  }

  async addRole<T>(user: User, roleInfo: T): Promise<void> {
    let professor = await this.professorRepository.findOne({
      where: { user: { id: user.id } },
      relations: ['user'],
    });
    if (!professor) {
      professor = this.professorRepository.create({
        ...roleInfo,
        user,
      });
    } else {
      professor.isActive = !professor.isActive;
      Object.assign(professor, roleInfo);
    }
    await this.professorRepository.save(professor);
  }
}
