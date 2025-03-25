import { Injectable } from '@nestjs/common';
import { CreateThesisApplicationDto } from './dto/create-thesis-application.dto';
import { UpdateThesisApplicationDto } from './dto/update-thesis-application.dto';

@Injectable()
export class ThesisApplicationsService {
  create(createThesisApplicationDto: CreateThesisApplicationDto) {
    return 'This action adds a new thesisApplication';
  }

  findAll() {
    return `This action returns all thesisApplications`;
  }

  findOne(id: number) {
    return `This action returns a #${id} thesisApplication`;
  }

  update(id: number, updateThesisApplicationDto: UpdateThesisApplicationDto) {
    return `This action updates a #${id} thesisApplication`;
  }

  remove(id: number) {
    return `This action removes a #${id} thesisApplication`;
  }
}
