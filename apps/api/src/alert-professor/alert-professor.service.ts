import { Injectable } from '@nestjs/common';
import { CreateAlertProfessorDto } from './dto/create-alert-professor.dto';
import { UpdateAlertProfessorDto } from './dto/update-alert-professor.dto';
import { AlertProfessor } from './entities/alert-professor.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AlertProfessorService {
  constructor(
    @InjectRepository(AlertProfessor) private alertProfessorRepository: Repository<AlertProfessor>
  ){}
  async create(createAlertProfessorDto: CreateAlertProfessorDto) {
    const alertProfessor = this.alertProfessorRepository.create(createAlertProfessorDto);
    await this.alertProfessorRepository.save(alertProfessor);
    return alertProfessor
  }

  findAll() {
    return `This action returns all alertProfessor`;
  }

  findOne(id: number) {
    return `This action returns a #${id} alertProfessor`;
  }

  update(id: number, updateAlertProfessorDto: UpdateAlertProfessorDto) {
    return `This action updates a #${id} alertProfessor`;
  }

  remove(id: number) {
    return `This action removes a #${id} alertProfessor`;
  }
}
