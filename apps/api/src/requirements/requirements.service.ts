import { Injectable } from '@nestjs/common';
import { CreateRequirementDto } from './dto/create-requirement.dto';
import { UpdateRequirementDto } from './dto/update-requirement.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Requirement } from './entities/requirement.entity';

@Injectable()
export class RequirementsService {
  constructor(
    @InjectRepository(Requirement)
    private requirementRepository: Repository<Requirement>,
  ) {}

  async create(createRequirementDto: CreateRequirementDto) {
    console.log(createRequirementDto);
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
}
