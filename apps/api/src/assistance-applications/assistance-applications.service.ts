import { Injectable } from '@nestjs/common';
import { CreateAssistanceApplicationDto } from './dto/create-assistance-application.dto';
import { UpdateAssistanceApplicationDto } from './dto/update-assistance-application.dto';

@Injectable()
export class AssistanceApplicationsService {
  create(createAssistanceApplicationDto: CreateAssistanceApplicationDto) {
    return 'This action adds a new assistanceApplication';
  }

  findAll() {
    return `This action returns all assistanceApplications`;
  }

  findOne(id: number) {
    return `This action returns a #${id} assistanceApplication`;
  }

  update(id: number, updateAssistanceApplicationDto: UpdateAssistanceApplicationDto) {
    return `This action updates a #${id} assistanceApplication`;
  }

  remove(id: number) {
    return `This action removes a #${id} assistanceApplication`;
  }
}
