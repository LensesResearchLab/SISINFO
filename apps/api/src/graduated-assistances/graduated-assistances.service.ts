import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGraduatedAssistanceDto } from './dto/create-graduated_assistance.dto';
import { UpdateGraduatedAssistanceDto } from './dto/update-graduated_assistance.dto';
import { GraduatedAssistance } from './entities/graduated-assistance.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PeriodsService } from '../periods/periods.service';
import { RequirementsService } from '../requirements/requirements.service';
import { Requirement } from '../requirements/entities/requirement.entity';
import { ProfessorsService } from '../professors/professors.service';
import { CreateRequirementDto } from 'src/requirements/dto/create-requirement.dto';
import { AssistanceApplication } from 'src/assistance-applications/entities/assistance-application.entity';

@Injectable()
export class GraduatedAssistancesService {
  constructor(
    @InjectRepository(GraduatedAssistance)
    private graduatedAssistanceRepository: Repository<GraduatedAssistance>,

    @InjectRepository(Requirement)
    private requirementRepository: Repository<Requirement>,

    @InjectRepository(AssistanceApplication)
    private applicationRepository: Repository<AssistanceApplication>,

    private periodsService: PeriodsService,
    private requirementsService: RequirementsService,
    private professorsService: ProfessorsService,
  ) {}

  async create(
    createGraduatedAssistanceDto: CreateGraduatedAssistanceDto,
    professorDocument: string,
  ): Promise<GraduatedAssistance> {
    let requirements = createGraduatedAssistanceDto.requirements;
    let period = await this.periodsService.findOneByPeriodAndYear(
      createGraduatedAssistanceDto.period.period,
      createGraduatedAssistanceDto.period.year,
    );
    let professor = await this.professorsService.findOne(professorDocument);

    if (!period) {
      period = await this.periodsService.create(
        createGraduatedAssistanceDto.period,
      );
    }
    if (!professor) {
      throw new NotFoundException(
        `Professor with document ${professorDocument} not found`,
      );
    }

    let requirementsCreated: Requirement[] = [];

    requirements.map(async (requirement) => {
      const createRequirementDto: CreateRequirementDto = {
        description: requirement,
      };
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
      relations: [
        'requirements',
        'assistant',
        'professor',
        'period',
        'assistanceApplications',
        'assistanceApplications.student',
      ],
    });
    return assistances;
  }

  async findOne(id: string): Promise<GraduatedAssistance> {
    const assistance = await this.graduatedAssistanceRepository.findOne({
      where: { id },
      relations: [
        'requirements',
        'assistant',
        'professor',
        'period',
        'assistanceApplications',
        'assistanceApplications.student',
      ],
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

  async remove(id: string): Promise<void> {
    const assistance = await this.graduatedAssistanceRepository.findOne({
      where: { id },
      relations: ['requirements', 'assistanceApplications'],
    });

    if (!assistance) {
      throw new Error(`GraduatedAssistance with ID ${id} not found`);
    }

    // Deletes first requirements and applications linked
    await this.requirementRepository.delete({
      id: In(assistance.requirements.map((r) => r.id)),
    });

    await this.applicationRepository.delete({
      id: In(assistance.assistanceApplications.map((r) => r.id)),
    });
    await this.graduatedAssistanceRepository.delete(id);
  }
}
