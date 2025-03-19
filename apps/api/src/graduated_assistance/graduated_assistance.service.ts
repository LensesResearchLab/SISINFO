import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGraduatedAssistanceDto } from './dto/create-graduated_assistance.dto';
import { UpdateGraduatedAssistanceDto } from './dto/update-graduated_assistance.dto';
import { GraduatedAssistance } from './entities/graduated_assistance.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GraduatedAssistanceService {
  constructor(
    @InjectRepository(GraduatedAssistance)
    private graduatedAssistanceRepository: Repository<GraduatedAssistance>,
  ) {}

  async create(createGraduatedAssistanceDto: CreateGraduatedAssistanceDto) {
    const graduatedAssistance = this.graduatedAssistanceRepository.create(
      createGraduatedAssistanceDto,
    );
    await this.graduatedAssistanceRepository.save(graduatedAssistance);
    return graduatedAssistance;
  }

  async findAll(): Promise<any[]> {
    const assistances = await this.graduatedAssistanceRepository.find({
      relations: ['requirements', 'assistant', 'professor', 'period'],
    });

    return assistances.map((assist) => ({
      id: assist.id,
      name: assist.title,
      clasification: assist.clasification,
      description: assist.description,
      assistant: assist.assistant
        ? {
            name: assist.assistant.code,
            semester: assist.assistant.semester,
            isUndergraduate: assist.assistant.isUndergraduate,
          }
        : null,
      professor: assist.professor
        ? {
            name: assist.professor.name,
            email: assist.professor.email,
          }
        : null,
      period: assist.period
        ? {
            start_semester: assist.period.semester,
          }
        : null,
      requirements: assist.requirements.map((req) => req.description),
    }));
  }

  async findOne(id: string): Promise<GraduatedAssistance> {
    const assistance = await this.graduatedAssistanceRepository.findOne({
      where: { id },
      relations: ['requirements', 'assistant', 'professor', 'period'],
    });

    if (!assistance) {
      throw new NotFoundException(
        `Graduated Assistance with ID ${id} not found`,
      );
    }

    return assistance;
  }

  async update(
    id: string,
    updateGraduatedAssistanceDto: UpdateGraduatedAssistanceDto,
  ) {
    const assistance = await this.graduatedAssistanceRepository.findOneBy({
      id,
    });

    if (!assistance) {
      throw new NotFoundException(
        `Graduated assistance with ID ${id} not found`,
      );
    }

    Object.assign(assistance, updateGraduatedAssistanceDto);
    return this.graduatedAssistanceRepository.save(assistance);
  }

  remove(id: number) {
    return `This action removes a #${id} graduatedAssistance`;
  }
}
