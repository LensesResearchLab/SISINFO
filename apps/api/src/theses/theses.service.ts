import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateThesisDto } from './dto/create-thesis.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Thesis } from './entities/thesis.entity';
import { ProfessorsService } from '../professors/professors.service';
import { deletePasswordFromUser } from '../common/utils/deletePasswordFromUser';
import { PeriodsService } from '../periods/periods.service';

@Injectable()
export class ThesesService {
  constructor(
    private readonly professorService: ProfessorsService,
    @InjectRepository(Thesis)
    private readonly thesisRepository: Repository<Thesis>,
    private readonly periodService: PeriodsService,
  ) {}
  async create(
    createThesisDto: CreateThesisDto,
    professorId: string,
    periodId: string,
  ) {
    const professor = await this.professorService.findOne(professorId);
    const period =
      await this.periodService.findOneByPeriodAndYearString(periodId);

    if (!professor) {
      throw new NotFoundException(
        `Professor with professorId ${professorId} not found`,
      );
    }

    if (!period) {
      throw new NotFoundException(`Period with value ${periodId} not found`);
    }

    const thesis = this.thesisRepository.create({
      ...createThesisDto,
      professor: professor,
      period: period,
    });

    await this.thesisRepository.save(thesis);
    if (thesis.professor?.user) {
      thesis.professor.user = deletePasswordFromUser(thesis.professor.user);
    }
    return thesis;
  }

  async findAll(period?: string) {
    let whereCondition = {};

    if (period) {
      if (!/^\d{6}$/.test(period)) {
        throw new Error(
          'El parámetro semestre debe tener el formato YYYYSS (por ejemplo, 202510)',
        );
      }
      const year = period.slice(0, 4);
      const periodPart = period.slice(4, 6);
      whereCondition = {
        period: {
          year,
          period: periodPart,
        },
      };
    }

    return this.thesisRepository.find({
      where: whereCondition,
      relations: {
        professor: true,
      },
    });
  }

  async findAllByProfessorId(id: string) {
    const thesis = await this.thesisRepository.find({
      relations: {
        professor: {
          user: true,
        },
        tags: true,
        period: true,
      },
      where: {
        professor: {
          id: id,
        },
      },
    });

    if (!thesis) {
      throw new NotFoundException(`Thesis with id professor ${id} not found`);
    }

    return thesis;
  }

  async findOne(id: string) {
    const thesis = await this.thesisRepository.findOne({
      where: { id },
      relations: {
        professor: {
          user: true,
        },
        tags: true,
        period: true,
      },
    });

    if (!thesis) {
      throw new NotFoundException(`Thesis with id ${id} not found`);
    }

    if (thesis.professor?.user) {
      thesis.professor.user = deletePasswordFromUser(thesis.professor.user);
    }

    return thesis;
  }
}
