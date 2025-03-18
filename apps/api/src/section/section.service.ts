import { Inject, Injectable } from '@nestjs/common';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { Repository } from 'typeorm';
import { Section } from './entities/section.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SectionService {
  constructor(
    @InjectRepository(Section) private sectionRepository: Repository<Section>
  ){}

  async create(createSectionDto: CreateSectionDto) {
    const section = this.sectionRepository.create(createSectionDto);
    await this.sectionRepository.save(section);
    return section
  }

  findAll() {
    return `This action returns all section`;
  }

  findOne(id: number) {
    return `This action returns a #${id} section`;
  }

  update(id: number, updateSectionDto: UpdateSectionDto) {
    return `This action updates a #${id} section`;
  }

  remove(id: number) {
    return `This action removes a #${id} section`;
  }
}
