import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AlertsProfessorService } from './alerts-professor.service';
import { CreateAlertProfessorDto } from './dto/create-alert-professor.dto';
import { UpdateAlertProfessorDto } from './dto/update-alert-professor.dto';

@Controller('alerts-professor')
export class AlertsProfessorController {
  constructor(
    private readonly alertsProfessorService: AlertsProfessorService,
  ) {}

  @Post()
  create(@Body() createAlertProfessorDto: CreateAlertProfessorDto) {
    return this.alertsProfessorService.create(createAlertProfessorDto);
  }

  @Get()
  findAll() {
    return this.alertsProfessorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.alertsProfessorService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAlertProfessorDto: UpdateAlertProfessorDto,
  ) {
    return this.alertsProfessorService.update(+id, updateAlertProfessorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.alertsProfessorService.remove(+id);
  }
}
