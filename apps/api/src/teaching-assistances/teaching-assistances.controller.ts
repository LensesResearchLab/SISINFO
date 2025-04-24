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
import { TeachingAssistancesService } from './teaching-assistances.service';
import { UpdateTeachingAssistanceDto } from './dto/update-teaching-assistance.dto';
import { CreateAllTeachingAssistantship } from './dto/create-all-teaching-assistantship.dto';

@Controller('teaching-assistances')
export class TeachingAssistancesController {
  constructor(
    private readonly teachingAssistancesService: TeachingAssistancesService,
  ) {}

  @Post()
  create(
    @Body() createAllTeachingAssistantship: CreateAllTeachingAssistantship,
  ) {
    return this.teachingAssistancesService.create(
      createAllTeachingAssistantship.assistants,
      createAllTeachingAssistantship.period,
    );
  }
  @Get()
  findAll(@Query('period') period: string) {
    return this.teachingAssistancesService.findAll(period);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teachingAssistancesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTeachingAssistanceDto: UpdateTeachingAssistanceDto,
  ) {
    return this.teachingAssistancesService.update(
      +id,
      updateTeachingAssistanceDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teachingAssistancesService.remove(+id);
  }
}
