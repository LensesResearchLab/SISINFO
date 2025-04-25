import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateThesisApplicationDto } from './dto/create-thesis-application.dto';
import { UpdateThesisApplicationDto } from './dto/update-thesis-application.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ThesisApplication } from './entities/thesis-application.entity';
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

  async findOne(studentDocument: string) {
    const application = await this.thesisApplicationRepository.findOne({
      where: {
        student: {
          document: studentDocument,
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
          tags: true,
        },
      },
    });

    if (!application) {
      throw new NotFoundException(
        `Thesis application with doc ${studentDocument} not found`,
      );
    }

    if (application.student?.user) {
      const { password, ...userWithoutPassword } = application.student.user;
      application.student.user = userWithoutPassword as any;
    }

    if (application.thesis?.professor?.user) {
      const { password, ...userWithoutPassword } =
        application.thesis.professor.user;
      application.thesis.professor.user = userWithoutPassword as any;
    }

    return application;
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
      thesis_investigation_subarea: app.thesis.investigation_subarea,
      thesis_title: app.thesis.title,
      status: app.status,
      thesis_grade: app.grade,
      thesis_period: app.thesis.period,
    }));
  }

  update(id: number, updateThesisApplicationDto: UpdateThesisApplicationDto) {
    return `This action updates a #${id} thesisApplication`;
  }

  remove(id: number) {
    return `This action removes a #${id} thesisApplication`;
  }
}
