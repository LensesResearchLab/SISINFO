import { Injectable } from '@nestjs/common';
import { CreateGraduatedAssistanceDto } from './dto/create-graduated_assistance.dto';
import { UpdateGraduatedAssistanceDto } from './dto/update-graduated_assistance.dto';
import { GraduatedAssistance } from './entities/graduated_assistance.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GraduatedAssistanceService {
  constructor(
    @InjectRepository(GraduatedAssistance) private graduatedAssistanceRepository: Repository<GraduatedAssistance>
  ){}

  async create(createGraduatedAssistanceDto: CreateGraduatedAssistanceDto) {
    const graduatedAssistance = this.graduatedAssistanceRepository.create(createGraduatedAssistanceDto);
    await this.graduatedAssistanceRepository.save(graduatedAssistance);
    return graduatedAssistance
  }

  findAll() {
    return `This action returns all graduatedAssistance`;
  }

  findOne(id: number) {
    return `This action returns a #${id} graduatedAssistance`;
  }

  update(id: number, updateGraduatedAssistanceDto: UpdateGraduatedAssistanceDto) {
    return `This action updates a #${id} graduatedAssistance`;
  }

  remove(id: number) {
    return `This action removes a #${id} graduatedAssistance`;
  }
}
