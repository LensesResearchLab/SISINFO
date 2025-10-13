import { Injectable, NotFoundException } from '@nestjs/common';
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

  async update(id: string, dto: UpdateImportantDateDto) {
    const current = await this.importantDateRepository.findOne({
      where: { id },
    });
    if (!current) throw new NotFoundException('Important date not found');

    const { name, date, importantSectionId } = dto;

    const entity: Partial<ImportantDate> = { id };
    if (name !== undefined) entity.name = name;
    if (date !== undefined) entity.date = date;

    if (importantSectionId !== undefined) {
      const section =
        await this.importantSectionsService.findOne(importantSectionId);
      if (!section) throw new NotFoundException('Important section not found');
      entity.importantSection = section;
    }

    return this.importantDateRepository.save(entity);
  }

  remove(id: number) {
    return `This action removes a #${id} importantDate`;
  }
}
