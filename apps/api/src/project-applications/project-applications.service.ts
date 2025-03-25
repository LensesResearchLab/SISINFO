import { Injectable } from '@nestjs/common';
import { CreateProjectApplicationDto } from './dto/create-project-application.dto';
import { UpdateProjectApplicationDto } from './dto/update-project-application.dto';

@Injectable()
export class ProjectApplicationsService {
  create(createProjectApplicationDto: CreateProjectApplicationDto) {
    return 'This action adds a new projectApplication';
  }

  findAll() {
    return `This action returns all projectApplications`;
  }

  findOne(id: number) {
    return `This action returns a #${id} projectApplication`;
  }

  update(id: number, updateProjectApplicationDto: UpdateProjectApplicationDto) {
    return `This action updates a #${id} projectApplication`;
  }

  remove(id: number) {
    return `This action removes a #${id} projectApplication`;
  }
}
