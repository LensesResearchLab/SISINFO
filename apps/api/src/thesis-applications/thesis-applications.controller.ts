import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ThesisApplicationsService } from './thesis-applications.service';
import { CreateThesisApplicationDto } from './dto/create-thesis-application.dto';

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
}
