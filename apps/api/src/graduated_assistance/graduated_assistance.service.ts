import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGraduatedAssistanceDto } from './dto/create-graduated_assistance.dto';
import { UpdateGraduatedAssistanceDto } from './dto/update-graduated_assistance.dto';
import { GraduatedAssistance } from './entities/graduated_assistance.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PeriodService } from '../period/period.service';
import { RequirementService } from '../requirement/requirement.service';
import { Requirement } from '../requirement/entities/requirement.entity';

@Injectable()
export class GraduatedAssistanceService {
  constructor(
    @InjectRepository(GraduatedAssistance)
    private graduatedAssistanceRepository: Repository<GraduatedAssistance>,
    private periodService: PeriodService,
    private requirementsService: RequirementService
  ) { }

  async create(createGraduatedAssistanceDto: CreateGraduatedAssistanceDto) {
    var requirements: Requirement[] = [];

    // Buscar el periodo
    const period = await this.periodService.findOne(createGraduatedAssistanceDto.periodId);
    if (!period) {
        throw new NotFoundException(
            `Period with ID ${createGraduatedAssistanceDto.periodId} not found`
        );
    }

    // Buscar los requisitos y validarlos
    for (const reqId of createGraduatedAssistanceDto.requirementsId) {
        const requirement = await this.requirementsService.findOne(reqId);
        if (!requirement) {
            throw new NotFoundException(`Requirement with ID ${reqId} not found`);
        }
        requirements.push(requirement);
    }

    // Crear la asistencia graduada
    const graduatedAssistance = this.graduatedAssistanceRepository.create(createGraduatedAssistanceDto);
    graduatedAssistance.period = period;

    // Guardar la asistencia en la base de datos
    const savedAssistance = await this.graduatedAssistanceRepository.save(graduatedAssistance);

    // 🔄 Actualizar cada requirement con el ID de la asistencia creada
    for (const requirement of requirements) {
        requirement.assistance = savedAssistance;
        await this.requirementsService.update(requirement.id, requirement);
    }

    return savedAssistance;
}


  async findAll(): Promise<any[]> {
    const assistances = await this.graduatedAssistanceRepository.find({
      relations: ['requirements', 'assistant', 'professor', 'period'],
    });

    return assistances.map((assist) => ({
      id: assist.id,
      name: assist.title,
      category: assist.category,
      description: assist.description,
      assistant: assist.assistant
        ? {
          name: assist.assistant.code,
          semester: assist.assistant.semester,
          isUndergraduate: assist.assistant.isUndergraduate,
        }
        : null,
      professor: assist.professor
        ? {
          name: assist.professor.name,
          email: assist.professor.email,
        }
        : null,
      period: assist.period
        ? {
          start_semester: assist.period.semester,
        }
        : null,
      requirements: assist.requirements.map((req) => req.name),
    }));
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
