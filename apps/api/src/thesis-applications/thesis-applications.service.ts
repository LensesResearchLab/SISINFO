import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateThesisApplicationDto } from './dto/create-thesis-application.dto';
import { ThesisApplication } from './entities/thesis-application.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../students/entities/student.entity';
import { Thesis } from '../theses/entities/thesis.entity';
import { User } from '../users/entities/user.entity';
import { deletePasswordFromUser } from '../common/utils/deletePasswordFromUser';

@Injectable()
export class ThesisApplicationsService {
  constructor(
    @InjectRepository(ThesisApplication)
    private thesisApplicationRepository: Repository<ThesisApplication>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Thesis)
    private thesisRepository: Repository<Thesis>,
  ) {}

  async create(
    createThesisApplicationDto: CreateThesisApplicationDto,
  ): Promise<ThesisApplication> {
    const { studentId, thesisId, ...rest } = createThesisApplicationDto;

    const student = await this.studentRepository.findOne({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException(
        `Student with studentId ${studentId} not found`,
      );
    }

    const thesis = await this.thesisRepository.findOne({
      where: { id: thesisId },
    });

    if (!thesis) {
      throw new NotFoundException(`Thesis with ID ${thesisId} not found`);
    }

    const thesisApplication = this.thesisApplicationRepository.create({
      ...rest,
      student,
      thesis,
    });

    return await this.thesisApplicationRepository.save(thesisApplication);
  }

  findAll() {
    return `This action returns all thesisApplications`;
  }

  async findOne(studentId: string) {
    const application = await this.thesisApplicationRepository.findOne({
      where: {
        student: {
          id: studentId,
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
        `Thesis application with doc ${studentId} not found`,
      );
    }

    if (application.student?.user) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = application.student.user;
      application.student.user = userWithoutPassword as unknown as User;
    }

    if (application.thesis?.professor?.user) {
      application.thesis.professor.user = deletePasswordFromUser(
        application.thesis.professor.user,
      );
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
      thesis_investigation_subarea: app.thesis.investigationSubarea,
      thesis_title: app.thesis.title,
      status: app.status,
      thesis_grade: app.grade,
      thesis_period: app.thesis.period,
    }));
  }
}
