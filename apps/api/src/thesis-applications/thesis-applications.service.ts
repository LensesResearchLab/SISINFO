import { Injectable } from '@nestjs/common';
import { CreateThesisApplicationDto } from './dto/create-thesis-application.dto';
import { UpdateThesisApplicationDto } from './dto/update-thesis-application.dto';
import { ThesisApplication } from './entities/thesis-application.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ThesisApplicationsService {
  constructor(
    @InjectRepository(ThesisApplication)
    private thesisApplicationRepository: Repository<ThesisApplication>,
  ) {}

  create(createThesisApplicationDto: CreateThesisApplicationDto) {
    return 'This action adds a new thesisApplication';
  }

  findAll() {
    return `This action returns all thesisApplications`;
  }

  findOne(id: number) {
    return `This action returns a #${id} thesisApplication`;
  }

  update(id: number, updateThesisApplicationDto: UpdateThesisApplicationDto) {
    return `This action updates a #${id} thesisApplication`;
  }

  remove(id: number) {
    return `This action removes a #${id} thesisApplication`;
  }

  async getThesisApplicationsReport() {
    const applications = await this.thesisApplicationRepository.find({
      where: {
        student: {
          isUndergraduate: false,
        },
      },
      relations: {
        student: {
          user: true,
        },
        thesis: {
          period: true,
          professor: {
            user: true,
          },
        },
      },
    });

    return applications.map((app) => ({
      student_code: app.student.code,
      student_name: app.student.user.name,
      student_email: app.student.user.email,
      professor_name: app.thesis.professor.user.name,
      professor_email: app.thesis.professor.user.email,
      thesis_investigation_subarea: app.thesis.investigationSubarea,
      thesis_title: app.thesis.title,
      status: app.status,
      thesis_grade: app.grade,
      thesis_period: app.thesis.period,
    }));
  }
}
