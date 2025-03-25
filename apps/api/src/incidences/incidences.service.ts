import { Injectable } from '@nestjs/common';
import { CreateIncidenceDto } from './dto/create-incidence.dto';
import { UpdateIncidenceDto } from './dto/update-incidence.dto';

@Injectable()
export class IncidencesService {
  create(createIncidenceDto: CreateIncidenceDto) {
    return 'This action adds a new incidence';
  }

  findAll() {
    return `This action returns all incidences`;
  }

  findOne(id: number) {
    return `This action returns a #${id} incidence`;
  }

  update(id: number, updateIncidenceDto: UpdateIncidenceDto) {
    return `This action updates a #${id} incidence`;
  }

  remove(id: number) {
    return `This action removes a #${id} incidence`;
  }
}
