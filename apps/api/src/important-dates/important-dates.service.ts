import { Injectable } from '@nestjs/common';
import { CreateImportantDateDto } from './dto/create-important-date.dto';
import { UpdateImportantDateDto } from './dto/update-important-date.dto';
import { Repository } from 'typeorm/repository/Repository';
import { ImportantDate } from './entities/important-date.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ImportantSectionsService } from '../important-sections/important-sections.service';

@Injectable()
export class ImportantDatesService {
  constructor(
    @InjectRepository(ImportantDate)
    private readonly importantDateRepository: Repository<ImportantDate>,
    private readonly importantSectionsService: ImportantSectionsService,
  ) {}

  async create(
    createImportantDateDto: CreateImportantDateDto,
  ): Promise<ImportantDate> {
    const section = await this.importantSectionsService.findOne(
      createImportantDateDto.importantSectionId,
    );

    const importantDate = this.importantDateRepository.create(
      createImportantDateDto,
    );
    importantDate.importantSection = section;
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
