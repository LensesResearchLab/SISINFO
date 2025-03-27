import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateThesisDto } from './dto/create-thesis.dto';
import { UpdateThesisDto } from './dto/update-thesis.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Thesis } from './entities/thesis.entity';
import { ProfessorsService } from '../professors/professors.service';

@Injectable()
export class ThesesService {
  constructor(
    private readonly professorService: ProfessorsService,
    @InjectRepository(Thesis) private thesisRepository: Repository<Thesis>,
  ) {}
  async create(createThesisDto: CreateThesisDto, professorDocument: string) {
    const professor = await this.professorService.findOne(professorDocument);

    if (!professor) {
      throw new NotFoundException(
        `Professor with document ${professorDocument} not found`,
      );
    }

    const thesis = this.thesisRepository.create({
      ...createThesisDto,
      professor: professor,
    });

    await this.thesisRepository.save(thesis);
    return thesis;
  }

  async findAll() {
    return this.thesisRepository.find({
      relations: {
        professor: true,
        tags: true,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} thesis`;
  }

  update(id: number, updateThesisDto: UpdateThesisDto) {
    return `This action updates a #${id} thesis`;
  }

  remove(id: number) {
    return `This action removes a #${id} thesis`;
  }
}
