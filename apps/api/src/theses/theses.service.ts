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

  async findAll() {
    const thesisData = await this.thesisRepository.find({
      relations: {
        professor: {
          user: true,
        },
        tags: true,
        period: true,
      },
    });

    thesisData.forEach((thesis) => {
      if (thesis.professor?.user) {
        thesis.professor.user = deletePasswordFromUser(thesis.professor.user);
      }
    });

    return thesisData;
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
