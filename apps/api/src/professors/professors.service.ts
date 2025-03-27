import { Injectable } from '@nestjs/common';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { UpdateProfessorDto } from './dto/update-professor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Professor } from './entities/professor.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfessorsService {
  constructor(
    @InjectRepository(Professor)
    private professorRepository: Repository<Professor>,
  ) {}
  async create(createProfessorDto: CreateProfessorDto) {
    const professor = this.professorRepository.create(createProfessorDto);
    await this.professorRepository.save(professor);
    return professor;
  }

  async findAll(): Promise<Professor[]> {
    return this.professorRepository.find();
  }

  findOne(document: string) {
    return this.professorRepository.findOneBy({ document: document });
  }

  update(document: string, updateProfessorDto: UpdateProfessorDto) {
    return `This action updates a #${document} professor`;
  }

  remove(document: string) {
    return `This action removes a #${document} professor`;
  }
}
