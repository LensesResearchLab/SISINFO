import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TeachingAssistancesService } from './teaching-assistances.service';
import { CreateTeachingAssistanceDto } from './dto/create-teaching_assistance.dto';
import { UpdateTeachingAssistanceDto } from './dto/update-teaching_assistance.dto';

@Controller('teaching-assistances')
export class TeachingAssistancesController {
  constructor(
    private readonly teachingAssistancesService: TeachingAssistancesService,
  ) {}

  @Post()
  create(@Body() createTeachingAssistanceDto: CreateTeachingAssistanceDto) {
    return this.teachingAssistancesService.create(createTeachingAssistanceDto);
  }

  @Get()
  findAll() {
    return this.teachingAssistancesService.findAll();
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
