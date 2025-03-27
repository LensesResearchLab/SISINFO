import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAssistanceApplicationDto } from './dto/create-assistance-application.dto';
import { UpdateAssistanceApplicationDto } from './dto/update-assistance-application.dto';
import { GraduatedAssistancesService } from '../graduated-assistances/graduated-assistances.service';
import { StudentsService } from '../students/students.service';
import { InjectRepository } from '@nestjs/typeorm';
import { AssistanceApplication } from './entities/assistance-application.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AssistanceApplicationsService {
  constructor(
    private readonly graduatedAssistancesService: GraduatedAssistancesService,
    private readonly studentsService: StudentsService,
    @InjectRepository(AssistanceApplication)
    private assistanceApplicationRepository: Repository<AssistanceApplication>,
  ) {}

  async create(
    createAssistanceApplicationDto: CreateAssistanceApplicationDto,
    studentDocument: string,
    graduatedAssistanceId: string,
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
    const application = this.assistanceApplicationRepository.create({
      ...createAssistanceApplicationDto,
      graduatedAssistance: assitance,
      student: student,
    });
    return this.assistanceApplicationRepository.save(application);
  }

  findAll() {
    return 'This action returns all assistanceApplications';
  }

  async findAllByStudentDocument(studentDocument: string) {
    return this.assistanceApplicationRepository.find({
      where: { student: { document: studentDocument } },
      relations: {
        graduatedAssistance: true,
        student: true,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} assistanceApplication`;
  }

  update(
    id: number,
    updateAssistanceApplicationDto: UpdateAssistanceApplicationDto,
  ) {
    return `This action updates a #${id} assistanceApplication`;
  }

  remove(id: number) {
    return `This action removes a #${id} assistanceApplication`;
  }
}
