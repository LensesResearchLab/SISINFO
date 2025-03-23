import { Injectable } from '@nestjs/common';
import { CreateTeachingAssistanceDto } from './dto/create-teaching_assistance.dto';
import { UpdateTeachingAssistanceDto } from './dto/update-teaching_assistance.dto';
import { TeachingAssistance } from './entities/teaching_assistance.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TeachingAssistancesService {
  constructor(
    @InjectRepository(TeachingAssistance)
    private teachingAssistanceRepository: Repository<TeachingAssistance>,
  ) {}
  async create(createTeachingAssistanceDto: CreateTeachingAssistanceDto) {
    const teachingAssistance = this.teachingAssistanceRepository.create(
      createTeachingAssistanceDto,
    );
    await this.teachingAssistanceRepository.save(teachingAssistance);
    return teachingAssistance;
  }

  findAll() {
    return `This action returns all teachingAssistance`;
  }

  findOne(id: number) {
    return `This action returns a #${id} teachingAssistance`;
  }

  update(id: number, updateTeachingAssistanceDto: UpdateTeachingAssistanceDto) {
    return `This action updates a #${id} teachingAssistance`;
  }

  remove(id: number) {
    return `This action removes a #${id} teachingAssistance`;
  }
}
