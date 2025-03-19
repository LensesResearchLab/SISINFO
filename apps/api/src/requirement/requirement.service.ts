import { Inject, Injectable } from '@nestjs/common';
import { CreateRequirementDto } from './dto/create-requirement.dto';
import { UpdateRequirementDto } from './dto/update-requirement.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Requirement } from './entities/requirement.entity';

@Injectable()
export class RequirementService {
  constructor(
    @InjectRepository(Requirement)
    private requirementRepository: Repository<Requirement>,
  ) {}

  async create(createRequirementDto: CreateRequirementDto) {
    const requirement = this.requirementRepository.create(createRequirementDto);
    await this.requirementRepository.save(requirement);
    return requirement;
  }

  async findAll(): Promise<Requirement[]> {
    return this.requirementRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} requirement`;
  }

  update(id: number, updateRequirementDto: UpdateRequirementDto) {
    return `This action updates a #${id} requirement`;
  }

  remove(id: number) {
    return `This action removes a #${id} requirement`;
  }
}
