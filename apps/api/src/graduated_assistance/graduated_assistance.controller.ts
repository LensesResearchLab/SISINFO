import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GraduatedAssistanceService } from './graduated_assistance.service';
import { CreateGraduatedAssistanceDto } from './dto/create-graduated_assistance.dto';
import { UpdateGraduatedAssistanceDto } from './dto/update-graduated_assistance.dto';

@Controller('graduated-assistance')
export class GraduatedAssistanceController {
  constructor(private readonly graduatedAssistanceService: GraduatedAssistanceService) {}

  @Post()
  create(@Body() createGraduatedAssistanceDto: CreateGraduatedAssistanceDto) {
    return this.graduatedAssistanceService.create(createGraduatedAssistanceDto);
  }

  @Get()
  findAll() {
    return this.graduatedAssistanceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.graduatedAssistanceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGraduatedAssistanceDto: UpdateGraduatedAssistanceDto) {
    return this.graduatedAssistanceService.update(+id, updateGraduatedAssistanceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.graduatedAssistanceService.remove(+id);
  }
}
