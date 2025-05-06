import { Injectable } from '@nestjs/common';
import { CreateImportantDateDto } from './dto/create-important-date.dto';
import { UpdateImportantDateDto } from './dto/update-important-date.dto';
import { Repository } from 'typeorm/repository/Repository';
import { ImportantDate } from './entities/important-date.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ImportantDatesService {
  constructor(
    @InjectRepository(ImportantDate)
    private readonly importantDateRepository: Repository<ImportantDate>,
  ) {}

  async create(
    createImportantDateDto: CreateImportantDateDto,
  ): Promise<ImportantDate> {
    const importantDate = this.importantDateRepository.create(
      createImportantDateDto,
    );
    return await this.importantDateRepository.save(importantDate);
  }

  async findAll() {
    return await this.importantDateRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} importantDate`;
  }

  update(id: number, updateImportantDateDto: UpdateImportantDateDto) {
    return `This action updates a #${id} importantDate`;
  }

  remove(id: number) {
    return `This action removes a #${id} importantDate`;
  }
}
