import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ThesisApplicationsService } from './thesis-applications.service';
import { CreateThesisApplicationDto } from './dto/create-thesis-application.dto';
import { UpdateThesisApplicationDto } from './dto/update-thesis-application.dto';

@Controller('thesis-applications')
export class ThesisApplicationsController {
  constructor(private readonly thesisApplicationsService: ThesisApplicationsService) {}

  @Post()
  create(@Body() createThesisApplicationDto: CreateThesisApplicationDto) {
    return this.thesisApplicationsService.create(createThesisApplicationDto);
  }

  @Get()
  findAll() {
    return this.thesisApplicationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.thesisApplicationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateThesisApplicationDto: UpdateThesisApplicationDto) {
    return this.thesisApplicationsService.update(+id, updateThesisApplicationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.thesisApplicationsService.remove(+id);
  }
}
