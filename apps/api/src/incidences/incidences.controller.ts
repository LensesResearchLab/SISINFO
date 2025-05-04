import { Controller, Get, Post, Body } from '@nestjs/common';
import { IncidencesService } from './incidences.service';
import { CreateIncidenceDto } from './dto/create-incidence.dto';

@Controller('incidences')
export class IncidencesController {
  constructor(private readonly incidencesService: IncidencesService) {}

  @Post()
  create(@Body() createIncidenceDto: CreateIncidenceDto) {
    return this.incidencesService.create(createIncidenceDto);
  }

  @Get()
  findAll() {
    return this.incidencesService.findAll();
  }
}
