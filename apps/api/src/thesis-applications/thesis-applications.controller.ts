import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { ThesisApplicationsService } from './thesis-applications.service';
import { CreateThesisApplicationDto } from './dto/create-thesis-application.dto';
import { ThesisStatusEnum } from './enums/thesis_status.enum';

@Controller('thesis-applications')
export class ThesisApplicationsController {
  constructor(
    private readonly thesisApplicationsService: ThesisApplicationsService,
  ) {}

  @Post(':studentId')
  create(
    @Param('studentId') studentId: string,
    @Body() createThesisApplicationDto: CreateThesisApplicationDto,
  ) {
    return this.thesisApplicationsService.create({
      ...createThesisApplicationDto,
      studentId,
    });
  }

  @Get()
  findAll() {
    return this.thesisApplicationsService.findAll();
  }

  @Get('thesis-report')
  getThesisApplicationsReport() {
    return this.thesisApplicationsService.getThesisApplicationsReport();
  }

  @Get(':studentId')
  findOne(@Param('studentId') studentId: string) {
    return this.thesisApplicationsService.findOne(studentId);
  }

  @Get('/applicants/:thesisId')
  findAllApplicantsByThesisId(@Param('thesisId') thesisId: string) {
    return this.thesisApplicationsService.findAllApplicantsByThesisId(thesisId);
  }

  @Patch(':applicationId')
  async updateStatus(
    @Param('applicationId') applicationId: string,
    @Body('status') status: ThesisStatusEnum,
  ) {
    return this.thesisApplicationsService.updateStatus(applicationId, status);
  }
}
