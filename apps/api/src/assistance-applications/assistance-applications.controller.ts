import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AssistanceApplicationsService } from './assistance-applications.service';
import { CreateAssistanceApplicationDto } from './dto/create-assistance-application.dto';
import { UpdateAssistanceApplicationDto } from './dto/update-assistance-application.dto';

@Controller('assistance-applications')
export class AssistanceApplicationsController {
  constructor(
    private readonly assistanceApplicationsService: AssistanceApplicationsService,
  ) {}

  @Post()
  async create(
    @Body() createAssistanceApplicationDto: CreateAssistanceApplicationDto,
    @Query('studentDocument') studentDocument: string,
    @Query('graduatedAssistanceId') graduatedAssistanceId: string,
  ) {
    return this.assistanceApplicationsService.create(
      createAssistanceApplicationDto,
      studentDocument,
      graduatedAssistanceId,
    );
  }

  @Get()
  findAll() {
    return this.assistanceApplicationsService.findAll();
  }

  @Get('student/:document')
  findAllByStudentDocument(@Param('document') document: string) {
    return this.assistanceApplicationsService.findAllByStudentDocument(
      document,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assistanceApplicationsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAssistanceApplicationDto: UpdateAssistanceApplicationDto,
  ) {
    return this.assistanceApplicationsService.update(
      +id,
      updateAssistanceApplicationDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assistanceApplicationsService.remove(+id);
  }
}
