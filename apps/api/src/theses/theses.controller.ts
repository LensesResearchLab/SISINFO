import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ThesesService } from './theses.service';
import { CreateThesisDto } from './dto/create-thesis.dto';

@Controller('theses')
export class ThesesController {
  constructor(private readonly thesesService: ThesesService) {}

  @Post()
  create(
    @Body() createThesisDto: CreateThesisDto,
    @Query('professorId') professorId: string,
    @Query('period') period: string,
  ) {
    return this.thesesService.create(createThesisDto, professorId, period);
  }

  @Get()
  findAll(@Query('period') period?: string) {
    return this.thesesService.findAll(period);
  }

  @Get('/professor/:professorId')
  findAllByProfessorId(@Param('professorId') professorId: string) {
    return this.thesesService.findAllByProfessorId(professorId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.thesesService.findOne(id);
  }
}
