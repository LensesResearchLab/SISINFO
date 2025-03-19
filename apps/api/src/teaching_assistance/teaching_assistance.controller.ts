import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TeachingAssistanceService } from './teaching_assistance.service';
import { CreateTeachingAssistanceDto } from './dto/create-teaching_assistance.dto';
import { UpdateTeachingAssistanceDto } from './dto/update-teaching_assistance.dto';

@Controller('teaching-assistance')
export class TeachingAssistanceController {
  constructor(private readonly teachingAssistanceService: TeachingAssistanceService) {}

  @Post()
  create(@Body() createTeachingAssistanceDto: CreateTeachingAssistanceDto) {
    return this.teachingAssistanceService.create(createTeachingAssistanceDto);
  }

  @Get()
  findAll() {
    return this.teachingAssistanceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teachingAssistanceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeachingAssistanceDto: UpdateTeachingAssistanceDto) {
    return this.teachingAssistanceService.update(+id, updateTeachingAssistanceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teachingAssistanceService.remove(+id);
  }
}
