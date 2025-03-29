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
import { CreateRequirementDto } from 'src/requirements/dto/create-requirement.dto';

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
    professorDocument: string,
  ): Promise<GraduatedAssistance> {
    let date = {year:Number(createGraduatedAssistanceDto.period.split("-")[0]), period:createGraduatedAssistanceDto.period.split("-")[1] }
    let requirements = createGraduatedAssistanceDto.requirements;
    let period = await this.periodsService.findOneByPeriodAndYear(date.period, date.year);
    let professor = await this.professorsService.findOne(professorDocument);

    if (!period) {
      const createPeriod: { year: number; period: string; semester: number } = {
        year: date.year,
        period: date.period,
        semester: date.period[0] === "1" ? 1 : 2,
      };
      period = await this.periodsService.create(createPeriod);
    }
    if (!professor) {
      throw new NotFoundException(
        `Professor with document ${professorDocument} not found`,
      );
    }

    let requirementsCreated: Requirement[] = [];

    requirements.map(async (requirement) => {
      const createRequirementDto: CreateRequirementDto = { description: requirement };
      let created = await this.requirementsService.create(createRequirementDto);
      requirementsCreated.push(created);
    });

    const graduatedAssistance = this.graduatedAssistanceRepository.create({
      ...createGraduatedAssistanceDto,
      period: period,
      professor: professor,
      requirements: requirementsCreated,
    });

    const savedAssistance =
      await this.graduatedAssistanceRepository.save(graduatedAssistance);
    return savedAssistance;
  }

  async findAll(): Promise<GraduatedAssistance[]> {
    const assistances = await this.graduatedAssistanceRepository.find({
      relations: ['requirements', 'assistant', 'professor', 'period', 'assistanceApplications', 'assistanceApplications.student'],
    });
    return assistances;
  }

  async findOne(id: string): Promise<GraduatedAssistance> {
    const assistance = await this.graduatedAssistanceRepository.findOne({
      where: { id },
      relations: ['requirements', 'assistant', 'professor', 'period', 'assistanceApplications', 'assistanceApplications.student'],
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
