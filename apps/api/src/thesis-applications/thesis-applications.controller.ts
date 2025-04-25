import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ThesisApplicationsService } from './thesis-applications.service';
import { CreateThesisApplicationDto } from './dto/create-thesis-application.dto';
import { UpdateThesisApplicationDto } from './dto/update-thesis-application.dto';

@Controller('thesis-applications')
export class ThesisApplicationsController {
  constructor(
    private readonly thesisApplicationsService: ThesisApplicationsService,
  ) {}

  @Post(':studentDocument')
  create(
    @Param('studentDocument') studentDocument: string,
    @Body() createThesisApplicationDto: CreateThesisApplicationDto,
  ) {
    return this.thesisApplicationsService.create({
      ...createThesisApplicationDto,
      studentDocument,
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

  @Get(':studentDocument')
  findOne(@Param('studentDocument') studentDocument: string) {
    return this.thesisApplicationsService.findOne(studentDocument);
  }

  /*
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateThesisApplicationDto: UpdateThesisApplicationDto,
  ) {
    return this.thesisApplicationsService.update(
      +id,
      updateThesisApplicationDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.thesisApplicationsService.remove(+id);
  }
    */
}
