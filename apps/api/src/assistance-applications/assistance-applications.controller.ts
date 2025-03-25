import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
  create(
    @Body() createAssistanceApplicationDto: CreateAssistanceApplicationDto,
  ) {
    return this.assistanceApplicationsService.create(
      createAssistanceApplicationDto,
    );
  }

  @Get()
  findAll() {
    return this.assistanceApplicationsService.findAll();
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
