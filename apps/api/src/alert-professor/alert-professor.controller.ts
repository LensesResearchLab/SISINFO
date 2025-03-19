import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AlertProfessorService } from './alert-professor.service';
import { CreateAlertProfessorDto } from './dto/create-alert-professor.dto';
import { UpdateAlertProfessorDto } from './dto/update-alert-professor.dto';

@Controller('alert-professor')
export class AlertProfessorController {
  constructor(private readonly alertProfessorService: AlertProfessorService) {}

  @Post()
  create(@Body() createAlertProfessorDto: CreateAlertProfessorDto) {
    return this.alertProfessorService.create(createAlertProfessorDto);
  }

  @Get()
  findAll() {
    return this.alertProfessorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.alertProfessorService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAlertProfessorDto: UpdateAlertProfessorDto) {
    return this.alertProfessorService.update(+id, updateAlertProfessorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.alertProfessorService.remove(+id);
  }
}
