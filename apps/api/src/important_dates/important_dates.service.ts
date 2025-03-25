import { Injectable } from '@nestjs/common';
import { CreateImportantDateDto } from './dto/create-important-date.dto';
import { UpdateImportantDateDto } from './dto/update-important-date.dto';

@Injectable()
export class ImportantDatesService {
  create(createImportantDateDto: CreateImportantDateDto) {
    return 'This action adds a new importantDate';
  }

  findAll() {
    return `This action returns all importantDates`;
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
