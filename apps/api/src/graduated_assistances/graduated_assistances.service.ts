import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGraduatedAssistanceDto } from './dto/create-graduated_assistance.dto';
import { UpdateGraduatedAssistanceDto } from './dto/update-graduated_assistance.dto';
import { GraduatedAssistance } from './entities/graduated_assistance.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PeriodsService } from '../periods/periods.service';
import { RequirementsService } from '../requirements/requirements.service';
import { Requirement } from '../requirements/entities/requirement.entity';

@Injectable()
export class GraduatedAssistancesService {
  constructor(
    @InjectRepository(GraduatedAssistance)
    private graduatedAssistanceRepository: Repository<GraduatedAssistance>,
    private periodsService: PeriodsService,
    private requirementsService: RequirementsService,
  ) {}

  async create(createGraduatedAssistanceDto: CreateGraduatedAssistanceDto) {
    const requirements: Requirement[] = [];

    // Find the period
    const period = await this.periodsService.findOne(
      createGraduatedAssistanceDto.periodId,
    );
    if (!period) {
      throw new NotFoundException(
        `Period with ID ${createGraduatedAssistanceDto.periodId} not found`,
      );
    }

    // Find and validate the requirements
    for (const reqId of createGraduatedAssistanceDto.requirementsId) {
      const requirement = await this.requirementsService.findOne(reqId);
      if (!requirement) {
        throw new NotFoundException(`Requirement with ID ${reqId} not found`);
      }
      requirements.push(requirement);
    }

    // Create the graduated assistance
    const graduatedAssistance = this.graduatedAssistanceRepository.create(
      createGraduatedAssistanceDto,
    );
    graduatedAssistance.period = period;

    // Save the assistance in the database
    const savedAssistance =
      await this.graduatedAssistanceRepository.save(graduatedAssistance);

    // Update each requirement with the ID of the created assistance
    for (const requirement of requirements) {
      requirement.assistance = savedAssistance;
      await this.requirementsService.update(requirement.id, requirement);
    }

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
