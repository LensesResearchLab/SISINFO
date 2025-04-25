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
    const thesisData = await this.thesisRepository.find({
      relations: {
        professor: {
          user: true,
        },
        tags: true,
        period: true,
      },
    });

    thesisData.forEach((thesis) => {
      if (thesis.professor?.user) {
        const { password, ...userWithoutPassword } = thesis.professor.user;
        thesis.professor.user = userWithoutPassword as any;
      }
    });

    return thesisData;
  }

  async findOne(id: string) {
    const thesis = await this.thesisRepository.findOne({
      where: { id },
      relations: {
        professor: {
          user: true,
        },
        tags: true,
        period: true,
      },
    });

    if (!thesis) {
      throw new NotFoundException(`Thesis with id ${id} not found`);
    }

    if (thesis.professor?.user) {
      const { password, ...userWithoutPassword } = thesis.professor.user;
      thesis.professor.user = userWithoutPassword as any;
    }

    return thesis;
  }

  update(id: number, updateThesisDto: UpdateThesisDto) {
    return `This action updates a #${id} thesis`;
  }

  remove(id: number) {
    return `This action removes a #${id} thesis`;
  }
}
