import { Injectable } from '@nestjs/common';
import { CreateAreasOfInterestDto } from './dto/create-areas-of-interest.dto';
import { UpdateAreasOfInterestDto } from './dto/update-areas-of-interest.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AreasOfInterest } from './entities/areas-of-interest.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AreasOfInterestService {
  constructor(
    @InjectRepository(AreasOfInterest)
    private readonly areasOfInterestRepository: Repository<AreasOfInterest>,
  ) {}

  async create(createAreasOfInterestDto: CreateAreasOfInterestDto) {
    const area = this.areasOfInterestRepository.create(
      createAreasOfInterestDto,
    );
    await this.areasOfInterestRepository.save(area);
    return area;
  }

  async findByDescription(description: string) {
    return await this.areasOfInterestRepository.findOne({
      where: { description: description },
    });
  }

  findAll() {
    return this.areasOfInterestRepository.find({ relations: ['projects'] });
  }

  findOne(id: string) {
    return this.areasOfInterestRepository.findOne({ where: { id }, relations: ['projects'] });
  }

  async update(id: string, updateAreasOfInterestDto: UpdateAreasOfInterestDto) {
    const area = await this.areasOfInterestRepository.findOne({ where: { id } });
    if (!area) return null;
    Object.assign(area, updateAreasOfInterestDto);
    return this.areasOfInterestRepository.save(area);
  }

  async remove(id: string) {
    await this.areasOfInterestRepository.manager.query('DELETE FROM project_areas_of_interest WHERE "areasOfInterestId" = $1', [id]);
    await this.areasOfInterestRepository.delete(id);
    return { id, deleted: true };
  }
}
