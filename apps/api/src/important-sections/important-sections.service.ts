import { Injectable } from '@nestjs/common';
import { CreateImportantSectionDto } from './dto/create-important-section.dto';
import { UpdateImportantSectionDto } from './dto/update-important-section.dto';

@Injectable()
export class ImportantSectionsService {
  create(createImportantSectionDto: CreateImportantSectionDto) {
    return 'This action adds a new importantSection';
  }

  findAll() {
    return `This action returns all importantSections`;
  }

  findOne(id: number) {
    return `This action returns a #${id} importantSection`;
  }

  update(id: number, updateImportantSectionDto: UpdateImportantSectionDto) {
    return `This action updates a #${id} importantSection`;
  }

  remove(id: number) {
    return `This action removes a #${id} importantSection`;
  }
}
