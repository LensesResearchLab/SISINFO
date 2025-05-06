import { Injectable } from '@nestjs/common';
import { CreateRequirementDto } from './dto/create-requirement.dto';
import { UpdateRequirementDto } from './dto/update-requirement.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Requirement } from './entities/requirement.entity';
import { GraduatedAssistance } from '../graduated-assistances/entities/graduated-assistance.entity';

@Injectable()
export class RequirementsService {
  constructor(
    @InjectRepository(Requirement)
    private readonly requirementRepository: Repository<Requirement>,

    @InjectRepository(GraduatedAssistance)
    private readonly graduatedAssistanceRepository: Repository<GraduatedAssistance>,
  ) {}

  async create(createRequirementDto: CreateRequirementDto) {
    const requirement = this.requirementRepository.create(createRequirementDto);
    await this.requirementRepository.save(requirement);
    return requirement;
  }

  async findAll(): Promise<Requirement[]> {
    return this.requirementRepository.find();
  }

  findOne(id: string) {
    return this.requirementRepository.findOneBy({
      id,
    });
  }

  async findByIds(ids: string[]): Promise<Requirement[]> {
    if (ids.length === 0) {
      return [];
    }
    return await this.requirementRepository.find({
      where: { id: In(ids) },
    });
  }

  async update(id: string, updateRequirementDto: UpdateRequirementDto) {
    const req = await this.requirementRepository.findOneBy({
      id,
    });

    if (!req) {
      throw new Error(`Requirement with ID ${id} not found`);
    }

    Object.assign(req, updateRequirementDto);
    return this.requirementRepository.save(req);
  }

  remove(id: number) {
    return `This action removes a #${id} requirement`;
  }

  async linkRequirementToAssistance(
    requirementId: string,
    graduatedAssistanceId: string,
  ) {
    const requirement = await this.requirementRepository.findOne({
      where: { id: requirementId },
      relations: ['assistances'],
    });

    const assistance = await this.graduatedAssistanceRepository.findOneBy({
      id: graduatedAssistanceId,
    });

    if (!requirement || !assistance) {
      throw new Error('Requirement or Project not found');
    }

    requirement.assistances.push(assistance);
    return this.requirementRepository.save(requirement);
  }
}
