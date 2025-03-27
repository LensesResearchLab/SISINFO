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
    const results = await this.assistanceApplicationRepository.find({
      where: { student: { document: studentDocument } },
      relations: {
        graduatedAssistance: true,
        student: true, // Ensures student data is included
      },
    });
  
    console.log("🔍 Retrieved Applications:", JSON.stringify(results, null, 2));
  
    return results;
  }
  
  

  findOne(id: number) {
    return `This action returns a #${id} assistanceApplication`;
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
