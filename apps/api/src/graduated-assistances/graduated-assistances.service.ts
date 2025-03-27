import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGraduatedAssistanceDto } from './dto/create-graduated_assistance.dto';
import { UpdateGraduatedAssistanceDto } from './dto/update-graduated_assistance.dto';
import { GraduatedAssistance } from './entities/graduated-assistance.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PeriodsService } from '../periods/periods.service';
import { RequirementsService } from '../requirements/requirements.service';
import { Requirement } from '../requirements/entities/requirement.entity';
import { ProfessorsService } from '../professors/professors.service';

@Injectable()
export class GraduatedAssistancesService {
  constructor(
    @InjectRepository(GraduatedAssistance)
    private graduatedAssistanceRepository: Repository<GraduatedAssistance>,
    private periodsService: PeriodsService,
    private requirementsService: RequirementsService,
    private professorsService: ProfessorsService,
  ) {}

  async create(
    createGraduatedAssistanceDto: CreateGraduatedAssistanceDto,
    periodId: string,
    requirementsId: string[],
    professorDocument: string,
  ): Promise<GraduatedAssistance> {
    const period = await this.periodsService.findOne(periodId);
    const professor = await this.professorsService.findOne(professorDocument);
    const requirements: Requirement[] =
      await this.requirementsService.findByIds(requirementsId);

    if (!period) {
      throw new NotFoundException(`Period with ID ${periodId} not found`);
    }
    if (!professor) {
      throw new NotFoundException(
        `Professor with document ${professorDocument} not found`,
      );
    }
    if (requirements.length !== requirementsId.length) {
      const notFoundIds = requirementsId.filter(
        (id) => !requirements.some((req) => req.id === id),
      );
      throw new NotFoundException(
        `Some requirements with IDs ${notFoundIds.join(', ')} not found`,
      );
    }

    const graduatedAssistance = this.graduatedAssistanceRepository.create({
      ...createGraduatedAssistanceDto,
      period,
      professor,
      requirements,
    });

    const savedAssistance =
      await this.graduatedAssistanceRepository.save(graduatedAssistance);
    return savedAssistance;
  }

  async findAll(): Promise<GraduatedAssistance[]> {
    const assistances = await this.graduatedAssistanceRepository.find({
      relations: ['requirements', 'assistant', 'professor', 'period'],
    });
    return assistances;
  }

  async findOne(id: string): Promise<GraduatedAssistance> {
    const assistance = await this.graduatedAssistanceRepository.findOne({
      where: { id },
      relations: ['requirements', 'assistant', 'professor', 'period'],
    });

    if (!assistance) {
      throw new NotFoundException(
        `Graduated Assistance with ID ${id} not found`,
      );
    }

    return assistance;
  }

  async update(
    id: string,
    updateGraduatedAssistanceDto: UpdateGraduatedAssistanceDto,
  ) {
    const assistance = await this.graduatedAssistanceRepository.findOneBy({
      id,
    });

    if (!assistance) {
      throw new NotFoundException(
        `Graduated assistance with ID ${id} not found`,
      );
    }

    Object.assign(assistance, updateGraduatedAssistanceDto);
    return this.graduatedAssistanceRepository.save(assistance);
  }

  remove(id: number) {
    return `This action removes a #${id} graduatedAssistance`;
  }
}
