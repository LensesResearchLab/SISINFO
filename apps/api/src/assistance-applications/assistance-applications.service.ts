import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAssistanceApplicationDto } from './dto/create-assistance-application.dto';
import { UpdateAssistanceApplicationDto } from './dto/update-assistance-application.dto';
import { GraduatedAssistancesService } from '../graduated-assistances/graduated-assistances.service';
import { StudentsService } from '../students/students.service';
import { InjectRepository } from '@nestjs/typeorm';
import { AssistanceApplication } from './entities/assistance-application.entity';
import { Repository } from 'typeorm';
import { DocumentsService } from '../documents/documents.service';

@Injectable()
export class AssistanceApplicationsService {
  constructor(
    private readonly graduatedAssistancesService: GraduatedAssistancesService,
    private readonly studentsService: StudentsService,
    private readonly documentsService: DocumentsService,
    @InjectRepository(AssistanceApplication)
    private readonly assistanceApplicationRepository: Repository<AssistanceApplication>,
  ) {}

  async create(
    createAssistanceApplicationDto: CreateAssistanceApplicationDto,
    studentDocument: string,
    graduatedAssistanceId: string,
    file: Express.Multer.File,
  ) {
    const assitance = await this.graduatedAssistancesService.findOne(
      graduatedAssistanceId,
    );
    const student = await this.studentsService.findOne(studentDocument);

    if (!assitance) {
      throw new NotFoundException('Assistance not found');
    }
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    const document = await this.documentsService.create({
      name: file.originalname,
      file: file.buffer,
    });

    const application = this.assistanceApplicationRepository.create({
      ...createAssistanceApplicationDto,
      graduatedAssistance: assitance,
      student: student,
      document: document,
    });
    return this.assistanceApplicationRepository.save(application);
  }

  findAll() {
    return 'This action returns all assistanceApplications';
  }

  async findAllByStudentDocument(studentId: string) {
    const results = await this.assistanceApplicationRepository.find({
      where: { student: { id: studentId } },
      relations: {
        graduatedAssistance: {
          professor: true,
        },
        student: true,
      },
    });
    return results;
  }

  async findOne(id: string) {
    const application = await this.assistanceApplicationRepository.findOne({
      where: { id },
      relations: {
        graduatedAssistance: {
          professor: true,
        },
        student: true,
      },
    });
    if (!application) {
      throw new NotFoundException(
        `Assistance Application with ID ${id} not found`,
      );
    }
    return application;
  }

  async findOneDocument(id: string) {
    const application = await this.assistanceApplicationRepository.findOne({
      where: { id },
      relations: {
        graduatedAssistance: {
          professor: true,
        },
        student: true,
        document: true,
      },
    });
    if (!application) {
      throw new NotFoundException(
        `Assistance Application with ID ${id} not found`,
      );
    }
    return application;
  }

  async update(
    id: string,
    updateAssistanceApplicationDto: UpdateAssistanceApplicationDto,
  ) {
    const assistance = await this.assistanceApplicationRepository.findOneBy({
      id,
    });
    if (!assistance) {
      throw new NotFoundException(
        `Graduated assistance with ID ${id} not found`,
      );
    }
    Object.assign(assistance, updateAssistanceApplicationDto);
    return this.assistanceApplicationRepository.save(assistance);
  }

  remove(id: number) {
    return `This action removes a #${id} assistanceApplication`;
  }
}
