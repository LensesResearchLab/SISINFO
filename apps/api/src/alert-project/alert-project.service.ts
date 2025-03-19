import { Injectable } from '@nestjs/common';
import { CreateAlertProjectDto } from './dto/create-alert-project.dto';
import { UpdateAlertProjectDto } from './dto/update-alert-project.dto';
import { AlertProject } from './entities/alert-project.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class AlertProjectService {
  constructor(
    @InjectRepository(AlertProject) private alertProjectRepository: Repository<AlertProject>
  ){}

  async create(createAlertProjectDto: CreateAlertProjectDto) {
    const alertProject = this.alertProjectRepository.create(createAlertProjectDto);
    await this.alertProjectRepository.save(alertProject);
    return alertProject
  }

  findAll() {
    return `This action returns all alertProject`;
  }

  findOne(id: number) {
    return `This action returns a #${id} alertProject`;
  }

  update(id: number, updateAlertProjectDto: UpdateAlertProjectDto) {
    return `This action updates a #${id} alertProject`;
  }

  remove(id: number) {
    return `This action removes a #${id} alertProject`;
  }
}
